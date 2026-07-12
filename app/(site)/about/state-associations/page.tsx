import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { StateAssociationsGrid } from "@/components/about/StateAssociationsGrid";
import { prisma } from "@/lib/prisma";
import { normalizeZone } from "@/lib/utils";

export const metadata: Metadata = {
  title: "State Associations",
  description: "Browse FAIITA's state-level IT associations spanning 28 states across India.",
};

export const revalidate = 3600;

export default async function StateAssociationsPage() {
  const states = (await prisma.stateAssociation.findMany({ orderBy: { stateName: "asc" } })).map(
    (s) => ({ ...s, region: normalizeZone(s.region) })
  );

  return (
    <>
      <PageHero
        eyebrow="About / State Associations"
        title="28 States, One Federation"
        description="Every state association operates independently while sharing in FAIITA's national advocacy and resources."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          <StateAssociationsGrid states={states} />
        </div>
      </section>
    </>
  );
}
