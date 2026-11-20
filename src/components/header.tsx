import { LOCKUP, SYMBOL, WORDMARK, WORDMARK_PEN_STROKES } from "./logo";
import { site } from "@/lib/site";

const NAV = [
  { href: "#exhibit", label: "Exhibit" },
  { href: "#checks", label: "Checks" },
  { href: "#doctor", label: "Doctor" },
  { href: "#setup", label: "Setup" },
  { href: "#roadmap", label: "Roadmap" },
];

/** The header lockup carries pen/nib classes so a same-tab refresh can redraw it (the "short" intro). */
function HeaderLockup() {
  return (
    <svg viewBox={LOCKUP.viewBox} className="h-[22px] w-auto text-ink" role="img" aria-label="Isoklo">
      <g transform={LOCKUP.symbolTransform} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={SYMBOL.strokeWidth}>
        <path className="pen" pathLength={1} d={SYMBOL.stroke} />
        <path className="nib" d={SYMBOL.dot} strokeWidth={SYMBOL.dotWidth} />
      </g>
      <g transform={LOCKUP.wordmarkTransform} fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={WORDMARK.strokeWidth}>
        {WORDMARK_PEN_STROKES.map((d, i) => (
          <path key={d} className="pen" pathLength={1} d={d} style={{ ["--i" as string]: i + 1 }} />
        ))}
        <path className="nib" d={WORDMARK.dot} strokeWidth={WORDMARK.dotWidth} />
      </g>
    </svg>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/70 bg-paper/85 backdrop-blur-md backdrop-saturate-150">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 sm:px-6">
        <a href="#top" className="-m-2 flex items-center rounded-md p-2" aria-label="Isoklo, back to top">
          <span data-logo-slot className="flex">
            <HeaderLockup />
          </span>
        </a>
        <nav aria-label="Sections" className="hidden items-center gap-1 md:flex" data-lift-fade style={{ ["--i" as string]: 1 }}>
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="rounded-md px-3 py-2 text-[14px] text-stone-700 transition-colors duration-150 hover:bg-stone-100 hover:text-ink"
            >
              {n.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2" data-lift-fade style={{ ["--i" as string]: 2 }}>
          <a
            href={site.npm}
            className="hidden rounded-md px-3 py-2 font-mono text-[12.5px] text-stone-600 transition-colors duration-150 hover:bg-stone-100 hover:text-ink sm:block"
          >
            v{site.version}
          </a>
          <a
            href={site.repo}
            className="inline-flex h-9 items-center gap-2 rounded-lg border border-stone-200 bg-surface px-3.5 text-[14px] font-medium text-ink shadow-[0_1px_0_rgb(17_16_14/0.04)] transition-[border-color,box-shadow] duration-150 hover:border-stone-300 hover:shadow-lift"
          >
            <GitHubMark className="size-4" />
            GitHub
          </a>
        </div>
      </div>
    </header>
  );
}

export function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
