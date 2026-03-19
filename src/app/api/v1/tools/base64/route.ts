import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/base64
 * Encode or decode Base64 strings.
 *
 * Body: { "input": "...", "action": "encode" | "decode" }
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { input, action = "encode" } = await request.json();

    if (typeof input !== "string") {
      return NextResponse.json(
        { error: "Missing required field: input" },
        { status: 400 }
      );
    }

    if (action === "decode") {
      const decoded = Buffer.from(input, "base64").toString("utf-8");
      return NextResponse.json({ result: decoded });
    }

    const encoded = Buffer.from(input, "utf-8").toString("base64");
    return NextResponse.json({ result: encoded });
  } catch {
    return NextResponse.json(
      { error: "Base64 operation failed. Check your input." },
      { status: 400 }
    );
  }
}
