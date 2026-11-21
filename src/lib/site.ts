/** Facts about Isoklo used across the site. Keep in step with the Isoklo README and package.json. */
export const site = {
  name: "Isoklo",
  tagline: "Proof before merge.",
  description:
    "Isoklo is a merge gate for AI coding agents. It blocks a pull request, with the exact line as evidence, when the change weakens tests, adds a package that doesn't exist, or widens what agents and CI may do.",
  version: "0.1.2",
  license: "FSL-1.1-ALv2",
  // NEXT_PUBLIC_SITE_URL wins; on Vercel, fall back to the project's production domain until isoklo.com is attached.
  url:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "https://isoklo.com"),
  repo: "https://github.com/isoklo/isoklo",
  readme: "https://github.com/isoklo/isoklo#readme",
  changelog: "https://github.com/isoklo/isoklo/blob/main/CHANGELOG.md",
  license_url: "https://github.com/isoklo/isoklo/blob/main/LICENSE.md",
  npm: "https://www.npmjs.com/package/isoklo",
  demo: "https://github.com/isoklo/isoklo-demo",
  issues: "https://github.com/isoklo/isoklo/issues",
} as const;

/** The parent company. Switch `url` to https://euklo.com once that domain serves the site. */
export const euklo = {
  name: "Euklo",
  url: "https://euklo.vercel.app",
  line: "AI agent and LLM tooling, for developers.",
  about: "Euklo is a developer-focused studio for AI agent and LLM tooling. Isoklo is built by Euklo.",
} as const;

/** The maker, shown in the footer and the page metadata. */
export const author = {
  name: "Manish",
  title: "Full-stack engineer & founder",
  role: "Designed and built Isoklo",
  links: [
    { kind: "linkedin", label: "LinkedIn", detail: "p-sai-manish", href: "https://www.linkedin.com/in/p-sai-manish-9114bb314/" },
    { kind: "github", label: "GitHub", detail: "@manishguptha188", href: "https://github.com/manishguptha188" },
    { kind: "mail", label: "Email", detail: "manish@euklo.com", href: "mailto:manish@euklo.com" },
  ],
} as const;
