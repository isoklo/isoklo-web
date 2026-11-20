"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import type { Demo } from "@/lib/demo";
import { Terminal } from "./terminal";
import { Segmented, VerdictPill } from "./ui";

const AGENTS = ["Claude Code", "Codex", "Cursor", "GitHub Copilot", "Gemini CLI", "Antigravity CLI", "Devin Desktop"];

export function Doctor({ doctor }: { doctor: Demo["doctor"] }) {
  const [view, setView] = useState<"files" | "terminal">("files");
  const [selected, setSelected] = useState<string | null>("AGENTS.md");
  const [agent, setAgent] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const { files, findings } = doctor.json;

  const related = (path: string) => findings.filter((f) => f.paths.includes(path));
  const visibleFindings = selected ? related(selected) : findings;

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-surface shadow-sheet">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-3 sm:px-6">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-stone-600">isoklo doctor · ~/isoklo-demo</p>
        <Segmented
          id="doctor"
          label="Doctor view"
          value={view}
          onChange={setView}
          options={[
            { value: "files", label: "Files" },
            { value: "terminal", label: "Terminal" },
          ]}
        />
      </div>

      {view === "terminal" ? (
          <motion.div key="t" className="p-4 sm:p-6" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}  transition={{ duration: 0.16 }}>
            <Terminal output={doctor.output} command="npx isoklo doctor" title="~/isoklo-demo · main" exitCode={doctor.exitCode} runKey="doctor" />
          </motion.div>
        ) : (
          <motion.div key="f" className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]" initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}  transition={{ duration: 0.16 }}>
            <div className="border-b border-stone-200 p-3 lg:border-b-0 lg:border-r">
              <div className="flex flex-wrap gap-1.5 px-2 pb-3 pt-1">
                {AGENTS.map((a) => {
                  const on = agent === a;
                  return (
                    <button
                      key={a}
                      type="button"
                      aria-pressed={on}
                      onClick={() => setAgent(on ? null : a)}
                      className={`h-7 rounded-full border px-2.5 text-[12px] font-medium transition-colors duration-150 ${
                        on ? "border-ice-deep/40 bg-ice-tint text-ice-deep" : "border-stone-200 text-stone-600 hover:border-stone-300 hover:text-ink"
                      }`}
                    >
                      {a}
                    </button>
                  );
                })}
              </div>
              <ul role="list" className="space-y-0.5">
                {files.map((f) => {
                  const on = selected === f.path;
                  const flagged = related(f.path).length > 0;
                  const dim = agent !== null && !f.readBy.includes(agent);
                  return (
                    <li key={f.path}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setSelected(on ? null : f.path)}
                        className={`relative grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 rounded-lg px-3 py-2.5 text-left transition-[background-color,opacity] duration-150 ${
                          on ? "bg-ice-tint" : "hover:bg-stone-50"
                        } ${dim ? "opacity-35" : ""}`}
                      >
                        <span className="flex min-w-0 items-center gap-2 font-mono text-[13px] text-ink">
                          <span className={`size-1.5 shrink-0 rounded-full ${flagged ? "bg-review" : "bg-stone-300"}`} aria-hidden="true" />
                          <span className="truncate">{f.path}</span>
                        </span>
                        <span className="font-mono text-[11.5px] text-stone-500 tabular">~{f.tokens ?? 0} tokens</span>
                        <span className="col-span-2 pl-3.5 text-[12px] text-stone-600">{f.readBy.join(" · ")}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="p-5 sm:p-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">
                {selected ? <>Findings for <span className="normal-case tracking-normal text-ink">{selected}</span></> : `All ${findings.length} findings`}
              </p>
              <ul className="mt-4 space-y-3">
                <AnimatePresence initial={false} mode="popLayout">
                  {visibleFindings.length === 0 ? (
                    <motion.li key="none" layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-[13.5px] text-stone-600">
                      No findings for this file.
                    </motion.li>
                  ) : (
                    visibleFindings.map((f) => (
                      <motion.li
                        key={f.message}
                        layout={!reduce}
                        initial={reduce ? false : { opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                        className="rounded-xl border border-stone-200 border-l-[3px] border-l-review bg-surface px-4 py-3"
                      >
                        <VerdictPill verdict="review" size="sm" />
                        <p className="mt-2 text-[14px] leading-snug text-ink">{f.message}</p>
                        {f.fix ? <p className="mt-1.5 font-mono text-[12px] leading-relaxed text-stone-600">fix: {f.fix}</p> : null}
                      </motion.li>
                    ))
                  )}
                </AnimatePresence>
              </ul>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className={`mt-4 text-[13px] font-medium text-ice-deep underline decoration-ice-deep/30 underline-offset-[3px] hover:decoration-ice-deep ${selected ? "" : "invisible"}`}
              >
                Show all {findings.length} findings
              </button>
            </div>
          </motion.div>
        )}
    </div>
  );
}
