import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}
export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 36,
          background: "linear-gradient(145deg, #f9f5ef, #d6c0a3)",
          color: "#5f452e",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -5,
        }}
      >
        RW
      </div>
    ),
    size,
  )
}
