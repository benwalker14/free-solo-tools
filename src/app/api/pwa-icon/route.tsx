import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const size = Number(request.nextUrl.searchParams.get("size") || "512");
  const clampedSize = Math.min(Math.max(size, 16), 1024);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Gradient accent bar at top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: `${Math.max(Math.round(clampedSize * 0.02), 2)}px`,
            background:
              "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          }}
        />
        {/* DB monogram */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${Math.round(clampedSize * 0.45)}px`,
            fontWeight: 800,
            color: "#3b82f6",
            letterSpacing: "-0.02em",
          }}
        >
          DB
        </div>
      </div>
    ),
    { width: clampedSize, height: clampedSize },
  );
}
