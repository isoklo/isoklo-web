import raw from "@/data/demo.json";

/** Shapes of src/data/demo.json, produced by scripts/extract-demo.mjs from real runs. */
export type Level = "blocked" | "review" | "info";
export interface Evidence { path: string; line: number; text: string; anchor?: { path: string; line: number } }
export interface Finding { rule: string; id: string; level: Level; message: string; fix: string; evidence: Evidence[]; allowedBecause?: string }
export interface DiffLine { type: "add" | "del" | "ctx"; oldNo?: number; newNo?: number; text: string }
export interface DiffFile { path: string; status: "added" | "modified"; hunks: { header: string; lines: DiffLine[] }[] }
export interface Tests { passed: number; failed: number; skipped: number; exitCode: number }
export interface DemoPr {
  number: number;
  branch: string;
  title: string;
  label: string;
  story: string;
  url: string;
  diffStat: string;
  tests: Tests;
  check: { output: string; exitCode: number; verdict: "blocked" | "passed"; results: { rule: string; findings: Finding[]; passes: string[] }[] };
  diff: DiffFile[];
}
export interface Override { before: string; beforeExit: number; after: string; afterExit: number }
export interface DoctorFile { path: string; specId: string; tokens: number | null; readBy: string[]; note?: string }
export interface DoctorFinding { id: string; level: "review" | "info"; message: string; fix?: string; paths: string[] }

export interface Demo {
  generatedFrom: { isoklo: string; repo: string };
  prs: DemoPr[];
  doctor: { output: string; exitCode: number; json: { files: DoctorFile[]; findings: DoctorFinding[]; totalTokens: number } };
  mainTests: Tests;
  workflow: string;
  overrides: {
    tests: Override & { marker: string };
    config: Override & { reason: string };
    packages: Override & { npmrc: string };
  };
}

export const demo = raw as unknown as Demo;

export const findingsOf = (pr: DemoPr) => pr.check.results.flatMap((r) => r.findings);
