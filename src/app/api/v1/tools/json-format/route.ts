import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/json-format
 * Format, validate, or minify JSON.
 *
 * Body: { "input": "...", "action": "format" | "minify" | "validate", "indent": 2 }
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const { input, action = "format", indent = 2 } = await request.json();

    if (typeof input !== "string" || !input.trim()) {
      return NextResponse.json(
        { error: "Missing required field: input" },
        { status: 400 }
      );
    }

    const parsed = JSON.parse(input);

    switch (action) {
      case "minify":
        return NextResponse.json({
          result: JSON.stringify(parsed),
          valid: true,
        });
      case "validate":
        return NextResponse.json({ valid: true });
      case "format":
      default:
        return NextResponse.json({
          result: JSON.stringify(parsed, null, indent),
          valid: true,
        });
    }
  } catch (err) {
    const message =
      err instanceof SyntaxError ? err.message : "Invalid JSON input";
    return NextResponse.json(
      { error: message, valid: false },
      { status: 400 }
    );
  }
}
