import { Doctor } from "@/components/doctor";
import { Exhibit } from "@/components/exhibit";
import { Header, GitHubMark } from "@/components/header";
import { Lockup } from "@/components/logo";
import { Overrides } from "@/components/overrides";
import { Privacy } from "@/components/privacy";
import { Faq, Roadmap } from "@/components/roadmap";
import { Rules } from "@/components/rules";
import { Setup } from "@/components/setup";
import { Command, Reveal, SectionHead } from "@/components/ui";
import { demo } from "@/lib/demo";
import { author, euklo, site } from "@/lib/site";
import { PoweredByEuklo } from "@/components/euklo";

export default function Home() {
  return (
    <>
      <Header />
      <main id="top">
        {/* ---------------------------------------------------------------- hero */}
        <section className="relative">
          <div className="mx-auto max-w-[1200px] px-4 pb-14 pt-16 sm:px-6 sm:pt-24 lg:pb-16 lg:pt-28">
            <a
              href="https://euklo.com/isoklo/"
              data-lift-fade
              style={{ ["--i" as string]: 1 }}
              className="mb-8 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-full border border-stone-200 bg-surface px-4 py-2 text-[13.5px] text-stone-700 transition-colors duration-150 hover:border-stone-400 hover:text-ink"
            >
              <span className="font-mono text-[11.5px] uppercase tracking-[0.14em] text-ice-deep">New in {site.version}</span>
              62 rules, npx isoklo with no setup, and a GitHub App. See what&apos;s new
              <span aria-hidden="true">→</span>
            </a>
            <div data-lift-fade style={{ ["--i" as string]: 2 }}>
              <p className="flex items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-stone-600">
                <span className="size-1.5 rounded-[1px] bg-ice-deep" aria-hidden="true" />
                Merge gate for AI coding agents
              </p>
            </div>
            <h1
              data-lift-fade
              style={{ ["--i" as string]: 3 }}
              className="mt-6 max-w-[14ch] text-balance text-[3.25rem] font-semibold leading-[0.98] tracking-[-0.045em] text-ink sm:text-[4.5rem] lg:text-[5.25rem]"
            >
              Proof before merge.
            </h1>
            <p data-lift-fade style={{ ["--i" as string]: 4 }} className="mt-7 max-w-[40rem] text-pretty text-[1.1875rem] leading-[1.55] text-stone-700 sm:text-[1.3125rem]">
              Isoklo checks every pull request before a person spends time on it. When an agent weakens a test, invents a
              package, leaks a secret or widens its own permissions, Isoklo blocks the merge and shows the exact line.
            </p>
            <div data-lift-fade style={{ ["--i" as string]: 5 }} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Command command="npx isoklo" className="w-full sm:w-[300px]" />
              <a
                href="#setup"
                className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-ink px-5 text-[15px] font-medium text-paper shadow-[0_1px_2px_rgb(17_16_14/0.2)] transition-[background-color,transform] duration-150 hover:bg-stone-800 active:scale-[0.98]"
              >
                Add to GitHub
                <svg viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth={1.6} aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </a>
            </div>
            <ul data-lift-fade style={{ ["--i" as string]: 6 }} className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] text-stone-600">
              {[`v${site.version} on npm`, "zero dependencies", "no AI in the verdict", "same change, same verdict"].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="size-1 rounded-full bg-stone-400" aria-hidden="true" />
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ---------------------------------------------------------------- exhibit */}
        <section id="exhibit" className="scroll-mt-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6" data-lift-fade style={{ ["--i" as string]: 7 }}>
            <Exhibit prs={demo.prs} />
            <p className="mt-4 text-center text-[13px] text-stone-600">
              Real pull requests, real diffs, real output from Isoklo {demo.generatedFrom.isoklo}. Each one is open on{" "}
              <a href={site.demo} className="font-medium text-ink underline decoration-stone-300 underline-offset-[3px] hover:decoration-ink">isoklo/isoklo-demo</a>.
            </p>
          </div>
        </section>

        <Section id="checks" eyebrow="isoklo check" title="Where it started: three rules. Fixed, so the same change always gets the same verdict.">
          Every finding is <span className="font-medium text-blocked">blocked</span> (the check fails),{" "}
          <span className="font-medium text-review">review</span> (worth a person&apos;s look; the check passes) or info.
          Blocks always carry the file and line as evidence. Version {site.version} keeps all three and grows them to 62
          rules in six suites; the{" "}
          <a href="https://euklo.com/isoklo/#rules" className="font-medium text-ink underline decoration-stone-300 underline-offset-[3px] hover:decoration-ink">full table</a>{" "}
          is on euklo.com.
        </Section>
        <Container><Rules /></Container>

        <Section id="doctor" eyebrow="isoklo doctor" title="See which agent reads which instruction file.">
          Most repositories carry instructions for several agents, and each agent reads different files. Doctor shows what each
          one reads and what is silently ignored. These are its real findings on the demo repository. It is advisory and never
          blocks a merge.
        </Section>
        <Container>
          <Reveal><Doctor doctor={demo.doctor} /></Reveal>
          <div className="mt-4 max-w-[340px]"><Command command="npx isoklo doctor" /></div>
        </Container>

        <Section id="overrides" eyebrow="When a change is intentional" title="Isoklo never hides a decision. It asks for a reason reviewers can see.">
          Sometimes a person really did mean to remove a test or add a server. Each rule has one escape hatch, and every one leaves a trace in the pull request.
        </Section>
        <Container><Reveal><Overrides overrides={demo.overrides} /></Reveal></Container>

        <Section id="privacy" eyebrow="What leaves your machine" title="Your code stays where it is.">
          Isoklo runs inside your CI or on your laptop. Only the names of newly added packages go anywhere, to check that they exist.
        </Section>
        <Container><Privacy /></Container>

        <Section id="setup" eyebrow="Setup · about a minute" title="Add it to GitHub.">
          Three steps: try it locally, add the workflow, then make the check required. Or run{" "}
          <code className="font-mono text-[0.92em] text-ink">npx isoklo init</code>, which writes the workflow for you.
        </Section>
        <Container><Setup workflow={demo.workflow} /></Container>

        <Section id="roadmap" eyebrow="Roadmap" title="What ships today, and what comes next.">
          Isoklo is deliberately narrow. Knowing what it does not do is part of trusting it.
        </Section>
        <Container>
          <Roadmap />
          <div className="mt-16 grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)]">
            <div>
              <p className="flex items-center gap-2.5 font-mono text-[11.5px] uppercase tracking-[0.16em] text-stone-600">
                <span className="size-1.5 rounded-[1px] bg-ice-deep" aria-hidden="true" />
                Questions
              </p>
              <h2 className="mt-4 text-h2 font-semibold tracking-[-0.022em]">Asked often.</h2>
            </div>
            <Reveal><Faq /></Reveal>
          </div>
        </Container>

        {/* ---------------------------------------------------------------- closing */}
        <section className="mx-auto max-w-[1200px] px-4 pb-24 pt-28 sm:px-6">
          <Reveal>
            <div className="rounded-3xl border border-stone-200 bg-surface px-6 py-14 text-center shadow-sheet sm:px-12 sm:py-20">
              <Lockup className="mx-auto h-9 w-auto text-ink" />
              <p className="mx-auto mt-8 max-w-[28ch] text-balance text-[2rem] font-semibold leading-[1.1] tracking-[-0.035em] sm:text-[2.75rem]">
                Green tests are not proof. The evidence is.
              </p>
              <div className="mx-auto mt-9 flex max-w-[560px] flex-col gap-3 sm:flex-row">
                <Command command="npx isoklo check" className="flex-1" />
                <a
                  href={site.repo}
                  className="inline-flex h-[46px] items-center justify-center gap-2 rounded-xl bg-ink px-5 text-[15px] font-medium text-paper transition-[background-color,transform] duration-150 hover:bg-stone-800 active:scale-[0.98]"
                >
                  <GitHubMark className="size-4" />
                  Star on GitHub
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Section({ id, eyebrow, title, children }: { id: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="mx-auto max-w-[1200px] px-4 pb-10 pt-28 sm:px-6 lg:pt-36">
        <Reveal>
          <SectionHead eyebrow={eyebrow} title={title}>{children}</SectionHead>
        </Reveal>
      </div>
    </section>
  );
}

function Container({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-[1200px] px-4 sm:px-6">{children}</div>;
}

function Footer() {
  const links = [
    { href: site.repo, label: "GitHub" },
    { href: site.npm, label: "npm" },
    { href: site.demo, label: "Demo repository" },
    { href: site.changelog, label: "Changelog" },
    { href: site.issues, label: "Issues" },
  ];
  return (
    <footer className="border-t border-stone-200">
      <div className="mx-auto max-w-[1200px] px-4 pt-12 sm:px-6">
        <Reveal>
          <PoweredByEuklo />
        </Reveal>
      </div>

      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Lockup className="h-[22px] w-auto text-ink" />
          <p className="mt-4 text-[14px] text-stone-600">Proof before merge.</p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((l) => (
            <a key={l.label} href={l.href} className="text-[14px] text-stone-700 transition-colors duration-150 hover:text-ink">{l.label}</a>
          ))}
        </nav>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
        <div className="grid gap-5 border-t border-stone-200 py-7 lg:grid-cols-[auto_minmax(0,1fr)] lg:items-center lg:gap-10">
          <div className="flex items-center gap-3.5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-stone-200 bg-surface text-[15px] font-semibold text-ink" aria-hidden="true">
              {author.name[0]}
            </span>
            <p className="leading-snug">
              <span className="text-[15px] font-semibold text-ink">{author.name}</span>
              <span className="block text-[13px] text-stone-600">
                {author.title} <span className="text-stone-400" aria-hidden="true">·</span> {author.role}
              </span>
            </p>
          </div>
          <ul className="flex flex-wrap gap-2 lg:justify-end">
            {author.links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="inline-flex h-8 items-center gap-2 rounded-lg border border-stone-200 bg-surface px-3 text-[13px] text-stone-700 transition-[border-color,color,box-shadow] duration-150 hover:border-stone-300 hover:text-ink hover:shadow-lift"
                >
                  <LinkIcon kind={l.kind} />
                  {l.kind === "mail" ? (
                    <span className="font-mono text-[12px] text-ink">{l.detail}</span>
                  ) : (
                    <>
                      <span className="font-medium">{l.label}</span>
                      <span className="font-mono text-[12px] text-stone-500">{l.detail}</span>
                    </>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-4 pb-10 sm:px-6">
        <p className="max-w-[80ch] text-[12.5px] leading-relaxed text-stone-500">
          Isoklo {site.version} is a{" "}
          <a href={euklo.url} className="underline decoration-stone-300 underline-offset-[3px] hover:text-ink">Euklo</a> product, released under the{" "}
          <a href={site.license_url} className="underline decoration-stone-300 underline-offset-[3px] hover:text-ink">Functional Source License, Version 1.1, ALv2 Future License</a>{" "}
          ({site.license}). The licence does not grant rights to the Isoklo name or logo.
        </p>
      </div>
    </footer>
  );
}

function LinkIcon({ kind }: { kind: "linkedin" | "github" | "mail" }) {
  if (kind === "github") return <GitHubMark className="size-3.5" />;
  if (kind === "linkedin") {
    return (
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
        <path d="M13.63 1H2.37C1.61 1 1 1.6 1 2.33v11.34C1 14.4 1.61 15 2.37 15h11.26c.76 0 1.37-.6 1.37-1.33V2.33C15 1.6 14.39 1 13.63 1zM5.15 12.93H3.18V6.25h1.97v6.68zM4.17 5.34a1.14 1.14 0 1 1 0-2.28 1.14 1.14 0 0 1 0 2.28zm8.76 7.59h-1.97V9.68c0-.78-.01-1.77-1.08-1.77-1.08 0-1.25.84-1.25 1.71v3.31H6.66V6.25h1.89v.91h.03c.26-.5.91-1.03 1.88-1.03 2 0 2.37 1.32 2.37 3.03v3.77z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <rect x="1.75" y="3.25" width="12.5" height="9.5" rx="1.5" />
      <path d="M2.5 4.25L8 8.5l5.5-4.25" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
