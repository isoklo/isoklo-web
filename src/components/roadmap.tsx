"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { site } from "@/lib/site";
import { Reveal } from "./ui";

/** Shipped and planned, worded from the Isoklo README (Roadmap, Limits) and CHANGELOG. Nothing here is promised by date. */
const SHIPPED = [
  { t: "isoklo check", d: "Test integrity, packages that don't exist, and agent and CI configuration." },
  { t: "isoklo doctor", d: "Which agent reads which instruction file, across seven agents." },
  { t: "GitHub Action", d: "isoklo/isoklo@v0: notes on the changed lines and a job summary." },
  { t: "Escape hatches", d: "Test comments, the maintainer label, private scopes in .npmrc." },
  { t: "Machine output", d: "--json for scripts; exit 0 passed, 1 blocked, 2 could not run." },
];

const PLANNED = [
  { t: "Scope", d: "Block changes that stray outside the issue they claim to fix." },
  { t: "Rule proving", d: "isoklo rules prove: replay your own merged pull requests with and without each agent rule, to show which rules actually help." },
  { t: "More package ecosystems", d: "Beyond npm and PyPI." },
];

const LIMITS = [
  { t: "It does not judge code quality", d: "or find bugs in your logic. It catches specific, provable ways a change can make a repository less safe." },
  { t: "Its patterns are heuristics.", d: "An unusual test style can be missed. Misses are far more likely than false blocks, and every block shows its evidence." },
  { t: "Packages: npm and PyPI only,", d: "from package.json, requirements*.txt and pyproject.toml. Lockfiles and other ecosystems are not checked yet." },
  { t: "CI integration is built for GitHub Actions.", d: "Elsewhere, use the exit code and --json." },
];

const FAQ = [
  { q: "Does it use AI?", a: "No. Every verdict comes from fixed rules, so it is fast, free to run, and cannot be talked out of a block." },
  { q: "Does it only check pull requests written by agents?", a: "It checks every pull request. The rules target the mistakes agents make most, but a person who deletes a test gets the same verdict." },
  { q: "Will it slow down CI?", a: "A check takes seconds. The only network calls are the package lookups, and each request gives up after 8 seconds." },
  { q: "What if it blocks something it shouldn't?", a: "Use the escape hatch for that rule, and open an issue with the example, so the rule can improve." },
];

export function Roadmap() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Reveal className="h-full">
        <Column label={`Shipped · v${site.version}`} tone="passed">
          {SHIPPED.map((s) => (
            <Item key={s.t} title={s.t} glyph="✓" tone="passed">{s.d}</Item>
          ))}
        </Column>
      </Reveal>
      <Reveal delay={0.06} className="h-full">
        <Column label="Planned · not built yet" tone="ice">
          {PLANNED.map((s) => (
            <Item key={s.t} title={s.t} glyph="○" tone="ice">{s.d}</Item>
          ))}
          <p className="mt-auto pt-5 text-[13px] leading-relaxed text-stone-600">
            No dates are promised. The{" "}
            <a href={site.changelog} className="font-medium text-ink underline decoration-stone-300 underline-offset-[3px] hover:decoration-ink">changelog</a>{" "}
            lists what has shipped.
          </p>
        </Column>
      </Reveal>
      <Reveal delay={0.12} className="h-full">
        <Column label="Current limits" tone="stone">
          {LIMITS.map((s) => (
            <p key={s.t} className="text-[14px] leading-relaxed text-stone-700">
              <span className="font-medium text-ink">{s.t}</span> {s.d}
            </p>
          ))}
        </Column>
      </Reveal>
    </div>
  );
}

function Column({ label, tone, children }: { label: string; tone: "passed" | "ice" | "stone"; children: React.ReactNode }) {
  const dot = tone === "passed" ? "bg-passed" : tone === "ice" ? "bg-ice-deep" : "bg-stone-400";
  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-stone-200 bg-surface p-5 sm:p-6">
      <p className="flex items-center gap-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-stone-600">
        <span className={`size-1.5 rounded-full ${dot}`} aria-hidden="true" />
        {label}
      </p>
      {children}
    </div>
  );
}

function Item({ title, glyph, tone, children }: { title: string; glyph: string; tone: "passed" | "ice"; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[18px_minmax(0,1fr)] gap-2">
      <span className={`pt-px font-mono text-[13px] ${tone === "passed" ? "text-passed" : "text-ice-deep"}`} aria-hidden="true">{glyph}</span>
      <div>
        <p className="text-[14.5px] font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-[13.5px] leading-relaxed text-stone-600">{children}</p>
      </div>
    </div>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  return (
    <div className="divide-y divide-stone-200 rounded-2xl border border-stone-200 bg-surface">
      {FAQ.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q}>
            <h3>
              <button
                type="button"
                aria-expanded={on}
                aria-controls={`faq-${i}`}
                onClick={() => setOpen(on ? null : i)}
                className="flex w-full items-center justify-between gap-6 px-5 py-4 text-left text-[15.5px] font-medium text-ink transition-colors duration-150 hover:bg-stone-50 sm:px-6"
              >
                {f.q}
                <motion.svg viewBox="0 0 16 16" className="size-4 shrink-0 text-stone-500" fill="none" stroke="currentColor" strokeWidth={1.6} animate={{ rotate: on ? 45 : 0 }} transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }} aria-hidden="true">
                  <path d="M8 3v10M3 8h10" strokeLinecap="round" />
                </motion.svg>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {on ? (
                <motion.div
                  id={`faq-${i}`}
                  initial={reduce ? false : { height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: [0.2, 0, 0, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-[62ch] px-5 pb-5 text-[14.5px] leading-relaxed text-stone-700 sm:px-6">
                    {f.a}
                    {i === 3 ? (
                      <>
                        {" "}
                        <a href={site.issues} className="font-medium text-ink underline decoration-stone-300 underline-offset-[3px] hover:decoration-ink">Open an issue</a>
                      </>
                    ) : null}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
