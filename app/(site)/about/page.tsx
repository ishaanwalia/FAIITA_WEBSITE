import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, Layers, ShieldCheck, Users2 } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TextReveal } from "@/components/common/TextReveal";
import { GradientMesh } from "@/components/common/GradientMesh";
import { IndiaMap } from "@/components/about/IndiaMap";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "About FAIITA",
  description:
    "Learn about FAIITA's vision, structure, leadership, and the nationwide network of IT associations it federates.",
};

export const revalidate = 3600;

const hubLinks = [
  { icon: Compass, title: "Vision & Mission", href: "/about/vision-mission", description: "What we stand for and where we're headed." },
  { icon: Layers, title: "About FAIITA", href: "/about/about-faiita", description: "Our history, structure and how the federation works." },
  { icon: ShieldCheck, title: "Leadership", href: "/about/leadership", description: "The governing body steering the federation." },
  { icon: Users2, title: "Member Associations", href: "/about/member-associations", description: "Associations affiliated under FAIITA." },
];

export default async function AboutPage() {
  const states = await prisma.stateAssociation.findMany({
    orderBy: { stateName: "asc" },
  });

  const mapPoints = states.map((s) => ({
    id: s.id,
    slug: s.slug,
    stateName: s.stateName,
    stateCode: s.stateCode,
    region: s.region,
    associationName: s.associationName,
    memberCount: s.memberCount,
    foundedYear: s.foundedYear,
    presidentName: s.presidentName,
    contactEmail: s.contactEmail,
    contactPhone: s.contactPhone,
    logoUrl: s.logoUrl,
    mapX: s.mapX,
    mapY: s.mapY,
  }));

  return (
    <>
      <section className="relative overflow-hidden bg-navy-800 py-24">
        <GradientMesh />
        <div className="absolute inset-0 bg-network-grid opacity-10" />
        <div className="container-page relative">
          <span className="section-eyebrow">About Us</span>
          <TextReveal
            text="One Federation, One National Voice"
            as="h1"
            className="mt-3 max-w-3xl text-balance font-display text-3xl font-bold tracking-tight text-white sm:text-4xl"
          />
          <p className="mt-4 max-w-2xl text-balance leading-relaxed text-white/65">
            FAIITA brings together India's state-level IT associations into a
            single national voice — advocating for policy, enabling growth,
            and connecting 50,000+ channel partners.
          </p>
        </div>
      </section>

      <section className="border-b border-border bg-background py-16">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hubLinks.map((l) => (
            <Link key={l.href} href={l.href}>
              <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-xl">
                <CardContent className="p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700 group-hover:bg-saffron-500 group-hover:text-navy-900">
                    <l.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-display text-base font-semibold text-navy-800">{l.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{l.description}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy-700">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Interactive Map"
            title="Explore Our State Associations"
            description="Click any state to view its association, membership size, and founding year. Filter by region or switch to a list view."
            align="center"
            className="mx-auto"
          />
          <div className="mt-14">
            <IndiaMap states={mapPoints} />
          </div>
        </div>
      </section>
    </>
  );
}
