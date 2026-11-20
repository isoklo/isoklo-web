import { Reveal } from "./ui";

const GUARANTEES = [
  { k: "0", unit: "runtime dependencies", body: "The npm package is Isoklo's own code and nothing else. Nothing to audit but the code itself." },
  { k: "0", unit: "LLM calls", body: "Every verdict comes from fixed rules. It is fast, free to run, and cannot be talked out of a block." },
  { k: "0", unit: "bytes of your code sent", body: "No source code, diffs, file names or repository names ever leave your machine." },
  { k: "0", unit: "telemetry", body: "No account, no API key, no usage reporting. --offline turns off the only network calls." },
];

const NEVER = ["Source code", "Diffs", "File names", "Repository names", "Private npm scopes from .npmrc", "Telemetry"];

/** Worded from the Isoklo README, "What leaves your machine". */
export function Privacy() {
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
      <div className="grid gap-4 sm:grid-cols-2">
        {GUARANTEES.map((g, i) => (
          <Reveal key={g.unit} delay={i * 0.05} className="h-full">
            <div className="h-full rounded-2xl border border-stone-200 bg-surface p-5 sm:p-6">
              <p className="flex items-baseline gap-2">
                <span className="text-[2.75rem] font-semibold leading-none tracking-[-0.04em] tabular">{g.k}</span>
                <span className="text-[14px] font-medium text-stone-700">{g.unit}</span>
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-stone-600">{g.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.08} className="h-full">
        <div className="flex h-full flex-col rounded-2xl border border-stone-200 bg-surface">
          <div className="border-b border-stone-200 px-5 py-4 sm:px-6">
            <p className="text-[15px] font-semibold">The only network requests</p>
            <p className="mt-1 text-[13.5px] leading-relaxed text-stone-600">
              The names of newly added packages, looked up on the public registries. Each request gives up after 8 seconds.
            </p>
          </div>
          <div className="space-y-2 px-5 py-4 font-mono text-[12.5px] sm:px-6">
            {["registry.npmjs.org", "api.npmjs.org", "pypi.org"].map((h) => (
              <p key={h} className="flex items-center gap-2 text-ink">
                <span className="size-1.5 rounded-full bg-ice-deep" aria-hidden="true" />
                {h}
              </p>
            ))}
            <div className="mt-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 leading-relaxed">
              <p className="text-stone-500">PR #2, the whole conversation:</p>
              <p className="text-ink">
                GET registry.npmjs.org/<span className="text-ice-deep">invoice-pdf-renderer-lite</span>
              </p>
              <p className="text-blocked">→ 404 Not Found · blocked</p>
            </div>
          </div>
          <div className="mt-auto border-t border-stone-200 px-5 py-4 sm:px-6">
            <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-stone-500">Never sent</p>
            <ul className="mt-2.5 flex flex-wrap gap-1.5">
              {NEVER.map((n) => (
                <li key={n} className="rounded-full border border-stone-200 px-2.5 py-0.5 text-[12.5px] text-stone-600 line-through decoration-stone-400">
                  {n}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
