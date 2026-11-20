"use client";

import { SELECT_PR_EVENT } from "./exhibit";

/** Opens a pull request in the exhibit and scrolls to it. */
export function SeePr({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => {
        window.dispatchEvent(new CustomEvent(SELECT_PR_EVENT, { detail: number }));
        document.getElementById("exhibit")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }}
      className="group inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ice-deep"
    >
      <span className="underline decoration-ice-deep/30 underline-offset-[3px] transition-colors group-hover:decoration-ice-deep">{children}</span>
      <svg viewBox="0 0 16 16" className="size-3.5 transition-transform duration-150 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </button>
  );
}
