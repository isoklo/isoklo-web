"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";

/** Colour one line of real Isoklo output the way the CLI does in a colour terminal. */
function Line({ text }: { text: string }) {
  if (text.trim() === "") return <>{" "}</>;

  // Headers: "isoklo check · main...HEAD · ..." / "isoklo doctor · ~/repo"
  const head = /^(isoklo (?:check|doctor))( · .*)$/.exec(text);
  if (head) return <><span className="font-semibold text-ink">{head[1]}</span><span className="text-stone-600">{head[2]}</span></>;

  // Verdict rows: "✕ blocked  message", also doctor's indented "  ! review  message"
  const row = /^(\s*)(✕ blocked|! review|✓ passed|· info)(\s+)(.*)$/.exec(text);
  if (row) {
    const cls = row[2]!.startsWith("✕") ? "text-blocked" : row[2]!.startsWith("!") ? "text-review" : row[2]!.startsWith("✓") ? "text-passed" : "text-stone-500";
    return <>{row[1]}<span className={`font-semibold ${cls}`}>{row[2]}</span>{row[3]}<span className="text-ink">{row[4]}</span></>;
  }

  // Evidence: "             path:line  code"
  const ev = /^(\s{6,})(\S+:\d+)(\s+)(.*)$/.exec(text);
  if (ev) return <>{ev[1]}<span className="text-stone-600">{ev[2]}</span>{ev[3]}<span className="text-ink">{ev[4]}</span></>;

  // fix: / allowed:
  const note = /^(\s+)(fix:|allowed:)(.*)$/.exec(text);
  if (note) {
    const allowed = note[2] === "allowed:";
    return <>{note[1]}<span className={allowed ? "text-ice-deep" : "text-stone-500"}>{note[2]}</span><span className={allowed ? "text-ice-deep" : "text-stone-600"}>{note[3]}</span></>;
  }

  // Final verdict lines.
  const fin = /^(blocked|passed)(.*)$/.exec(text);
  if (fin) return <><span className={`font-semibold ${fin[1] === "blocked" ? "text-blocked" : "text-passed"}`}>{fin[1]}</span><span className="text-ink">{fin[2]}</span></>;

  // doctor: section titles and file rows
  if (/^(Instruction files|Findings)$/.test(text)) return <span className="text-stone-500">{text}</span>;
  const file = /^(\s{2})(\S+)(\s+)(~\d+ tokens)(\s+)(read by )(.*)$/.exec(text);
  if (file) return <>{file[1]}<span className="text-ink">{file[2]}</span>{file[3]}<span className="text-stone-500">{file[4]}</span>{file[5]}<span className="text-stone-500">{file[6]}</span><span className="text-stone-700">{file[7]}</span></>;

  return <span className="text-stone-700">{text}</span>;
}

export function Terminal({
  output,
  command,
  title,
  exitCode,
  runKey,
  animate = true,
  footer,
  maxHeight,
}: {
  output: string;
  command: string;
  title: ReactNode;
  exitCode?: number | null;
  /** Change this to replay the run. */
  runKey?: string | number;
  animate?: boolean;
  footer?: ReactNode;
  maxHeight?: string;
}) {
  const reduce = useReducedMotion();
  const play = animate && !reduce;
  // A new key starts a fresh run: no state is reset inside effects.
  return (
    <TerminalRun
      key={`${String(runKey)}|${output.length}|${play}`}
      output={output}
      command={command}
      title={title}
      exitCode={exitCode}
      runKey={runKey}
      play={play}
      footer={footer}
      maxHeight={maxHeight}
    />
  );
}

function TerminalRun({
  output,
  command,
  title,
  exitCode,
  runKey,
  play,
  footer,
  maxHeight,
}: {
  output: string;
  command: string;
  title: ReactNode;
  exitCode?: number | null;
  runKey?: string | number;
  play: boolean;
  footer?: ReactNode;
  maxHeight?: string;
}) {
  const lines = output.split("\n");
  const [shown, setShown] = useState(play ? 0 : lines.length);
  const phase: "running" | "done" = shown >= lines.length ? "done" : "running";

  useEffect(() => {
    if (!play) return;
    let i = 0;
    let interval = 0;
    const start = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setShown(i);
        if (i >= lines.length) window.clearInterval(interval);
      }, 30);
    }, 340);
    return () => {
      window.clearTimeout(start);
      window.clearInterval(interval);
    };
  }, [play, lines.length]);

  return (
    <div className="overflow-hidden rounded-xl border border-stone-200 bg-surface">
      <div className="flex h-10 items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 px-4">
        <p className="truncate font-mono text-[12px] text-stone-600">{title}</p>
        {exitCode !== undefined && exitCode !== null ? (
          <motion.span
            key={`${runKey}-${phase === "done"}`}
            initial={play ? { opacity: 0, scale: 0.92 } : false}
            animate={{ opacity: phase === "done" ? 1 : 0, scale: phase === "done" ? 1 : 0.92 }}
            transition={{ duration: 0.18, ease: [0.2, 0, 0, 1] }}
            className={`shrink-0 rounded-full border px-2 py-px font-mono text-[11px] font-medium ${
              exitCode === 0 ? "border-passed/35 bg-passed-tint text-passed" : exitCode === 1 ? "border-blocked/35 bg-blocked-tint text-blocked" : "border-review/35 bg-review-tint text-review"
            }`}
          >
            exit {exitCode}
          </motion.span>
        ) : null}
      </div>
      <pre
        className="scrollbar-quiet overflow-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75] sm:px-5"
        style={maxHeight ? { maxHeight } : undefined}
      >
        <code>
          <span className="block">
            <span className="select-none text-stone-400">$ </span>
            <span className="text-ink">{command}</span>
            {phase === "running" ? <span className="ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] animate-pulse bg-ink/70" aria-hidden="true" /> : null}
          </span>
          {lines.map((l, i) => (
            <span
              key={i}
              className="block whitespace-pre transition-opacity duration-150"
              style={{ opacity: i < shown ? 1 : 0 }}
              aria-hidden={i < shown ? undefined : true}
            >
              <Line text={l} />
            </span>
          ))}
        </code>
      </pre>
      {footer}
    </div>
  );
}
