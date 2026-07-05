import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "State Associations",
  description: "Browse FAIITA's 29 state-level IT associations across India.",
};

export const revalidate = 3600;

export default async function StateAssociationsPage() {
  const states = await prisma.stateAssociation.findMany({ orderBy: { stateName: "asc" } });

  const regions = Array.from(new Set(states.map((s) => s.region)));

  return (
    <>
      <section className="bg-navy-800 py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="About / State Associations"
            title="29 State Associations, One Federation"
            description="Every state association operates independently while sharing in FAIITA's national advocacy and resources."
            light
          />
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container-page space-y-14">
          {regions.map((region) => (
            <div key={region}>
              <h2 className="font-display text-xl font-bold text-navy-800">{region} Zone</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {states
                  .filter((s) => s.region === region)
                  .map((s) => (
                    <Link
                      key={s.id}
                      href={`/about/state-associations/${s.slug}`}
                      className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-shadow hover:shadow-lg"
                    >
                      <h3 className="font-display text-base font-bold text-navy-800">{s.stateName}</h3>
                      <p className="mt-1 text-xs font-medium text-saffron-600">{s.associationName}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> {s.memberCount.toLocaleString("en-IN")} members
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
