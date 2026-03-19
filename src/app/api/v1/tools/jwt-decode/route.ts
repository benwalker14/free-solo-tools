import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/jwt-decode
 * Decode a JWT token into its header, payload, and signature.
 *
 * Body: { "token": "eyJ..." }
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { token } = await request.json();

    if (typeof token !== "string" || !token.trim()) {
      return NextResponse.json(
        { error: "Missing required field: token" },
        { status: 400 }
      );
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
      return NextResponse.json(
        { error: "Invalid JWT format. Expected 3 dot-separated parts." },
        { status: 400 }
      );
    }

    const decodeBase64Url = (str: string): string => {
      const padded = str.replace(/-/g, "+").replace(/_/g, "/");
      return Buffer.from(padded, "base64").toString("utf-8");
    };

    const header = JSON.parse(decodeBase64Url(parts[0]));
    const payload = JSON.parse(decodeBase64Url(parts[1]));
    const signature = parts[2];

    // Add human-readable timestamps if present
    const timestamps: Record<string, string> = {};
    for (const key of ["iat", "exp", "nbf"] as const) {
      if (typeof payload[key] === "number") {
        timestamps[key] = new Date(payload[key] * 1000).toISOString();
      }
    }

    const isExpired =
      typeof payload.exp === "number" && payload.exp * 1000 < Date.now();

    return NextResponse.json({
      header,
      payload,
      signature,
      timestamps,
      expired: isExpired,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to decode JWT. Check that the token is valid." },
      { status: 400 }
    );
  }
}
