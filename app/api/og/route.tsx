import { ImageResponse } from "next/og";

export const runtime = "edge";

const SIZE = { width: 1200, height: 630 };

// Shared per-item Open Graph image: same visual language as app/opengraph-image.tsx
// (the site-wide default), but takes an actual title/eyebrow so a news article,
// event, or newsletter issue gets its own social preview instead of every page
// sharing one generic image.
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = (searchParams.get("title") ?? "FAIITA").slice(0, 140);
  const eyebrow = (searchParams.get("eyebrow") ?? "FAIITA").slice(0, 60);

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
          backgroundColor: "#081E36",
          backgroundImage:
            "radial-gradient(55% 75% at 10% 15%, rgba(109,91,208,0.30), transparent 60%), radial-gradient(50% 70% at 90% 10%, rgba(20,184,166,0.22), transparent 60%), radial-gradient(65% 85% at 50% 115%, rgba(0,245,255,0.14), transparent 55%), radial-gradient(40% 60% at 85% 80%, rgba(242,146,29,0.18), transparent 60%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            color: "#F2921D",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "5px",
            textTransform: "uppercase",
          }}
        >
          {eyebrow}
        </div>
        <div
          style={{
            marginTop: "24px",
            maxWidth: "1000px",
            color: "#FFFFFF",
            fontSize: title.length > 60 ? "56px" : "72px",
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-1px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ width: "64px", height: "6px", backgroundColor: "#F2921D", borderRadius: "3px" }} />
          <div style={{ width: "24px", height: "6px", backgroundColor: "#00F5FF", borderRadius: "3px" }} />
          <div style={{ width: "12px", height: "6px", backgroundColor: "#0F8B5F", borderRadius: "3px" }} />
          <div style={{ marginLeft: "20px", color: "rgba(255,255,255,0.5)", fontSize: "22px", fontWeight: 600 }}>
            FAIITA
          </div>
        </div>
      </div>
    ),
    SIZE
  );
}
