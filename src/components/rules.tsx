import { Reveal } from "./ui";
import { SeePr } from "./see-pr";

/** The three `isoklo check` rules, worded from the Isoklo README (v0.1.1). */
const RULES = [
  {
    n: "01",
    title: "Test integrity",
    lead: "Agents under pressure to make a build pass tend to make the tests easier instead of the code correct.",
    blocked: [
      ["A test file with assertions is deleted, and they did not move elsewhere", null],
      ["More assertions removed than added back", null],
      ["A test is skipped or focused", ["test.skip(", "it.only(", "xit(", "@pytest.mark.skip", "t.Skip()", "@Disabled"]],
      ["An assertion that can never fail replaces a real one", ["expect(true).toBe(true)", "assert True"]],
    ],
    review: [],
    fair: "Moving an assertion to another file, reformatting it, or changing a test while keeping as many checks passes.",
    files: "JavaScript and TypeScript, Python, Go, Java and Kotlin, C# and Ruby (RSpec).",
    pr: 1,
  },
  {
    n: "02",
    title: "Packages that don't exist",
    lead: "Invented package names are a known attack (slopsquatting): attackers register the names agents tend to make up.",
    blocked: [["The package does not exist on the public registry", null]],
    review: [
      "It may be private: a scoped npm name, a custom registry, or a private Python index",
      "It was first published less than 30 days ago",
      "The registry did not answer: never a silent pass, never a false block",
    ],
    fair: "New dependencies in package.json, requirements*.txt and pyproject.toml are looked up on npm and PyPI.",
    files: "--offline skips the lookups; the package is then listed as not verified.",
    pr: 2,
  },
  {
    n: "03",
    title: "Agent and CI configuration",
    lead: "The files that decide what an agent may run are rarely read in review, and a prompt injection can talk an agent into widening its own power.",
    blocked: [
      ["A new MCP server, or a change to what one runs or connects to", null],
      ["Claude Code permissions that allow everything, or risky commands", ["*", "Bash", "Bash(*)", "mcp__*", "WebFetch(domain:*)"]],
      ["Removed deny rules, bypassPermissions, enableAllProjectMcpServers, new hooks", null],
      ["A workflow using pull_request_target or permissions: write-all", null],
      ["Any change that removes Isoklo from CI", null],
    ],
    review: ["Narrower permissions, MCP environment changes (names only, never values), new workflow secrets, CODEOWNERS, instruction files"],
    fair: "Checked: .claude/settings.json, .mcp.json, .cursor/mcp.json, .vscode/mcp.json, .gemini/settings.json, .agents/mcp_config.json, .devin/mcp_config.json and .github/workflows/.",
    files: "Secret values are replaced with *** before anything is printed.",
    pr: 3,
  },
] as const;

export function Rules() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {RULES.map((r, i) => (
        <Reveal key={r.n} delay={i * 0.06} className="h-full">
          <article className="flex h-full flex-col rounded-2xl border border-stone-200 bg-surface p-6 transition-[border-color,box-shadow] duration-200 hover:border-stone-300 hover:shadow-lift">
            <p className="font-mono text-[12px] text-stone-500">{r.n}</p>
            <h3 className="mt-3 text-h3 font-semibold tracking-[-0.018em]">{r.title}</h3>
            <p className="mt-2 text-pretty text-[14.5px] leading-relaxed text-stone-700">{r.lead}</p>

            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-blocked">✕ Blocked</p>
            <ul className="mt-2.5 space-y-2.5">
              {r.blocked.map(([text, codes]) => (
                <li key={text} className="text-[14px] leading-snug text-ink">
                  {text}
                  {codes ? (
                    <span className="mt-1.5 flex flex-wrap gap-1">
                      {codes.map((c) => (
                        <code key={c} className="rounded-[5px] border border-stone-200 bg-stone-50 px-1.5 py-px text-[11.5px] text-stone-700">{c}</code>
                      ))}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {r.review.length > 0 ? (
              <>
                <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.14em] text-review">! Review</p>
                <ul className="mt-2.5 space-y-2">
                  {r.review.map((t) => (
                    <li key={t} className="text-[14px] leading-snug text-stone-700">{t}</li>
                  ))}
                </ul>
              </>
            ) : null}

            <div className="mt-6 border-t border-stone-200 pt-4 text-[13px] leading-relaxed text-stone-600">
              <p>{r.fair}</p>
              <p className="mt-1.5">{r.files}</p>
            </div>
            <div className="mt-auto pt-5">
              <SeePr number={r.pr}>See it block PR #{r.pr}</SeePr>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
