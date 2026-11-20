"use client";

import { motion, useReducedMotion } from "motion/react";
import { EUKLO_POWERED_BADGE as B } from "@/lib/euklo-badge";
import { euklo } from "@/lib/site";

const PEN = [0.65, 0, 0.35, 1] as const;
const VIEW = { once: true, margin: "0px 0px -10% 0px" } as const;

/**
 * Euklo's official "Powered by Euklo" badge (ink), drawn in like a pen when it scrolls into view: the ring, then the
 * e, then the lettering in reading order, then the two dots. On hover the lettering turns a few degrees, like a seal.
 * Geometry comes from the Euklo brand master; the guide's minimum size is 96 px.
 */
export function EukloBadge({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = (delay: number, duration: number) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: VIEW,
          transition: { pathLength: { delay, duration, ease: PEN } },
        };
  const pop = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { scale: 0 },
          whileInView: { scale: 1 },
          viewport: VIEW,
          transition: { delay, type: "spring" as const, bounce: 0.5, duration: 0.4 },
        };

  return (
    <svg viewBox={B.viewBox} className={className} role="img" aria-label="Powered by Euklo">
      <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
        <motion.circle cx={B.ring.cx} cy={B.ring.cy} r={B.ring.r} strokeWidth={B.ring.strokeWidth} {...draw(0, 0.9)} style={{ rotate: -90, transformOrigin: "200px 200px" }} />
        <motion.path d={B.e.d} strokeWidth={B.e.strokeWidth} {...draw(0.35, 0.65)} />
      </g>
      <g className="badge-lettering">
        {B.letters.map((l, i) => (
          <g key={i} transform={l.transform}>
            <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={l.strokeWidth}>
              {l.shapes.map((s, j) =>
                "d" in s ? (
                  <motion.path key={j} d={s.d} {...draw(0.6 + i * 0.045, 0.32)} />
                ) : (
                  <motion.circle key={j} cx={s.circle[0]} cy={s.circle[1]} r={s.circle[2]} {...draw(0.6 + i * 0.045, 0.32)} />
                ),
              )}
            </g>
          </g>
        ))}
        {B.dots.map((d, i) => (
          <motion.circle key={i} cx={d.cx} cy={d.cy} r={d.r} fill="currentColor" style={{ transformBox: "fill-box", transformOrigin: "center" }} {...pop(1.25 + i * 0.08)} />
        ))}
      </g>
    </svg>
  );
}

/** "Powered by Euklo": the official badge with Euklo's line, at the top of the footer. */
export function PoweredByEuklo() {
  return (
    <a
      href={euklo.url}
      className="group relative grid items-center gap-6 rounded-2xl border border-stone-200 bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-lift sm:grid-cols-[auto_minmax(0,1fr)] sm:p-8 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-10"
    >
      <EukloBadge className="size-[112px] shrink-0 text-ink" />
      <div className="sm:border-l sm:border-stone-200 sm:pl-8 md:pl-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-stone-500">Powered by Euklo</p>
        <p className="mt-2 text-[19px] font-semibold tracking-[-0.016em] text-ink">{euklo.line}</p>
        <p className="mt-1.5 max-w-[58ch] text-pretty text-[14px] leading-relaxed text-stone-600">{euklo.about}</p>
      </div>
      <span className="inline-flex h-9 items-center gap-1.5 justify-self-start rounded-lg border border-stone-200 bg-paper px-3.5 text-[13.5px] font-medium text-ink transition-colors duration-150 group-hover:border-stone-300 sm:col-start-2 md:col-start-auto md:justify-self-end">
        Visit Euklo
        <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true">
          <path d="M6 3.5h6.5V10M12.5 3.5L4 12" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </a>
  );
}
