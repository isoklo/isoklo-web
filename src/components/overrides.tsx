"use client";

import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import type { Demo } from "@/lib/demo";
import { Terminal } from "./terminal";
import { Segmented } from "./ui";

type Kind = "tests" | "config" | "packages";

export function Overrides({ overrides }: { overrides: Demo["overrides"] }) {
  const [kind, setKind] = useState<Kind>("tests");
  const [applied, setApplied] = useState(false);
  const o = overrides[kind];

  const copy: Record<Kind, { title: string; body: ReactNode; artifact: ReactNode; toggle: string; caveat: string; where: string }> = {
    tests: {
      title: "A comment in the test file, with a reason",
      body: "Add the marker to each test file you changed on purpose. The finding drops from blocked to review and shows your reason, so reviewers see it in the diff.",
      artifact: <code className="block whitespace-pre-wrap break-words font-mono text-[12.5px] leading-relaxed text-ink">{overrides.tests.marker}</code>,
      toggle: "Add the comment",
      caveat: "A marker without a reason does not count.",
      where: "~/shop · test/cart.test.js",
    },
    config: {
      title: "A label only maintainers can apply",
      body: "The recommended workflow passes a reason to --allow-config-change when a maintainer adds the isoklo-allow-config label. Blocked configuration changes become review, with the reason shown.",
      artifact: (
        <span className="flex flex-wrap items-center gap-2">
          <span className="inline-flex h-6 items-center rounded-full border border-ice-deep/30 bg-ice-tint px-2.5 font-mono text-[12px] text-ice-deep">isoklo-allow-config</span>
          <span className="font-mono text-[12px] text-stone-500">added to PR #3 by a maintainer</span>
        </span>
      ),
      toggle: "Apply the label",
      caveat: "Limit who can apply labels (triage access) if you rely on it.",
      where: "~/isoklo-demo · demo/config-escalation",
    },
    packages: {
      title: "Declare private scopes in .npmrc",
      body: "A scoped name that is not on the public registry may be private, so it is review, not blocked. Declare the scope's registry and Isoklo leaves it alone: the name is never sent to npm.",
      artifact: <code className="block font-mono text-[12.5px] text-ink">{overrides.packages.npmrc}</code>,
      toggle: "Add the .npmrc line",
      caveat: "There is no override for a package that does not exist: fix the name.",
      where: "~/shop · package.json",
    },
  };
  const c = copy[kind];

  return (
    <div className="overflow-hidden rounded-2xl border border-stone-200 bg-surface shadow-sheet">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 px-5 py-3 sm:px-6">
        <Segmented<Kind>
          id="override"
          label="Override type"
          value={kind}
          onChange={(k) => {
            setKind(k);
            setApplied(false);
          }}
          options={[
            { value: "tests", label: "Test comment" },
            { value: "config", label: "Maintainer label" },
            { value: "packages", label: "Private package" },
          ]}
        />
        <p className="font-mono text-[11.5px] text-stone-500">real output, before and after</p>
      </div>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="border-b border-stone-200 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <h3 className="text-[17px] font-semibold tracking-[-0.012em]">{c.title}</h3>
          <p className="mt-2 text-pretty text-[14.5px] leading-relaxed text-stone-700">{c.body}</p>

          <div className={`mt-5 rounded-xl border px-4 py-3 transition-[border-color,background-color,opacity] duration-200 ${applied ? "border-ice-deep/30 bg-ice-tint/50 opacity-100" : "border-dashed border-stone-300 bg-stone-50 opacity-60"}`}>
            {c.artifact}
          </div>

          <label className="mt-5 flex cursor-pointer items-center gap-3 select-none">
            <span className="relative inline-flex">
              <input type="checkbox" role="switch" className="peer sr-only" checked={applied} onChange={(e) => setApplied(e.target.checked)} />
              <span className="h-[22px] w-[38px] rounded-full bg-stone-300 transition-colors duration-200 peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ice-deep" />
              <motion.span
                className="absolute left-[3px] top-[3px] size-4 rounded-full bg-surface shadow-[0_1px_2px_rgb(17_16_14/0.25)]"
                animate={{ x: applied ? 16 : 0 }}
                transition={{ type: "spring", bounce: 0, duration: 0.25 }}
              />
            </span>
            <span className="text-[14px] font-medium text-ink">{c.toggle}</span>
          </label>
          <p className="mt-5 border-t border-stone-200 pt-4 text-[13px] leading-relaxed text-stone-600">{c.caveat}</p>
        </div>
        <div className="min-w-0 p-4 sm:p-6">
          <Terminal
            output={applied ? o.after : o.before}
            command={kind === "config" ? 'npx isoklo check --allow-config-change "label isoklo-allow-config applied by a maintainer"' : "npx isoklo check"}
            title={c.where}
            exitCode={applied ? o.afterExit : o.beforeExit}
            runKey={`${kind}-${applied}`}
          />
        </div>
      </div>
    </div>
  );
}
