import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function generateOgImage(
  title: string,
  description: string,
  icon?: string,
) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top bar accent */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "6px",
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899)",
          }}
        />

        {/* Icon + Title row */}
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          {icon && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "16px",
                background: "rgba(59, 130, 246, 0.15)",
                border: "2px solid rgba(59, 130, 246, 0.3)",
                fontSize: "36px",
                color: "#60a5fa",
              }}
            >
              {icon}
            </div>
          )}
          <div
            style={{
              fontSize: icon ? "52px" : "60px",
              fontWeight: 700,
              color: "#f8fafc",
              lineHeight: 1.1,
            }}
          >
            {title}
          </div>
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: "28px",
            color: "#94a3b8",
            marginTop: "24px",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {description}
        </div>

        {/* Bottom branding */}
        <div
          style={{
            position: "absolute",
            bottom: "48px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
          }}
        >
          <div
            style={{
              fontSize: "24px",
              fontWeight: 700,
              color: "#3b82f6",
            }}
          >
            FreeSolo Tools
          </div>
          <div
            style={{
              fontSize: "20px",
              color: "#475569",
            }}
          >
            free-solo-tools.vercel.app
          </div>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
