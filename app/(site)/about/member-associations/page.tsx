import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { MemberAssociationsGrid } from "@/components/about/MemberAssociationsGrid";
import { MembershipBenefits } from "@/components/common/MembershipBenefits";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Member Associations",
  description: "Associations affiliated under FAIITA across retail, distribution, services, and solutions.",
};

export const revalidate = 3600;

export default async function MemberAssociationsPage() {
  const members = await prisma.memberAssociation.findMany({
    include: { state: true },
    orderBy: { memberCount: "desc" },
  });

  return (
    <>
      <PageHero
        eyebrow="About / Member Associations"
        title="100+ Member Associations"
        description="City and regional associations that operate under each state chapter — the backbone of FAIITA's grassroots network."
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
