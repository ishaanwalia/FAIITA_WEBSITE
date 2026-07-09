import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/common/PageHero";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { EventCalendar } from "@/components/common/EventCalendar";
import { EventsSpotlight } from "@/components/resources/EventsSpotlight";
import { formatDate } from "@/lib/utils";
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
      <PageHero
        eyebrow="Resources / Events"
        title="Events & Programs"
        description="Summits, AGMs, workshops, and regional meets across the federation."
        compact
      />
      <SectionDivider type="curve" className="bg-navy-800" />

      <section className="bg-background pb-8 pt-4">
        <div className="container-page">
          <ScrollReveal direction="scale">
            <EventCalendar events={events} />
          </ScrollReveal>
        </div>
      </section>

      <section className="bg-background pb-20 pt-8">
        <div className="container-page">
          <h2 className="font-display text-xl font-bold text-navy-800">Upcoming</h2>
          <div className="mt-6">
            {upcoming.length > 0 ? (
              <EventsSpotlight events={upcoming} />
            ) : (
              <p className="text-sm text-muted-foreground">No upcoming events scheduled right now — check back soon.</p>
            )}
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
