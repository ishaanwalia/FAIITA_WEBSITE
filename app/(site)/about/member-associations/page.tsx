import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { MemberAssociationsGrid } from "@/components/about/MemberAssociationsGrid";
import { MembershipBenefits } from "@/components/common/MembershipBenefits";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Member Associations",
  description: "City and district IT associations affiliated to FAIITA across India.",
  alternates: { canonical: "/about/member-associations" },
};

export const revalidate = 3600;

export default async function MemberAssociationsPage() {
  const members = await prisma.memberAssociation.findMany({
    where: { deletedAt: null },
    orderBy: { name: "asc" },
    include: { state: { select: { stateName: true } } },
  });

  return (
    <>
      <PageHero
        eyebrow="About / Member Associations"
        title="Member Associations"
        description="City and district associations that operate under each state chapter — the backbone of FAIITA's grassroots network. More verified member listings are being added."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          {members.length > 0 ? (
            <MemberAssociationsGrid
              members={members.map((m) => ({
                slug: m.slug,
                name: m.name,
                city: m.city ?? "",
                stateName: m.state.stateName,
                memberCount: m.memberCount,
                logoUrl: m.logoUrl,
                isDemo: m.isDemo,
              }))}
            />
          ) : (
            // Better an honest blank than a fake card: verified city and
            // district listings are still being collected, and every one that
            // arrives is added through the dashboard.
            <div className="mx-auto max-w-xl rounded-2xl border border-border bg-card px-6 py-12 text-center">
              <h2 className="font-display text-lg font-bold text-navy-800">
                Listings are being collected
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Every city and district association affiliated to FAIITA is being verified with its
                state chapter before it appears here, with its own page, contact details and
                membership numbers. If your association is affiliated and not yet listed, write to{" "}
                <a href="mailto:secretary@faiita.co.in" className="text-navy-700 hover:underline">
                  secretary@faiita.co.in
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      <MembershipBenefits eyebrow="Why Join" />
    </>
  );
}
