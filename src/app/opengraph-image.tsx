import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { LOCKUP, SYMBOL, WORDMARK } from "@/components/logo";

export const alt = "Isoklo: Proof before merge. A merge gate for AI coding agents.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const semibold = await readFile(join(process.cwd(), "assets/inter-latin-600-normal.woff"));
const regular = await readFile(join(process.cwd(), "assets/inter-latin-400-normal.woff"));

const INK = "#11100E";
const lockupSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${LOCKUP.viewBox}"><g transform="${LOCKUP.symbolTransform}" fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${SYMBOL.strokeWidth}"><path d="${SYMBOL.stroke}"/><path d="${SYMBOL.dot}" stroke-width="${SYMBOL.dotWidth}"/></g><g transform="${LOCKUP.wordmarkTransform}" fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round" stroke-width="${WORDMARK.strokeWidth}">${WORDMARK.strokes.map((d) => `<path d="${d}"/>`).join("")}<path d="${WORDMARK.dot}" stroke-width="${WORDMARK.dotWidth}"/></g></svg>`;
const lockupSrc = `data:image/svg+xml;base64,${Buffer.from(lockupSvg).toString("base64")}`;

export default function Image() {
  // Glyphs are drawn, not typed: the Inter subset has no ✓ or ✕.
  const pill = (text: string, color: string, bg: string, ok: boolean) => (
    <div style={{ display: "flex", alignItems: "center", gap: 10, height: 40, padding: "0 18px", borderRadius: 999, border: `1.5px solid ${color}55`, background: bg, color, fontSize: 22, fontWeight: 600 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        {ok ? <path d="M3 8.5l3.2 3.2L13 4.5" /> : <path d="M4 4l8 8M12 4l-8 8" />}
      </svg>
      {text}
    </div>
  );
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#F7F6F3", padding: "72px 80px", fontFamily: "Inter" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={lockupSrc} width={302.27 * 0.62} height={66 * 0.62} alt="" />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 104, fontWeight: 600, letterSpacing: "-0.045em", color: INK, lineHeight: 1 }}>Proof before merge.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#4F4E4C", lineHeight: 1.4, maxWidth: 900 }}>
            A merge gate for AI coding agents. Blocks weakened tests, invented packages and silent permission changes, with the exact line.
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {pill("tests passed", "#2F7145", "#E7F8EA", true)}
          {pill("isoklo blocked", "#AF302B", "#FFEEEC", false)}
          <div style={{ marginLeft: "auto", fontSize: 22, color: "#6B6A68" }}>npx isoklo check</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
        { name: "Inter", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
