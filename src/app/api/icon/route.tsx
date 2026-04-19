import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = parseInt(searchParams.get("size") ?? "192");
  const s = size <= 256 ? 192 : 512;
  const pad = Math.round(s * 0.18);
  const inner = s - pad * 2;
  const fontSize = Math.round(inner * 0.68);

  return new ImageResponse(
    (
      <div
        style={{
          width: s,
          height: s,
          background: "#080604",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: s * 0.2,
        }}
      >
        <div
          style={{
            width: inner,
            height: inner,
            background: "linear-gradient(135deg, #a06010, #c8921a, #f0c040, #c8921a, #a06010)",
            borderRadius: inner * 0.18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontSize,
              fontWeight: 900,
              color: "#080604",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}
          >
            B
          </span>
        </div>
      </div>
    ),
    { width: s, height: s }
  );
}
