import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { StateAssociationsGrid } from "@/components/about/StateAssociationsGrid";
import { prisma } from "@/lib/prisma";
import { normalizeZone } from "@/lib/utils";

export const metadata: Metadata = {
  title: "State Associations",
  description: "Browse FAIITA's state-level IT associations spanning 26 states across India.",
  alternates: { canonical: "/about/state-associations" },
};

export const revalidate = 3600;

export default async function StateAssociationsPage() {
  const states = (
    await prisma.stateAssociation.findMany({
      where: { deletedAt: null },
      orderBy: { stateName: "asc" },
    })
  ).map((s) => ({ ...s, region: normalizeZone(s.region) }));

  return (
    <>
      <PageHero
        eyebrow="About / State Associations"
        title="26 States, One Federation"
        description="Every state association operates independently while sharing in FAIITA's national advocacy and resources."
      />

      <section className="bg-background py-20" aria-labelledby="all-state-associations">
        <div className="container-page">
          <h2 id="all-state-associations" className="sr-only">
            All state associations
          </h2>
          <StateAssociationsGrid states={states} />
        </div>
      </section>
    </>
  );
}
