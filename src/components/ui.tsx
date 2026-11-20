"use client";

import { motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";

/* ------------------------------------------------------------------------------------------------ copy */
export function CopyButton({ text, label = "Copy", className = "" }: { text: string; label?: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard blocked: the text is still selectable */
        }
      }}
      className={`relative inline-flex h-8 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border border-stone-200 bg-surface px-2.5 text-[12.5px] font-medium text-stone-700 transition-[border-color,color,background-color] duration-150 hover:border-stone-300 hover:text-ink active:scale-[0.98] ${className}`}
      aria-label={copied ? "Copied" : `${label}: ${text.split("\n")[0]}`}
    >
      <span className="relative size-3.5" aria-hidden="true">
        <motion.svg
          viewBox="0 0 16 16"
          className="absolute inset-0"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          initial={false}
          animate={{ opacity: copied ? 0 : 1, scale: copied ? 0.6 : 1 }}
          transition={{ duration: 0.15 }}
        >
          <rect x="5.25" y="5.25" width="8" height="8" rx="1.5" />
          <path d="M10.75 3.25v-.5a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h.5" />
        </motion.svg>
        <motion.svg
          viewBox="0 0 16 16"
          className="absolute inset-0 text-passed"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={false}
          animate={{ opacity: copied ? 1 : 0, scale: copied ? 1 : 0.6 }}
          transition={{ duration: 0.15 }}
        >
          <path d="M3.5 8.5l3 3 6-7" />
        </motion.svg>
      </span>
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

/** A one-line command with a prompt and a copy button. */
export function Command({ command, className = "" }: { command: string; className?: string }) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border border-stone-200 bg-surface py-1.5 pl-4 pr-1.5 shadow-[0_1px_0_rgb(17_16_14/0.03)] ${className}`}>
      <code className="flex-1 truncate font-mono text-[14px] text-ink">
        <span className="select-none text-stone-400">$ </span>
        {command}
      </code>
      <CopyButton text={command} />
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ verdicts */
type Verdict = "blocked" | "review" | "passed" | "info";
const VERDICT: Record<Verdict, { glyph: string; cls: string }> = {
  blocked: { glyph: "✕", cls: "border-blocked/35 bg-blocked-tint text-blocked" },
  review: { glyph: "!", cls: "border-review/35 bg-review-tint text-review" },
  passed: { glyph: "✓", cls: "border-passed/35 bg-passed-tint text-passed" },
  info: { glyph: "·", cls: "border-stone-300 bg-stone-50 text-stone-600" },
};

export function VerdictPill({ verdict, children, size = "md" }: { verdict: Verdict; children?: ReactNode; size?: "sm" | "md" }) {
  const v = VERDICT[verdict];
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border font-mono font-medium ${v.cls} ${
        size === "sm" ? "h-[22px] px-2 text-[11.5px]" : "h-7 px-2.5 text-[12.5px]"
      }`}
    >
      <span aria-hidden="true">{v.glyph}</span>
      {children ?? verdict}
    </span>
  );
}

/* ------------------------------------------------------------------------------------------------ sections */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-4 flex items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-stone-600">
      <span className="size-1.5 rounded-[1px] bg-ice-deep" aria-hidden="true" />
      {children}
    </p>
  );
}

export function SectionHead({ eyebrow, title, children }: { eyebrow: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="max-w-[44rem]">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-balance text-[2rem] font-semibold leading-[1.12] tracking-[-0.028em] text-ink sm:text-h1">{title}</h2>
      {children ? <div className="mt-4 text-pretty text-lead text-stone-700">{children}</div> : null}
    </div>
  );
}

/** Calm scroll reveal: 12px rise and fade, once. */
export function Reveal({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.6, ease: [0.2, 0, 0, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/** Segmented tabs with a sliding indicator. */
export function Segmented<T extends string>({
  id,
  value,
  options,
  onChange,
  label,
}: {
  id: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="scrollbar-quiet inline-flex max-w-full overflow-x-auto rounded-lg border border-stone-200 bg-stone-100/70 p-0.5">
      {options.map((o, i) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            role="tab"
            type="button"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(o.value)}
            onKeyDown={(e) => {
              if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
              e.preventDefault();
              const next = options[(i + (e.key === "ArrowRight" ? 1 : options.length - 1)) % options.length];
              if (!next) return;
              onChange(next.value);
              (e.currentTarget.parentElement?.children[options.indexOf(next)] as HTMLElement | undefined)?.focus();
            }}
            className={`relative h-8 shrink-0 whitespace-nowrap rounded-md px-3 text-[13px] font-medium transition-colors duration-150 ${
              active ? "text-ink" : "text-stone-600 hover:text-ink"
            }`}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${id}`}
                className="absolute inset-0 rounded-md border border-stone-200 bg-surface shadow-[0_1px_2px_rgb(17_16_14/0.06)]"
                transition={{ type: "spring", bounce: 0, duration: 0.32 }}
              />
            ) : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
