import type { Metadata } from "next";
import { Compass, Target, Sparkles } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { IndiaMap } from "@/components/about/IndiaMap";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Vision & Mission",
  description: "FAIITA's vision and mission for uniting India's IT trade ecosystem.",
};

export const revalidate = 3600;

const pillars = [
  {
    icon: Target,
    title: "Our Mission",
    body: "To unite state-level IT associations under a single federated platform — amplifying the collective voice of India's IT retailers, distributors, and service providers before policymakers, regulators, and industry bodies.",
  },
  {
    icon: Compass,
    title: "Our Vision",
    body: "A future where every IT entrepreneur in India, regardless of city or scale, has equal access to policy representation, market opportunity, and professional growth through a strong, connected federation.",
  },
  {
    icon: Sparkles,
    title: "Our Values",
    body: "Integrity in advocacy, inclusivity across states and business sizes, and a relentless focus on practical outcomes for the members who make up the federation.",
  },
];

const objectives = [
  "Represent member associations before central and state government bodies on GST, trade, and digital policy.",
  "Facilitate knowledge-sharing and skill development across the IT channel partner ecosystem.",
  "Strengthen collaboration between state associations through joint events, summits, and working groups.",
  "Expand federation coverage to every Indian state and union territory.",
  "Champion the interests of small and mid-sized IT businesses in an increasingly digital economy.",
];

export default async function VisionMissionPage() {
  const states = await prisma.stateAssociation.findMany({ orderBy: { stateName: "asc" } });
  const mapPoints = states.map((s) => ({
    id: s.id,
    slug: s.slug,
    stateName: s.stateName,
    stateCode: s.stateCode,
    region: s.region,
    associationName: s.associationName,
    memberCount: s.memberCount,
    foundedYear: s.foundedYear,
    mapX: s.mapX,
    mapY: s.mapY,
  }));

  return (
    <>
      <section className="bg-navy-800 py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="About / Vision & Mission"
            title="Vision & Mission"
            description="The principles that guide FAIITA's work uniting India's IT trade fraternity."
            light
          />
        </div>
      </section>

      <section className="bg-background py-24">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-3">
            {pillars.map((p, i) => (
              <ScrollReveal key={p.title} direction="up" delay={i * 0.08}>
                <TiltCard maxTilt={6}>
                  <GlassCard variant="light">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700">
                      <p.icon className="h-6 w-6" />
                    </div>
                    <h2 className="mt-5 font-display text-xl font-bold text-navy-800">{p.title}</h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </GlassCard>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>

          <div className="mt-16 rounded-3xl border border-border bg-secondary/60 p-10">
            <h2 className="font-display text-2xl font-bold text-navy-800">Strategic Objectives</h2>
            <ul className="mt-6 space-y-4">
              {objectives.map((o, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-saffron-500 font-mono text-xs font-bold text-navy-900">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-relaxed text-navy-800/80">{o}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-16">
            <SectionHeading
              eyebrow="Our Reach"
              title="A Vision Realized Across 29 States"
              description="Explore where FAIITA's member associations operate today."
            />
            <div className="mt-10">
              <IndiaMap states={mapPoints} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
