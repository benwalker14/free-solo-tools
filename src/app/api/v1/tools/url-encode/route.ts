import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/url-encode
 * URL encode or decode strings.
 *
 * Body: { "input": "...", "action": "encode" | "decode", "mode": "component" | "full" }
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { input, action = "encode", mode = "component" } = await request.json();

    if (typeof input !== "string") {
      return NextResponse.json(
        { error: "Missing required field: input" },
        { status: 400 }
      );
    }

    let result: string;

    if (action === "decode") {
      result =
        mode === "full" ? decodeURI(input) : decodeURIComponent(input);
    } else {
      result =
        mode === "full" ? encodeURI(input) : encodeURIComponent(input);
    }

    return NextResponse.json({ result });
  } catch {
    return NextResponse.json(
      { error: "URL encoding/decoding failed. Check your input." },
      { status: 400 }
    );
  }
}
