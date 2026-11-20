// Pulls the real exhibit data from a local clone of isoklo-demo, using a local build of the Isoklo CLI.
// Nothing on the site is retyped by hand: diffs, terminal output, findings and exit codes all come from here.
//
//   node scripts/extract-demo.mjs <path-to-isoklo-demo> <path-to-isoklo/dist/cli.js>
//
// Writes src/data/demo.json. Run it again whenever the demo repo or Isoklo changes.
import { execFileSync, spawnSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { basename, resolve } from "node:path";

const [demoArg, cliArg] = process.argv.slice(2);
if (!demoArg || !cliArg) {
  console.error("usage: node scripts/extract-demo.mjs <isoklo-demo> <isoklo/dist/cli.js>");
  process.exit(2);
}
const DEMO = resolve(demoArg);
const CLI = resolve(cliArg);
const env = { ...process.env, NO_COLOR: "1", GITHUB_ACTIONS: "", GITHUB_BASE_REF: "" };

const git = (...args) => execFileSync("git", ["-c", "core.quotepath=off", ...args], { cwd: DEMO, encoding: "utf8" });
const isoklo = (...args) => spawnSync(process.execPath, [CLI, ...args], { cwd: DEMO, encoding: "utf8", env });
/** Never publish a local folder path: show the repo as ~/isoklo-demo. */
const scrub = (text) => text.split(DEMO).join(`~/${basename(DEMO)}`).replace(/\r\n/g, "\n");

const PRS = [
  {
    number: 1, branch: "demo/weakened-tests", title: "Support stacking discount codes",
    label: "Weakened tests",
    story: "Broke the tax order, then deleted the two assertions that caught it and skipped a third test.",
    files: ["test/invoice.test.js", "src/invoice.js"],
  },
  {
    number: 2, branch: "demo/fake-package", title: "Add PDF export for invoices",
    label: "Invented package",
    story: "Added invoice-pdf-renderer-lite, a package that does not exist on npm.",
    files: ["package.json", "src/export-pdf.js"],
  },
  {
    number: 3, branch: "demo/config-escalation", title: "Add payment terms and due dates",
    label: "Permission escalation",
    story: "Shipped a real feature, and quietly gave itself Bash(*) and WebFetch(domain:*).",
    files: [".claude/settings.json", "src/terms.js", "test/terms.test.js", "src/index.js"],
  },
  {
    number: 4, branch: "demo/clean-fix", title: "Reject discounts over 100%",
    label: "Clean fix",
    story: "Fixed a real bug, with regression tests. Nothing weakened.",
    files: ["src/invoice.js", "test/invoice.test.js"],
  },
];

/** Parse `git diff -U3` for one file into hunks of typed lines with old and new line numbers. */
function parseDiff(text) {
  const hunks = [];
  let hunk = null;
  let oldNo = 0;
  let newNo = 0;
  let status = "modified";
  for (const raw of text.replace(/\r\n/g, "\n").split("\n")) {
    if (raw.startsWith("new file mode")) status = "added";
    const h = /^@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@(.*)$/.exec(raw);
    if (h) {
      oldNo = Number(h[1]);
      newNo = Number(h[2]);
      hunk = { header: raw, lines: [] };
      hunks.push(hunk);
      continue;
    }
    if (!hunk || raw.startsWith("\\")) continue;
    const kind = raw[0];
    const content = raw.slice(1);
    if (kind === "+") hunk.lines.push({ type: "add", newNo: newNo++, text: content });
    else if (kind === "-") hunk.lines.push({ type: "del", oldNo: oldNo++, text: content });
    else if (kind === " ") hunk.lines.push({ type: "ctx", oldNo: oldNo++, newNo: newNo++, text: content });
  }
  return { status, hunks };
}

function testSummary() {
  const r = spawnSync("npm", ["test", "--silent"], { cwd: DEMO, encoding: "utf8", shell: process.platform === "win32" });
  const out = `${r.stdout}\n${r.stderr}`;
  const n = (k) => Number((new RegExp(`^# ${k} (\\d+)`, "m").exec(out) ?? [])[1] ?? 0);
  return { passed: n("pass"), failed: n("fail"), skipped: n("skipped"), exitCode: r.status };
}

const startBranch = git("rev-parse", "--abbrev-ref", "HEAD").trim();
const out = { generatedFrom: { isoklo: isoklo("--version").stdout.trim(), repo: "isoklo/isoklo-demo" }, prs: [], doctor: null };

try {
  git("switch", "-q", "main");
  const doctor = isoklo("doctor", ".");
  out.doctor = { output: scrub(doctor.stdout).trimEnd(), exitCode: doctor.status, json: JSON.parse(isoklo("doctor", ".", "--json").stdout) };
  delete out.doctor.json.root;
  out.mainTests = testSummary();
  // The recommended workflow, exactly as the demo repo runs it (identical to the Isoklo README).
  out.workflow = git("show", "main:.github/workflows/isoklo.yml").replace(/\r\n/g, "\n");

  for (const pr of PRS) {
    git("switch", "-q", pr.branch);
    const text = isoklo("check", ".", "--base", "main");
    const json = JSON.parse(isoklo("check", ".", "--base", "main", "--json").stdout);
    const stat = git("diff", "--shortstat", `main...${pr.branch}`).trim();
    const files = pr.files.map((path) => ({ path, ...parseDiff(git("diff", "-U3", `main...${pr.branch}`, "--", path)) }));
    out.prs.push({
      ...pr,
      files: undefined,
      url: `https://github.com/isoklo/isoklo-demo/pull/${pr.number}`,
      diffStat: stat,
      tests: testSummary(),
      check: { output: scrub(text.stdout).trimEnd(), exitCode: text.status, verdict: json.verdict, results: json.results },
      diff: files,
    });
  }
  // Overrides, before and after, all real runs. Config: PR #3 with the maintainer label's reason.
  git("switch", "-q", "demo/config-escalation");
  const labelReason = "label isoklo-allow-config applied by a maintainer";
  const cfgAfter = isoklo("check", ".", "--base", "main", "--allow-config-change", labelReason);
  out.overrides = {
    config: {
      before: out.prs[2].check.output, beforeExit: out.prs[2].check.exitCode,
      after: scrub(cfgAfter.stdout).trimEnd(), afterExit: cfgAfter.status, reason: labelReason,
    },
  };
} finally {
  git("switch", "-q", startBranch);
}

// Tests and private packages: two small scratch repos, so the outputs are real but self-contained.
{
  const { mkdtempSync, rmSync, writeFileSync: write, mkdirSync: mkdir } = await import("node:fs");
  const { tmpdir } = await import("node:os");
  const { join } = await import("node:path");
  const scratch = (name, base, change, ...flags) => {
    const dir = mkdtempSync(join(tmpdir(), "isoklo-web-"));
    try {
      const g = (...a) => execFileSync("git", ["-c", "user.name=demo", "-c", "user.email=demo@example.invalid", "-c", "core.autocrlf=false", ...a], { cwd: dir });
      const put = (files) => { for (const [p, t] of Object.entries(files)) { mkdir(join(dir, p, ".."), { recursive: true }); write(join(dir, p), t); } };
      g("init", "-q", "-b", "main"); put(base); g("add", "-A"); g("commit", "-q", "-m", "base");
      g("checkout", "-q", "-b", name); put(change); g("add", "-A"); g("commit", "-q", "-m", "change");
      const r = spawnSync(process.execPath, [CLI, "check", ".", "--base", "main", ...flags], { cwd: dir, encoding: "utf8", env });
      return { output: r.stdout.replace(/\r\n/g, "\n").trimEnd(), exitCode: r.status };
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  };
  const cartBase = { "test/cart.test.js": 'test("total", () => {\n  expect(total([1, 2])).toBe(3);\n  expect(total([])).toBe(0);\n});\n' };
  const weakened = 'test("total", () => {\n  expect(total([1, 2])).toBe(3);\n});\n';
  const marker = "// isoklo: allow-test-change total([]) is now covered in test/empty.test.js\n";
  const tb = scratch("pr", cartBase, { "test/cart.test.js": weakened }, "--offline");
  const ta = scratch("pr", cartBase, { "test/cart.test.js": marker + weakened }, "--offline");
  out.overrides.tests = { marker: marker.trim(), before: tb.output, beforeExit: tb.exitCode, after: ta.output, afterExit: ta.exitCode };

  const pkg = (deps) => JSON.stringify({ name: "shop", dependencies: deps }, null, 2) + "\n";
  const pkgBase = { "package.json": pkg({ express: "^4.21.0" }) };
  const pkgChange = { "package.json": pkg({ "@acme/invoice-theme": "^1.0.0", express: "^4.21.0" }) };
  const npmrc = "@acme:registry=https://npm.acme.example/\n";
  const pb = scratch("pr", pkgBase, pkgChange);
  const pa = scratch("pr", pkgBase, { ...pkgChange, ".npmrc": npmrc });
  out.overrides.packages = { npmrc: npmrc.trim(), before: pb.output, beforeExit: pb.exitCode, after: pa.output, afterExit: pa.exitCode };
}

mkdirSync(new URL("../src/data/", import.meta.url), { recursive: true });
writeFileSync(new URL("../src/data/demo.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
for (const p of out.prs) console.log(`#${p.number} ${p.branch}: tests ${p.tests.passed} passed, ${p.tests.skipped} skipped -> isoklo ${p.check.verdict} (exit ${p.check.exitCode})`);
console.log(`doctor: ${out.doctor.json.findings.length} findings (exit ${out.doctor.exitCode})`);
