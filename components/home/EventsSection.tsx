import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatDateShort } from "@/lib/utils";
import type { EventItem } from "@/types";

const EVENT_IMAGES = [
  "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80",
  "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=800&q=80",
];

export function EventsSection({ events }: { events: EventItem[] }) {
  if (events.length === 0) return null;

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
                  <GlassCard variant="light" className="flex h-full flex-col overflow-hidden !p-0">
                    <div className="relative h-32 w-full shrink-0 overflow-hidden">
                      <Image
                        src={e.coverImage ?? EVENT_IMAGES[i % EVENT_IMAGES.length]}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute left-3 top-3 flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-navy-800/90 text-white backdrop-blur-sm">
                        <span className="font-mono text-base font-bold leading-none">{d.day}</span>
                        <span className="text-[9px] font-medium uppercase tracking-wide">{d.month}</span>
                      </div>
                      <span className="absolute right-3 top-3 flex items-center gap-1.5">
                        {e.isDemo && <DemoBadge className="bg-navy-900/70 text-amber-300" />}
                        <span className="rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-900">
                          {e.category}
                        </span>
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="font-display text-lg font-semibold leading-snug text-navy-800">
                        {e.title}
                      </h3>
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {e.city}, {e.state}
                      </p>
                      <Button asChild variant="link" className="mt-4 h-auto justify-start px-0 text-navy-700">
                        <Link href={`/resources/events/${e.slug}`}>
                          Learn More <span className="sr-only"> about {e.title}</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
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
