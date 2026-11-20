/**
 * The Isoklo logo, from the locked masters in brand/logo-final. Every mark is a single round-capped stroke,
 * which is what lets the intro draw it like a pen. Geometry must not be edited here: change the masters instead.
 */

/** Symbol, in its own 9..111 coordinate space. */
export const SYMBOL = {
  viewBox: "9 9 102 102",
  stroke: "M47.26 43.54A12.74 12.74 0 0 1 60 56.28L60 90.26A12.74 12.74 0 0 0 72.74 103",
  dot: "M60 20.19h0",
  strokeWidth: 16,
  dotWidth: 22,
} as const;

/** Small cut, for 24 px and below. */
export const SYMBOL_SMALL = {
  stroke: "M48 45.5A12 12 0 0 1 60 57.5L60 89.5A12 12 0 0 0 72 101.5",
  dot: "M60 21.5h0",
  strokeWidth: 19,
  dotWidth: 25,
} as const;

/** Wordmark strokes (in lockup space, after translate(93.82 0)), in writing order. */
export const WORDMARK = {
  strokeWidth: 6.9,
  dotWidth: 8.4,
  dot: "M3.45 9.6h0",
  strokes: [
    "M3.45 25.45V62.55", // i
    "M37.32 30.43A8.4 8.4 0 1 0 27.26 41.9L37.42 44.92A9 9 0 1 1 26.63 57.21", // s
    "M97.45 44A18.55 18.55 0 1 0 60.35 44A18.55 18.55 0 1 0 97.45 44", // o
    "M115.25 3.45V62.55M133.8 25.45L115.25 44L133.8 62.55", // k
    "M149.7 3.45V52.85A9.7 9.7 0 0 0 159.4 62.55", // l
    "M205 44A18.55 18.55 0 1 0 167.9 44A18.55 18.55 0 1 0 205 44", // o
  ],
} as const;

/** Wordmark strokes split at every "M", so each pen stroke animates on its own (the k is two strokes). */
export const WORDMARK_PEN_STROKES: readonly string[] = WORDMARK.strokes.flatMap((d) => d.split(/(?=M)/));

/** Lockup: symbol scaled into the wordmark's 66-unit height. */
export const LOCKUP = {
  viewBox: "0 0 302.27 66",
  symbolTransform: "translate(-5.8235 -5.8235) scale(0.647059)",
  wordmarkTransform: "translate(93.82 0)",
} as const;

const strokeProps = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export function Lockup({ className, title = "Isoklo" }: { className?: string; title?: string }) {
  return (
    <svg viewBox={LOCKUP.viewBox} className={className} role="img" aria-label={title}>
      <g transform={LOCKUP.symbolTransform} {...strokeProps} strokeWidth={SYMBOL.strokeWidth}>
        <path d={SYMBOL.stroke} />
        <path d={SYMBOL.dot} strokeWidth={SYMBOL.dotWidth} />
      </g>
      <g transform={LOCKUP.wordmarkTransform} {...strokeProps} strokeWidth={WORDMARK.strokeWidth}>
        {WORDMARK.strokes.map((d) => (
          <path key={d} d={d} />
        ))}
        <path d={WORDMARK.dot} strokeWidth={WORDMARK.dotWidth} />
      </g>
    </svg>
  );
}

export function Symbol({ className, small = false }: { className?: string; small?: boolean }) {
  const s = small ? SYMBOL_SMALL : SYMBOL;
  return (
    <svg viewBox={SYMBOL.viewBox} className={className} aria-hidden="true">
      <g {...strokeProps} strokeWidth={s.strokeWidth}>
        <path d={s.stroke} />
        <path d={s.dot} strokeWidth={s.dotWidth} />
      </g>
    </svg>
  );
}
