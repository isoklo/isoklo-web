"use client";

import { motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { findingsOf, type DemoPr, type DiffFile, type Finding } from "@/lib/demo";
import { Terminal } from "./terminal";
import { Segmented, VerdictPill } from "./ui";

type View = "terminal" | "diff" | "checks";

/** Other sections can open a specific pull request: dispatch this event with the PR number. */
export const SELECT_PR_EVENT = "isoklo:select-pr";

const testsLabel = (pr: DemoPr) =>
  `${pr.tests.passed} passed${pr.tests.skipped ? `, ${pr.tests.skipped} skipped` : ""}`;

export function Exhibit({ prs }: { prs: DemoPr[] }) {
  const [active, setActive] = useState(0);
  const [view, setView] = useState<View>("terminal");
  const [run, setRun] = useState(0);
  const reduce = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const pr = prs[active]!;

  useEffect(() => {
    const onSelect = (e: Event) => {
      const n = (e as CustomEvent<number>).detail;
      const i = prs.findIndex((p) => p.number === n);
      if (i >= 0) {
        setActive(i);
        setView("terminal");
        setRun((r) => r + 1);
      }
    };
    window.addEventListener(SELECT_PR_EVENT, onSelect);
    return () => window.removeEventListener(SELECT_PR_EVENT, onSelect);
  }, [prs]);

  const select = (i: number) => {
    if (i === active) return;
    setActive(i);
    setRun((r) => r + 1);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-surface shadow-sheet">
      {/* Sheet header */}
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-stone-200 px-5 py-3 sm:px-6">
        <p className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-stone-600">
          Exhibit · <a className="underline decoration-stone-300 underline-offset-[3px] transition-colors hover:text-ink hover:decoration-ink" href="https://github.com/isoklo/isoklo-demo">isoklo/isoklo-demo</a>
        </p>
        <p className="font-mono text-[11.5px] text-stone-600">
          4 pull requests · unit tests pass on all 4 · <span className="text-blocked">Isoklo blocks 3</span>
        </p>
      </div>

      <div className="grid lg:grid-cols-[300px_minmax(0,1fr)]">
        {/* Rail */}
        <div
          ref={railRef}
          role="tablist"
          aria-label="Demo pull requests"
          aria-orientation="vertical"
          className="scrollbar-quiet flex gap-2 overflow-x-auto border-b border-stone-200 bg-stone-50/60 p-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:border-b-0 lg:border-r"
        >
          {prs.map((p, i) => {
            const on = i === active;
            return (
              <button
                key={p.number}
                role="tab"
                type="button"
                id={`pr-tab-${p.number}`}
                aria-selected={on}
                aria-controls="pr-panel"
                tabIndex={on ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={(e) => {
                  const keys = ["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft"];
                  if (!keys.includes(e.key)) return;
                  e.preventDefault();
                  const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
                  const next = (i + dir + prs.length) % prs.length;
                  select(next);
                  (railRef.current?.children[next] as HTMLElement | undefined)?.focus();
                }}
                className={`group relative min-w-[232px] rounded-xl px-4 py-3.5 text-left transition-colors duration-150 lg:min-w-0 ${
                  on ? "text-ink" : "text-stone-700 hover:bg-stone-100/80"
                }`}
              >
                {on ? (
                  <motion.span
                    layoutId="rail-active"
                    className="absolute inset-0 rounded-xl border border-ice-deep/25 bg-ice-tint"
                    transition={reduce ? { duration: 0 } : { type: "spring", bounce: 0, duration: 0.36 }}
                  />
                ) : null}
                <span className="relative block">
                  <span className="flex items-baseline gap-2">
                    <span className={`font-mono text-[12px] ${on ? "text-ice-deep" : "text-stone-500"}`}>#{p.number}</span>
                    <span className="text-[15px] font-semibold tracking-[-0.01em]">{p.label}</span>
                  </span>
                  <span className="mt-1 block truncate text-[13px] text-stone-600">{p.title}</span>
                  <span className="mt-2.5 flex flex-wrap gap-1.5">
                    <VerdictPill verdict="passed" size="sm">tests</VerdictPill>
                    <VerdictPill verdict={p.check.verdict === "blocked" ? "blocked" : "passed"} size="sm">
                      isoklo
                    </VerdictPill>
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Evidence */}
        <div id="pr-panel" role="tabpanel" aria-labelledby={`pr-tab-${pr.number}`} className="min-w-0 p-4 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="text-[1.25rem] font-semibold leading-snug tracking-[-0.018em]">
                {pr.title} <span className="font-normal text-stone-500">#{pr.number}</span>
              </h3>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[12px] text-stone-600">
                <span className="rounded-md bg-ice-tint px-1.5 py-0.5 text-ice-deep">{pr.branch}</span>
                <span aria-hidden="true">→</span>
                <span className="rounded-md bg-ice-tint px-1.5 py-0.5 text-ice-deep">main</span>
                <span className="text-stone-500">· {pr.diffStat}</span>
              </p>
            </div>
            <a
              href={pr.url}
              className="inline-flex h-8 shrink-0 items-center gap-1.5 rounded-md border border-stone-200 bg-surface px-3 text-[13px] font-medium text-ink transition-[border-color,box-shadow] duration-150 hover:border-stone-300 hover:shadow-lift"
            >
              Open on GitHub
              <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M6 3.5h6.5V10M12.5 3.5L4 12" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>

          <p className="mt-4 max-w-[60ch] text-pretty text-[15px] leading-relaxed text-stone-700">{pr.story}</p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <Segmented<View>
              id="view"
              label="Evidence view"
              value={view}
              onChange={setView}
              options={[
                { value: "terminal", label: "Terminal" },
                { value: "diff", label: "Diff" },
                { value: "checks", label: "Checks" },
              ]}
            />
            {view === "terminal" ? (
              <button
                type="button"
                onClick={() => setRun((r) => r + 1)}
                className="inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-stone-600 transition-colors duration-150 hover:bg-stone-100 hover:text-ink"
              >
                <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M13 8a5 5 0 1 1-1.46-3.54M13 3v2.5h-2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Run again
              </button>
            ) : null}
          </div>

          <div className="mt-3">
            {/* Instant swap, then a short fade in: no exit animation, so quick clicks never leave a blank. */}
              <motion.div
                key={`${pr.number}-${view}`}
                initial={reduce ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.16, ease: [0.2, 0, 0, 1] }}
              >
                {view === "terminal" ? (
                  <Terminal
                    output={pr.check.output}
                    command="npx isoklo check"
                    title={<>~/isoklo-demo <span className="text-stone-400">·</span> {pr.branch}</>}
                    exitCode={pr.check.exitCode}
                    runKey={`${pr.number}-${run}`}
                  />
                ) : view === "diff" ? (
                  <DiffView pr={pr} />
                ) : (
                  <ChecksView pr={pr} />
                )}
              </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ diff */
function annotationsFor(file: DiffFile, findings: Finding[]) {
  const map = new Map<number, Finding[]>();
  for (const f of findings) {
    const e = f.evidence[0];
    if (!e) continue;
    const at = e.anchor ?? { path: e.path, line: e.line };
    if (at.path !== file.path) continue;
    map.set(at.line, [...(map.get(at.line) ?? []), f]);
  }
  return map;
}

function DiffView({ pr }: { pr: DemoPr }) {
  const findings = findingsOf(pr);
  const [fileIdx, setFileIdx] = useState(0);
  const file = pr.diff[fileIdx] ?? pr.diff[0]!;
  const notes = annotationsFor(file, findings);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-surface">
      <div className="scrollbar-quiet flex items-center gap-1 overflow-x-auto border-b border-stone-200 bg-stone-50 px-2 py-1.5">
        {pr.diff.map((f, i) => {
          const flagged = findings.some((x) => x.evidence.some((e) => (e.anchor?.path ?? e.path) === f.path));
          return (
            <button
              key={f.path}
              type="button"
              onClick={() => setFileIdx(i)}
              aria-pressed={i === fileIdx}
              className={`inline-flex h-7 shrink-0 items-center gap-1.5 rounded-md px-2.5 font-mono text-[12px] transition-colors duration-150 ${
                i === fileIdx ? "bg-surface text-ink shadow-[0_0_0_1px_var(--color-stone-200)]" : "text-stone-600 hover:text-ink"
              }`}
            >
              {flagged ? <span className="size-1.5 rounded-full bg-blocked" aria-label="has a finding" /> : null}
              {f.path}
              {f.status === "added" ? <span className="text-passed">new</span> : null}
            </button>
          );
        })}
      </div>
      <div className="scrollbar-quiet max-h-[440px] overflow-auto">
        <table className="w-full border-collapse font-mono text-[12.5px] leading-[1.7]">
          <tbody>
            {file.hunks.map((h, hi) => (
              <Fragment key={hi}>
                <tr>
                  <td colSpan={4} className="border-y border-stone-200 bg-ice-tint/60 px-3 py-1 text-[11.5px] text-ice-deep">{h.header}</td>
                </tr>
                {h.lines.map((l, li) => {
                  const lineNotes = l.type !== "del" && l.newNo !== undefined ? notes.get(l.newNo) : undefined;
                  const bg = l.type === "add" ? "bg-passed-tint" : l.type === "del" ? "bg-blocked-tint" : "";
                  const sign = l.type === "add" ? "+" : l.type === "del" ? "−" : " ";
                  const signCls = l.type === "add" ? "text-passed" : l.type === "del" ? "text-blocked" : "text-stone-300";
                  return (
                    <Fragment key={li}>
                      <tr className={bg}>
                        <td className="w-10 select-none px-2 text-right text-stone-400 tabular">{l.oldNo ?? ""}</td>
                        <td className="w-10 select-none px-2 text-right text-stone-400 tabular">{l.newNo ?? ""}</td>
                        <td className={`w-5 select-none text-center ${signCls}`}>{sign}</td>
                        <td className="whitespace-pre pr-4 text-ink">{l.text || " "}</td>
                      </tr>
                      {lineNotes?.map((f) => (
                        <tr key={f.id}>
                          <td colSpan={4} className="px-3 py-2.5">
                            <Annotation finding={f} />
                          </td>
                        </tr>
                      ))}
                    </Fragment>
                  );
                })}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
      {findings.length === 0 ? (
        <p className="border-t border-stone-200 bg-passed-tint/60 px-4 py-2.5 text-[13px] text-passed">
          ✓ No findings in this diff. Tests were added, none weakened.
        </p>
      ) : null}
    </div>
  );
}

function Annotation({ finding }: { finding: Finding }) {
  const blocked = finding.level === "blocked";
  return (
    <div
      className={`max-w-[640px] rounded-r-lg border border-l-[3px] bg-surface px-4 py-3 font-sans shadow-[0_1px_2px_rgb(17_16_14/0.05)] ${
        blocked ? "border-stone-200 border-l-blocked" : "border-stone-200 border-l-review"
      }`}
    >
      <p className={`text-[13px] font-semibold ${blocked ? "text-blocked" : "text-review"}`}>Isoklo: {finding.level}</p>
      <p className="mt-1 whitespace-normal font-mono text-[12.5px] leading-relaxed text-ink">{finding.message}</p>
      <p className="mt-1 whitespace-normal font-mono text-[12.5px] leading-relaxed text-stone-600">fix: {finding.fix}</p>
    </div>
  );
}

/* ------------------------------------------------------------------------------------------------ checks */
function ChecksView({ pr }: { pr: DemoPr }) {
  const blocked = pr.check.verdict === "blocked";
  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <span className={`grid size-9 place-items-center rounded-full text-[15px] font-semibold ${blocked ? "bg-blocked-tint text-blocked" : "bg-passed-tint text-passed"}`} aria-hidden="true">
            {blocked ? "✕" : "✓"}
          </span>
          <div>
            <p className="text-[15px] font-semibold">{blocked ? "Required checks failing" : "Ready to merge"}</p>
            <p className="text-[13px] text-stone-600">{blocked ? "GitHub will not merge this pull request." : "All required checks passed."}</p>
          </div>
        </div>
        <span
          className={`inline-flex h-9 items-center rounded-lg px-4 text-[13.5px] font-medium ${
            blocked ? "cursor-not-allowed border border-stone-200 bg-stone-100 text-stone-400" : "bg-ink text-paper"
          }`}
          aria-disabled={blocked}
        >
          Merge pull request
        </span>
      </div>
      <ul className="divide-y divide-stone-200">
        <CheckRow ok={!blocked} name="isoklo / check" detail={blocked ? "Failing" : "Successful"} />
        <CheckRow ok name="Unit Tests / test" detail={`Successful · ${testsLabel(pr)}`} />
      </ul>
      <p className="border-t border-stone-200 bg-stone-50 px-4 py-2.5 text-[12.5px] text-stone-600 sm:px-5">
        Both checks are required by a ruleset on <span className="font-mono">main</span>.{" "}
        <a href={pr.url} className="font-medium text-ink underline decoration-stone-300 underline-offset-[3px] hover:decoration-ink">See it live on #{pr.number}</a>
      </p>
    </div>
  );
}

function CheckRow({ ok, name, detail }: { ok: boolean; name: string; detail: string }) {
  return (
    <li className="flex items-center justify-between gap-4 px-4 py-3 sm:px-5">
      <span className="flex min-w-0 items-center gap-3">
        <span className={`text-[14px] font-semibold ${ok ? "text-passed" : "text-blocked"}`} aria-label={ok ? "passed" : "failed"}>{ok ? "✓" : "✕"}</span>
        <span className="truncate text-[14px]">
          <span className="font-medium text-ink">{name}</span> <span className="text-stone-500">(pull_request)</span>
          <span className="ml-2 text-[13px] text-stone-500">{detail}</span>
        </span>
      </span>
      <span className="shrink-0 rounded-full border border-stone-300 px-2 py-px text-[11.5px] font-medium text-stone-700">Required</span>
    </li>
  );
}
