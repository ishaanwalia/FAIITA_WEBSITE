import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { MemberAssociationsGrid } from "@/components/about/MemberAssociationsGrid";
import { MembershipBenefits } from "@/components/common/MembershipBenefits";
import { memberAssociations } from "@/lib/member-associations";

export const metadata: Metadata = {
  title: "Member Associations",
  description: "City and district IT associations affiliated to FAIITA across India.",
};

export default function MemberAssociationsPage() {
  return (
    <>
      <PageHero
        eyebrow="About / Member Associations"
        title="Member Associations"
        description="City and district associations that operate under each state chapter — the backbone of FAIITA's grassroots network. More verified member listings are being added."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          <MemberAssociationsGrid members={memberAssociations} />
        </div>
      </section>

      <MembershipBenefits eyebrow="Why Join" />
    </>
  );
}
