import { Fragment } from "react";
import { Command, CopyButton, Reveal } from "./ui";

/** Light YAML colouring: comments, keys, the action reference and expressions. */
function Yaml({ source }: { source: string }) {
  return (
    <>
      {source.split("\n").map((line, i) => {
        const comment = line.indexOf(" #") >= 0 && !line.includes("${{") ? line.indexOf(" #") : line.trimStart().startsWith("#") ? line.indexOf("#") : -1;
        const body = comment >= 0 ? line.slice(0, comment) : line;
        const rest = comment >= 0 ? line.slice(comment) : "";
        const kv = /^(\s*-?\s*)([\w-]+)(:)(.*)$/.exec(body);
        return (
          <span key={i} className="block whitespace-pre">
            {kv ? (
              <>
                {kv[1]}
                <span className="text-ice-deep">{kv[2]}</span>
                <span className="text-stone-500">{kv[3]}</span>
                <Value text={kv[4] ?? ""} />
              </>
            ) : (
              <span className="text-ink">{body}</span>
            )}
            {rest ? <span className="text-stone-500">{rest}</span> : null}
            {line === "" ? " " : null}
          </span>
        );
      })}
    </>
  );
}

function Value({ text }: { text: string }) {
  const parts = text.split(/(\$\{\{[\s\S]*?\}\}|isoklo\/isoklo@v0)/);
  return (
    <>
      {parts.map((p, i) => (
        <Fragment key={i}>
          {p.startsWith("${{") ? <span className="text-review">{p}</span> : p === "isoklo/isoklo@v0" ? <span className="rounded bg-ice-tint px-0.5 font-semibold text-ink">{p}</span> : <span className="text-ink">{p}</span>}
        </Fragment>
      ))}
    </>
  );
}

const RULESET = [
  <>In your repository, open <b className="font-semibold text-ink">Settings → Rules → Rulesets</b> and create a branch ruleset.</>,
  <>Set enforcement to <b className="font-semibold text-ink">Active</b> and target your default branch.</>,
  <>Turn on <b className="font-semibold text-ink">Require status checks to pass</b> and add the check named <code className="rounded border border-stone-200 bg-stone-50 px-1 font-mono text-[12.5px] text-ink">check</code>. Pull requests show it as <i>isoklo / check</i>.</>,
  <>The check appears in the list after the workflow has run once, so open one pull request first.</>,
];

export function Setup({ workflow }: { workflow: string }) {
  return (
    // DOM order is 1, 2, 3 (phones read it top to bottom); on wide screens step 2 takes the right column.
    <div className="grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:grid-rows-[auto_1fr]">
        <Reveal className="lg:col-start-1 lg:row-start-1">
          <Step n="1" title="Try it on your machine" note="Nothing to install or configure. Run it inside a repository, on the branch you want to check.">
            <div className="mt-4 space-y-2">
              <Command command="npx isoklo check" />
              <Command command="npx isoklo doctor" />
            </div>
            <p className="mt-3 text-[13px] text-stone-600">
              Needs Node.js 22 or later and git. Exit <span className="font-mono">0</span> passed, <span className="font-mono">1</span> blocked,{" "}
              <span className="font-mono">2</span> could not run: the check fails closed.
            </p>
          </Step>
        </Reveal>
        <Reveal delay={0.03} className="min-w-0 lg:col-start-2 lg:row-span-2 lg:row-start-1">
        <Step n="2" title="Add the workflow" note={<>Save it as <code className="font-mono text-[13px] text-ink">.github/workflows/isoklo.yml</code>. Findings appear on the changed lines and in a summary on the Checks page. Coming from the GitHub Marketplace? Its snippet is only the <code className="font-mono text-[13px] text-ink">uses:</code> line; this is the complete workflow.</>}>
          <div className="mt-4 overflow-hidden rounded-xl border border-stone-200 bg-surface">
            <div className="flex h-11 items-center justify-between gap-3 border-b border-stone-200 bg-stone-50 pl-4 pr-1.5">
              <p className="truncate font-mono text-[12px] text-stone-600">.github/workflows/isoklo.yml</p>
              <CopyButton text={workflow} label="Copy YAML" />
            </div>
            <pre className="scrollbar-quiet overflow-x-auto px-4 py-4 font-mono text-[12.5px] leading-[1.75] sm:px-5">
              <code>
                <Yaml source={workflow.trimEnd()} />
              </code>
            </pre>
          </div>
          <p className="mt-3 text-[13px] text-stone-600">
            For the strongest guarantee, pin the action to a full commit SHA instead of <code className="font-mono">@v0</code>; tags can be moved.
          </p>
        </Step>
      </Reveal>
        <Reveal delay={0.06} className="lg:col-start-1 lg:row-start-2">
          <Step n="3" title="Make it required" note="So GitHub refuses to merge a pull request until Isoklo passes.">
            <ol className="mt-4 space-y-2.5">
              {RULESET.map((r, i) => (
                <li key={i} className="grid grid-cols-[20px_minmax(0,1fr)] gap-2 text-[14px] leading-relaxed text-stone-700">
                  <span className="font-mono text-[12px] leading-[1.75rem] text-stone-500">{String.fromCharCode(97 + i)}.</span>
                  <span>{r}</span>
                </li>
              ))}
            </ol>
          </Step>
        </Reveal>
    </div>
  );
}

function Step({ n, title, note, children }: { n: string; title: string; note: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="h-full rounded-2xl border border-stone-200 bg-surface p-5 sm:p-6">
      <div className="flex items-baseline gap-3">
        <span className="grid size-6 shrink-0 place-items-center rounded-full border border-stone-300 font-mono text-[11.5px] text-stone-700">{n}</span>
        <h3 className="text-[17px] font-semibold tracking-[-0.012em]">{title}</h3>
      </div>
      <p className="mt-2 pl-9 text-[14px] leading-relaxed text-stone-600">{note}</p>
      <div className="sm:pl-9">{children}</div>
    </section>
  );
}
