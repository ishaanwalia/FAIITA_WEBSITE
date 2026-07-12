import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Leadership } from "@/components/about/Leadership";
import { extraCurrentLeaders, withLeaderProfile } from "@/lib/leader-profiles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet FAIITA's current and past national governing bodies.",
};

export const revalidate = 3600;

// Office bearers lead the current GB grid in this order; GB Members follow in
// their DB order. Keeps the Joint Treasurer between Treasurer and Advisor even
// while the live DB still carries the old ordering (prisma/seed.ts is already
// corrected for the next reseed).
const OFFICE_ORDER = [
  "President",
  "Senior Vice President",
  "Vice President",
  "Secretary",
  "Joint Secretary",
  "Treasurer",
  "Joint Treasurer",
  "Advisor, PP",
];
const officeRank = (role: string) => {
  const i = OFFICE_ORDER.indexOf(role);
  return i === -1 ? OFFICE_ORDER.length : i;
};

export default async function LeadershipPage() {
  const allLeaders = (
    await prisma.leader.findMany({
      where: { category: "national" },
      orderBy: { order: "asc" },
    })
  )
    .map(withLeaderProfile)
    // 2025–27 Advisor tag reads "PP" (Past President), not "IPP" — the
    // Immediate Past President of this term is Devesh Rastogi. The past-GB
    // record keeps "IPP", which was accurate for 2022–24.
    .map((l) => (l.isCurrent && l.role === "Advisor, IPP" ? { ...l, role: "Advisor, PP" } : l));

  // Members not yet in the DB are appended from the code-side profile file.
  const current = [...allLeaders.filter((l) => l.isCurrent), ...extraCurrentLeaders].sort(
    (a, b) => officeRank(a.role) - officeRank(b.role)
  );
  const past = allLeaders.filter((l) => !l.isCurrent);

  return (
    <>
      <PageHero
        eyebrow="About / Leadership"
        title="National Leadership"
        description="FAIITA's Governing Body (GB) serves a two-year term. Browse the current GB, or look back at the previous term below."
      />

      <section className="bg-background py-24">
        <div className="container-page">
          <Leadership current={current} past={past} />
        </div>
      </section>
    </>
  );
}
