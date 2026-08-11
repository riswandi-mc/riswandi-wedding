import { ImageResponse } from "next/og"

export const alt = "Riswandi Wedding - MC dan Undangan Digital Profesional"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #f9f5ef 0%, #eadfce 55%, #d7c3a7 100%)",
          color: "#30261d",
          padding: "72px 82px",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 440,
            height: 440,
            borderRadius: 999,
            right: -100,
            top: -110,
            border: "2px solid rgba(111, 82, 51, 0.22)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: 999,
            right: 40,
            top: 35,
            background: "rgba(111, 82, 51, 0.08)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 28,
              letterSpacing: 5,
              textTransform: "uppercase",
              color: "#74583e",
            }}
          >
            Riswandi Wedding
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div
              style={{
                display: "flex",
                maxWidth: 900,
                fontSize: 72,
                lineHeight: 1.08,
                fontWeight: 700,
              }}
            >
              MC Profesional &amp; Undangan Digital
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 30,
                color: "#5f5143",
              }}
            >
              Acara hangat, terarah, dan berkesan di Jabodetabek
            </div>
          </div>
          <div
            style={{
              display: "flex",
              width: 150,
              height: 6,
              borderRadius: 99,
              background: "#74583e",
            }}
          />
        </div>
      </div>
    ),
    size,
  )
}
