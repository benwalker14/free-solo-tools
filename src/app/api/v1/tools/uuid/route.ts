import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/uuid
 * Generate UUID v4 identifiers.
 *
 * Body: { "count": 1, "uppercase": false }
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));
    const count = Math.min(Math.max(Number(body.count) || 1, 1), 100);
    const uppercase = body.uppercase === true;

    const uuids: string[] = [];
    for (let i = 0; i < count; i++) {
      const id = randomUUID();
      uuids.push(uppercase ? id.toUpperCase() : id);
    }

    return NextResponse.json({
      uuids,
      count: uuids.length,
    });
  } catch {
    return NextResponse.json(
      { error: "UUID generation failed." },
      { status: 400 }
    );
  }
}
