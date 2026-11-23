/** Facts about Isoklo used across the site. Keep in step with the Isoklo README and package.json. */
export const site = {
  name: "Isoklo",
  tagline: "Proof before merge.",
  description:
    "Isoklo is a deterministic merge gate for AI-written pull requests. It blocks a change, with the exact line as evidence, when it weakens tests, invents a package, leaks a secret, or widens what agents and CI may do.",
  version: "0.2.0",
  license: "FSL-1.1-ALv2",
  // Isoklo's home is https://euklo.com/isoklo; vercel.json redirects this site there, and its links never name a Vercel address.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://euklo.com/isoklo",
  repo: "https://github.com/isoklo/isoklo",
  readme: "https://github.com/isoklo/isoklo#readme",
  changelog: "https://github.com/isoklo/isoklo/blob/main/CHANGELOG.md",
  license_url: "https://github.com/isoklo/isoklo/blob/main/LICENSE.md",
  npm: "https://www.npmjs.com/package/isoklo",
  demo: "https://github.com/isoklo/isoklo-demo",
  issues: "https://github.com/isoklo/isoklo/issues",
} as const;

/** The parent company. */
export const euklo = {
  name: "Euklo",
  url: "https://euklo.com",
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
    { kind: "mail", label: "Email", detail: "hello@euklo.com", href: "mailto:hello@euklo.com" },
  ],
} as const;
