import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { Leadership } from "@/components/about/Leadership";
import type { LeaderData } from "@/components/about/Leadership";
import { prisma } from "@/lib/prisma";
import { jsonLd } from "@/lib/utils";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "The FAIITA Governing Body for 2025–27 — office bearers and 26 elected members drawn from IT associations across India, with their roles, states and contact details.",
  alternates: { canonical: "/about/leadership" },
};

export const revalidate = 3600;

export default async function LeadershipPage() {
  // Ordered by the `order` column and nothing else.
  //
  // This page used to re-sort by a hardcoded list of role names, which meant
  // the "Position in the list" box in the CMS did nothing at all: an editor
  // could renumber the Governing Body, save, and watch the page not move.
  // Roles still decide which band a tile sits in and how wide it is (see
  // gridSpan in components/about/Leadership.tsx) — but where somebody appears
  // within their band is now theirs to set. `name` only breaks ties.
  //
  // journey and companies come back as Prisma Json, so they're narrowed to the
  // shapes Leadership renders rather than cast blindly.
  const current = (
    await prisma.leader.findMany({
      where: { category: "national", isCurrent: true, deletedAt: null },
      orderBy: [{ order: "asc" }, { name: "asc" }],
    })
  ).map((l) => ({
    ...l,
    journey: (l.journey ?? undefined) as LeaderData["journey"],
    companies: (l.companies ?? undefined) as LeaderData["companies"],
    location: l.location ?? undefined,
    website: l.website ?? undefined,
  }));

  // The Governing Body as people, tied to the federation by the same @id the
  // root layout publishes. This is the page most likely to be the answer to
  // "who is the president of FAIITA", and until now it said so only in prose.
  // Email and phone are included only where the leader has chosen to publish
  // them on the card already.
  const leadershipSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "FAIITA Governing Body 2025–27",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: current.length,
    itemListElement: current.map((l, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: l.name,
        jobTitle: l.role,
        memberOf: { "@id": `${siteUrl}/#organization` },
        ...(l.imageUrl && { image: l.imageUrl.startsWith("http") ? l.imageUrl : `${siteUrl}${l.imageUrl}` }),
        ...(l.associationName && { affiliation: { "@type": "Organization", name: l.associationName } }),
        ...(l.email && { email: l.email }),
        ...(l.linkedIn && { sameAs: [l.linkedIn] }),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(leadershipSchema) }} />
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
