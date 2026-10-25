import { ImageResponse } from "next/og";
import { site } from "@/content/site";

export const alt = `${site.brand} · ${site.role}`;
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
          justifyContent: "space-between",
          padding: 64,
          backgroundColor: "#0c0420",
          backgroundImage: "radial-gradient(circle at 20% 0%, rgba(211,145,176,.45), rgba(12,4,32,0) 60%)",
          color: "#f7eef5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28 }}>
          <div style={{ width: 22, height: 22, background: "linear-gradient(95deg,#ba6e8f,#d391b0)", transform: "rotate(45deg)", borderRadius: 4 }} />
          {site.role}
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 48, fontStyle: "italic", color: "#d391b0" }}>
            {`${site.taglines.heroLead} ${site.taglines.heroAccent}`}
          </div>
          <div style={{ fontSize: 150, fontWeight: 900, letterSpacing: -6, lineHeight: 1, textTransform: "uppercase" }}>
            {site.brand}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
