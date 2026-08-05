/**
 * Renders every page the content migration can affect and snapshots its
 * visible text, so "the site looks identical afterwards" can be checked rather
 * than asserted.
 *
 *   npm run render:snap before     # with a dev server running on :3000
 *   npm run content:migrate
 *   npm run render:snap after
 *   npm run render:diff            # compares before/after
 *
 * Visible text, not HTML: class-name churn and Next's build-id hashes differ
 * between runs and would drown any real change in noise. What a reader sees is
 * the thing that must not move.
 */

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.VERIFY_BASE ?? "http://localhost:3000";
const DIR = ".render-snapshots";

const PAGES = [
  "/",
  "/about",
  "/about/leadership",
  "/about/state-associations",
  "/about/member-associations",
  "/resources",
  "/resources/news",
  "/resources/gallery",
  "/resources/events",
  "/resources/newsletter",
];

function visibleText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join("\n");
}

const fileFor = (label: string, page: string) =>
  join(DIR, label, `${page === "/" ? "home" : page.slice(1).replace(/\//g, "_")}.txt`);

async function snap(label: string) {
  mkdirSync(join(DIR, label), { recursive: true });
  for (const page of PAGES) {
    const res = await fetch(`${BASE}${page}`, { headers: { "cache-control": "no-cache" } });
    if (!res.ok) {
      console.log(`  ${page}  HTTP ${res.status} — skipped`);
      continue;
    }
    const text = visibleText(await res.text());
    writeFileSync(fileFor(label, page), text);
    console.log(`  ${page.padEnd(32)} ${text.split("\n").length} lines`);
  }
  console.log(`\n  Snapshot "${label}" written to ${DIR}/${label}\n`);
}

function diff(a: string, b: string) {
  let changed = 0;
  for (const file of readdirSync(join(DIR, a))) {
    const before = readFileSync(join(DIR, a, file), "utf8").split("\n");
    const after = readFileSync(join(DIR, b, file), "utf8").split("\n");

    // Multiset, not set: comparing with `includes` makes a line that now
    // appears twice look unchanged, which is exactly how a duplicated record
    // slips through. Counts are what catch it.
    const tally = (lines: string[]) =>
      lines.reduce((m, l) => m.set(l, (m.get(l) ?? 0) + 1), new Map<string, number>());
    const beforeCount = tally(before);
    const afterCount = tally(after);
    const removed: string[] = [];
    const added: string[] = [];
    for (const line of new Set([...beforeCount.keys(), ...afterCount.keys()])) {
      const delta = (afterCount.get(line) ?? 0) - (beforeCount.get(line) ?? 0);
      for (let i = 0; i < delta; i++) added.push(line);
      for (let i = 0; i < -delta; i++) removed.push(line);
    }

    if (removed.length === 0 && added.length === 0) {
      console.log(`  = ${file}`);
      continue;
    }

    changed += 1;
    console.log(`\n  ~ ${file}`);
    for (const line of removed.slice(0, 12)) console.log(`      - ${line.slice(0, 110)}`);
    if (removed.length > 12) console.log(`      - …${removed.length - 12} more removed`);
    for (const line of added.slice(0, 12)) console.log(`      + ${line.slice(0, 110)}`);
    if (added.length > 12) console.log(`      + …${added.length - 12} more added`);
  }

  console.log(
    changed === 0
      ? `\n  No page changed. The migration is render-identical.\n`
      : `\n  ${changed} page(s) changed — read the diff above before shipping.\n`
  );
}

async function main() {
  const [mode, ...args] = process.argv.slice(2);
  if (mode === "snap") await snap(args[0] ?? "snapshot");
  else if (mode === "diff") diff(args[0] ?? "before", args[1] ?? "after");
  else console.log("usage: verify-render snap <label> | verify-render diff <a> <b>");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
