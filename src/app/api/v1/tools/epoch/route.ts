import { NextRequest, NextResponse } from "next/server";
import { authenticateApiKey } from "@/lib/api-auth";

/**
 * POST /api/v1/tools/epoch
 * Convert between Unix timestamps and ISO dates.
 *
 * Body: { "timestamp": 1700000000 }       → converts epoch to date
 *   OR: { "date": "2023-11-14T22:13:20Z" } → converts date to epoch
 *   OR: { "action": "now" }               → returns current time
 */
export async function POST(request: NextRequest) {
  const auth = await authenticateApiKey(
    request.headers.get("authorization")
  );
  if (auth.error) return auth.error;

  try {
    const body = await request.json().catch(() => ({}));

    // Current time
    if (body.action === "now" || (!body.timestamp && !body.date)) {
      const now = new Date();
      return NextResponse.json({
        timestamp: Math.floor(now.getTime() / 1000),
        timestamp_ms: now.getTime(),
        iso: now.toISOString(),
        utc: now.toUTCString(),
      });
    }

    // Epoch → Date
    if (body.timestamp !== undefined) {
      let ms = Number(body.timestamp);
      // Auto-detect seconds vs milliseconds (timestamps before year 10000 in seconds)
      if (ms < 1e12) ms *= 1000;
      const d = new Date(ms);

      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Invalid timestamp" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        timestamp: Math.floor(d.getTime() / 1000),
        timestamp_ms: d.getTime(),
        iso: d.toISOString(),
        utc: d.toUTCString(),
      });
    }

    // Date → Epoch
    if (body.date) {
      const d = new Date(body.date);
      if (isNaN(d.getTime())) {
        return NextResponse.json(
          { error: "Invalid date string" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        timestamp: Math.floor(d.getTime() / 1000),
        timestamp_ms: d.getTime(),
        iso: d.toISOString(),
        utc: d.toUTCString(),
      });
    }

    return NextResponse.json(
      { error: 'Provide "timestamp", "date", or "action": "now"' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: "Epoch conversion failed." },
      { status: 400 }
    );
  }
}
