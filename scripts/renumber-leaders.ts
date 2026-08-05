/**
 * One-off: give every leader a unique `order` matching the order the site
 * already shows.  Run: npx tsx scripts/renumber-leaders.ts [--apply]
 *
 * Before this, /about/leadership ignored `order` and re-sorted by a hardcoded
 * list of role names. Eight Governing Body members migrated in from the old
 * code-side file had never been given an order at all and all sat at 0, so the
 * admin list showed them ahead of the President. The page now sorts by `order`,
 * so the column has to say what the page was already doing.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const apply = process.argv.includes("--apply");

// The rank the page used to hardcode. Used once, here, to freeze today's
// rendered order into the column — after this the column is the truth.
const OFFICE_ORDER = ["President", "Chairman", "Advisor, PP", "Secretary", "Senior Vice President",
  "Vice President", "Treasurer", "Joint Secretary", "Joint Treasurer"];
const rank = (role: string) => {
  const i = OFFICE_ORDER.indexOf(role);
  return i === -1 ? OFFICE_ORDER.length : i;
};

(async () => {
  for (const isCurrent of [true, false]) {
    const leaders = await prisma.leader.findMany({
      where: { category: "national", isCurrent, deletedAt: null },
      orderBy: { order: "asc" },
    });
    const sorted = [...leaders].sort(
      (a, b) => rank(a.role) - rank(b.role) || a.name.localeCompare(b.name),
    );

    console.log(`\n${isCurrent ? "CURRENT" : "PAST"} — ${sorted.length} leaders`);
    for (const [i, l] of sorted.entries()) {
      const next = i + 1;
      const changed = l.order !== next;
      console.log(`  ${String(next).padStart(3)}  ${changed ? `(was ${l.order})`.padEnd(10) : "".padEnd(10)} ${l.role.padEnd(24)} ${l.name}`);
      if (apply && changed) await prisma.leader.update({ where: { id: l.id }, data: { order: next } });
    }
  }
  console.log(apply ? "\napplied" : "\ndry run — pass --apply to write");
  await prisma.$disconnect();
})();
