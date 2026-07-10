import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "FAIITA — Federation of All India Information Technology Associations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
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
            fontSize: "26px",
            fontWeight: 700,
            letterSpacing: "6px",
          }}
        >
          UNITING INDIA&apos;S IT FRATERNITY SINCE 2014
        </div>
        <div
          style={{
            marginTop: "28px",
            color: "#FFFFFF",
            fontSize: "110px",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-2px",
          }}
        >
          FAIITA
        </div>
        <div
          style={{
            marginTop: "24px",
            maxWidth: "900px",
            color: "rgba(255,255,255,0.75)",
            fontSize: "34px",
            lineHeight: 1.4,
          }}
        >
          Federation of All India Information Technology Associations —
          50,000+ IT entrepreneurs across 28 states, one national voice.
        </div>
        <div
          style={{
            marginTop: "56px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div style={{ width: "64px", height: "6px", backgroundColor: "#F2921D", borderRadius: "3px" }} />
          <div style={{ width: "24px", height: "6px", backgroundColor: "#00F5FF", borderRadius: "3px" }} />
          <div style={{ width: "12px", height: "6px", backgroundColor: "#0F8B5F", borderRadius: "3px" }} />
        </div>
      </div>
    ),
    size
  );
}
