import { LOCKUP, SYMBOL, WORDMARK, WORDMARK_PEN_STROKES } from "./logo";

/**
 * The construction intro, rendered on the server so it starts on the very first frame (no wait for JavaScript).
 * Timeline (seconds): guides 0–0.5 · symbol stroke 0.3–0.86 · dot 0.82 · guides fade 1.02 · wordmark 0.94–1.64 ·
 * caption 1.2 · a short beat · IntroController lifts the finished drawing into the header at 1.86.
 *
 * The guides are the symbol's real geometry: its vertical axis, the two circles its tails are cut from, and a cross
 * at the dot, drawn the way Euclid would construct them before inking.
 */
export function Intro() {
  return (
    <div className="intro" aria-hidden="true" data-intro-overlay>
      <div className="flex flex-col items-center gap-7">
        <svg
          viewBox={LOCKUP.viewBox}
          className="w-[min(64vw,400px)] overflow-visible text-ink"
          data-intro-art
        >
          <g transform={LOCKUP.symbolTransform}>
            <g fill="none" stroke="var(--color-stone-300)" strokeWidth={1} vectorEffect="non-scaling-stroke">
              <path className="guide" pathLength={1} d="M60 4V116" style={{ ["--at" as string]: "0s", ["--dur" as string]: "0.5s" }} vectorEffect="non-scaling-stroke" />
              <circle className="guide" pathLength={1} cx={47.26} cy={56.28} r={12.74} style={{ ["--at" as string]: "0.08s" }} vectorEffect="non-scaling-stroke" />
              <circle className="guide" pathLength={1} cx={72.74} cy={90.26} r={12.74} style={{ ["--at" as string]: "0.16s" }} vectorEffect="non-scaling-stroke" />
              <path className="guide" pathLength={1} d="M46 20.19H74" style={{ ["--at" as string]: "0.22s", ["--dur" as string]: "0.3s" }} vectorEffect="non-scaling-stroke" />
              <path className="guide" pathLength={1} d="M28 103H92" style={{ ["--at" as string]: "0.26s", ["--dur" as string]: "0.35s" }} vectorEffect="non-scaling-stroke" />
            </g>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={SYMBOL.strokeWidth}>
              <path className="pen" pathLength={1} d={SYMBOL.stroke} style={{ ["--at" as string]: "0.3s", ["--dur" as string]: "0.56s" }} />
              <path className="nib" d={SYMBOL.dot} strokeWidth={SYMBOL.dotWidth} style={{ ["--at" as string]: "0.82s" }} />
            </g>
          </g>
          <g
            transform={LOCKUP.wordmarkTransform}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={WORDMARK.strokeWidth}
          >
            {WORDMARK_PEN_STROKES.map((d, i) => (
              <path
                key={d}
                className="pen"
                pathLength={1}
                d={d}
                style={{ ["--at" as string]: `${0.94 + i * 0.052}s`, ["--dur" as string]: "0.4s", ["--ease" as string]: "cubic-bezier(0.4, 0, 0.15, 1)" }}
              />
            ))}
            <path className="nib" d={WORDMARK.dot} strokeWidth={WORDMARK.dotWidth} style={{ ["--at" as string]: "1.06s" }} />
          </g>
        </svg>
        <p className="intro-caption font-mono text-[11px] uppercase tracking-[0.22em] text-stone-500">Proof before merge</p>
      </div>
    </div>
  );
}

/** Runs in <head> before first paint, so the page never flashes before the intro. */
export const INTRO_DECIDE_SCRIPT = `(function(){var h=document.documentElement,m="full";try{if(matchMedia("(prefers-reduced-motion: reduce)").matches){m="none"}else if(sessionStorage.getItem("isoklo:intro")){m="short"}else{sessionStorage.setItem("isoklo:intro","1")}}catch(e){m="none"}h.dataset.intro=m;if(m!=="full"){h.dataset.introDone=""}})();`;
