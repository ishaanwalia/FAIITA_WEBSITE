import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Leadership } from "@/components/about/Leadership";
import type { LeaderData } from "@/components/about/Leadership";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Leadership",
  description: "Meet FAIITA's national Governing Body 2025–27.",
  alternates: { canonical: "/about/leadership" },
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
  // Reads the database and nothing else. The profile overlay, the two role
  // corrections and the appended code-side members that used to live here were
  // migrated into the rows themselves (scripts/migrate-content.ts) — leaving
  // any of them in place would now double every member it added.
  //
  // journey and companies come back as Prisma Json, so they're narrowed to the
  // shapes Leadership renders rather than cast blindly.
  const current = (
    await prisma.leader.findMany({
      where: { category: "national", isCurrent: true, deletedAt: null },
      orderBy: { order: "asc" },
    })
  )
    .map((l) => ({
      ...l,
      journey: (l.journey ?? undefined) as LeaderData["journey"],
      companies: (l.companies ?? undefined) as LeaderData["companies"],
      location: l.location ?? undefined,
      website: l.website ?? undefined,
    }))
    // GB Members (equal office rank) are ordered alphabetically by name.
    .sort((a, b) => officeRank(a.role) - officeRank(b.role) || a.name.localeCompare(b.name));

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
