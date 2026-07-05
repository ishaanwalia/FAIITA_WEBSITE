import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate, formatDateShort } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Events",
  description: "FAIITA's summits, AGMs, workshops and regional meets.",
};

export const revalidate = 3600;

export default async function EventsPage() {
  const events = await prisma.event.findMany({ orderBy: { startDate: "asc" } });
  const now = new Date();
  const upcoming = events.filter((e) => e.startDate >= now);
  const past = events.filter((e) => e.startDate < now);

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / Events"
            title="Events & Programs"
            description="Summits, AGMs, workshops, and regional meets across the federation."
            light
          />
        </div>
      </section>
      <SectionDivider type="curve" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
        <div className="container-page">
          <h2 className="font-display text-xl font-bold text-navy-800">Upcoming</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((e, i) => {
              const d = formatDateShort(e.startDate);
              return (
                <ScrollReveal key={e.id} direction="up" delay={(i % 3) * 0.08}>
                  <TiltCard maxTilt={6} className="h-full">
                    <Link href={`/resources/events/${e.slug}`} className="group block h-full">
                      <GlassCard variant="light" className="flex h-full flex-col">
                        <div className="flex items-start justify-between">
                          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-navy-700 text-white">
                            <span className="font-mono text-lg font-bold leading-none">{d.day}</span>
                            <span className="text-[10px] font-medium uppercase tracking-wide">{d.month}</span>
                          </div>
                          <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-600">
                            {e.category}
                          </span>
                        </div>
                        <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-navy-800">{e.title}</h3>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" /> {e.city}, {e.state}
                        </p>
                        <span className="mt-4 flex items-center gap-1 text-xs font-semibold text-navy-700">
                          Details <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </GlassCard>
                    </Link>
                  </TiltCard>
                </ScrollReveal>
              );
            })}
            {upcoming.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events scheduled right now — check back soon.</p>}
          </div>

          {past.length > 0 && (
            <div className="mt-16">
              <h2 className="font-display text-xl font-bold text-navy-800">Past Events</h2>
              <div className="mt-6 divide-y divide-border rounded-2xl border border-border">
                {past.map((e) => (
                  <Link key={e.id} href={`/resources/events/${e.slug}`} className="flex items-center justify-between p-5 hover:bg-secondary/60">
                    <div>
                      <p className="font-medium text-navy-800">{e.title}</p>
                      <p className="text-xs text-muted-foreground">{e.city}, {e.state}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{formatDate(e.startDate)}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
