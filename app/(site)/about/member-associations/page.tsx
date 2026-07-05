import type { Metadata } from "next";
import { Building2, MapPin, Users } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { Badge } from "@/components/ui/badge";
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
      <section className="bg-navy-800 py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="About / Member Associations"
            title="100+ Member Associations"
            description="City and regional associations that operate under each state chapter — the backbone of FAIITA's grassroots network."
            light
          />
        </div>
      </section>

      <section className="bg-background py-20">
        <div className="container-page">
          {members.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {members.map((m) => (
                <div key={m.id} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                  <Badge variant="outline" className="w-fit">{m.type}</Badge>
                  <h3 className="mt-4 font-display text-base font-bold text-navy-800">{m.name}</h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {m.city}, {m.state.stateName}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                  <p className="mt-4 flex items-center gap-1.5 border-t border-border pt-4 text-xs font-semibold text-saffron-600">
                    <Users className="h-3.5 w-3.5" /> {m.memberCount.toLocaleString("en-IN")} members
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </>
  );
}

function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border p-16 text-center">
      <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="mt-4 text-sm text-muted-foreground">
        Member association profiles are being added. Check back soon, or explore our{" "}
        <a href="/about/state-associations" className="text-navy-700 underline">
          state associations
        </a>
        .
      </p>
    </div>
  );
}
