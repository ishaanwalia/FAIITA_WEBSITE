import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { formatDateShort } from "@/lib/utils";
import type { EventItem } from "@/types";

export function EventsSection({ events }: { events: EventItem[] }) {
  return (
    <section className="bg-secondary/60 py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Mark Your Calendar" title="Upcoming Events" />
          <Link
            href="/resources/events"
            className="link-underline flex items-center gap-1 text-sm font-semibold text-navy-700"
          >
            View all events <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {events.slice(0, 3).map((e, i) => {
            const d = formatDateShort(e.startDate);
            return (
              <ScrollReveal key={e.id} direction="up" delay={i * 0.08}>
                <TiltCard maxTilt={6} className="h-full">
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
                    <h3 className="mt-5 font-display text-lg font-semibold leading-snug text-navy-800">
                      {e.title}
                    </h3>
                    <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {e.city}, {e.state}
                    </p>
                    <Button asChild variant="link" className="mt-4 h-auto justify-start px-0 text-navy-700">
                      <Link href="/resources/events">
                        Learn More <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </GlassCard>
                </TiltCard>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
