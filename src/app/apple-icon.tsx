import { ImageResponse } from "next/og";
import { SYMBOL } from "@/components/logo";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${SYMBOL.viewBox}"><g fill="none" stroke="#11100E" stroke-linecap="round" stroke-linejoin="round" stroke-width="${SYMBOL.strokeWidth}"><path d="${SYMBOL.stroke}"/><path d="${SYMBOL.dot}" stroke-width="${SYMBOL.dotWidth}"/></g></svg>`;
const src = `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#F7F6F3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} width={118} height={118} alt="" />
      </div>
    ),
    size,
  );
}
