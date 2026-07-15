import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { MemberAssociationsGrid } from "@/components/about/MemberAssociationsGrid";
import { MembershipBenefits } from "@/components/common/MembershipBenefits";
import { memberAssociations } from "@/lib/member-associations";

export const metadata: Metadata = {
  title: "Member Associations",
  description: "Associations affiliated under FAIITA across retail, distribution, services, and solutions.",
};

export default function MemberAssociationsPage() {
  // Verified member associations come from lib/member-associations.ts (the
  // canonical source, also seeded into the DB for state detail pages).
  const members = memberAssociations.map((m) => ({
    id: m.slug,
    name: m.name,
    city: m.city,
    type: m.type,
    memberCount: m.memberCount,
    description: m.description,
    website: m.website ?? null,
    logoUrl: m.logoUrl ?? null,
    presidentName: m.presidentName ?? null,
    state: { stateName: m.stateName },
  }));

  return (
    <>
      <PageHero
        eyebrow="About / Member Associations"
        title="Member Associations"
        description="City and district associations that operate under each state chapter — the backbone of FAIITA's grassroots network. More verified member listings are being added."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          <MemberAssociationsGrid members={members} />
        </div>
      </section>

      <MembershipBenefits eyebrow="Why Join" />
    </>
  );
}
