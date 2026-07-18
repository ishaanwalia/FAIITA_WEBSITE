import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Leadership } from "@/components/about/Leadership";
import { extraCurrentLeaders, withLeaderProfile } from "@/lib/leader-profiles";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet FAIITA's national Governing Body 2025–27.",
};

export const revalidate = 3600;

// Office bearers lead the GB grid in this order; GB Members follow,
// alphabetically by name.
const OFFICE_ORDER = [
  "President",
  "Chairman",
  "Advisor, PP",
  "Secretary",
  "Senior Vice President",
  "Vice President",
  "Treasurer",
  "Joint Secretary",
  "Joint Treasurer",
];
const officeRank = (role: string) => {
  const i = OFFICE_ORDER.indexOf(role);
  return i === -1 ? OFFICE_ORDER.length : i;
};

export default async function LeadershipPage() {
  const allLeaders = (
    await prisma.leader.findMany({
      where: { category: "national", isCurrent: true },
      orderBy: { order: "asc" },
    })
  )
    .map(withLeaderProfile)
    // 2025–27 Advisor tag reads "PP" (Past President), not "IPP" — the
    // Immediate Past President of this term is Devesh Rastogi. The past-GB
    // record keeps "IPP", which was accurate for 2022–24.
    .map((l) => (l.isCurrent && l.role === "Advisor, IPP" ? { ...l, role: "Advisor, PP" } : l))
    // Devesh Rastogi is Chairman for 2025–27 — the live DB row still says
    // "GB Member" until the next reseed (prisma/seed.ts is already corrected).
    // His past-GB record (President, 2022–24) is untouched.
    .map((l) => (l.isCurrent && l.name === "Devesh Rastogi" ? { ...l, role: "Chairman" } : l));

  // Members not yet in the DB are appended from the code-side profile file.
  // GB Members (equal office rank) are ordered alphabetically by name.
  const current = [...allLeaders.filter((l) => l.isCurrent), ...extraCurrentLeaders].sort(
    (a, b) => officeRank(a.role) - officeRank(b.role) || a.name.localeCompare(b.name)
  );

  return (
    <>
      <PageHero
        eyebrow="About / Leadership"
        title="National Leadership"
        description="FAIITA's Governing Body (GB) serves a two-year term. Meet the office bearers and GB members leading the federation through 2025–27."
      />

      <section className="bg-background py-24">
        <div className="container-page">
          <Leadership leaders={current} />
        </div>
      </section>
    </>
  );
}
