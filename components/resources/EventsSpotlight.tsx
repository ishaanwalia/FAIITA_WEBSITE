"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate, formatDateShort } from "@/lib/utils";
import { cn } from "@/lib/utils";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: string;
  city: string;
  state: string;
  startDate: Date;
};

export function EventsSpotlight({ events }: { events: EventRow[] }) {
  const [featuredId, setFeaturedId] = useState(events[0]?.id);
  const featured = events.find((e) => e.id === featuredId) ?? events[0];

  if (!featured) return null;

  return (
    <div>
      <AnimatePresence mode="wait">
        <motion.div
          key={featured.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 sm:p-10"
        >
          <div className="absolute inset-0 bg-network-grid opacity-10" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 text-navy-900">
              <span className="font-mono text-2xl font-bold leading-none">{formatDateShort(featured.startDate).day}</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide">{formatDateShort(featured.startDate).month}</span>
            </div>
            <div className="flex-1">
              <span className="inline-flex rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-400">
                {featured.category}
              </span>
              <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">{featured.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/50">
                <MapPin className="h-3.5 w-3.5" /> {featured.city}, {featured.state} · {formatDate(featured.startDate)}
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{featured.description}</p>
              <Link
                href={`/resources/events/${featured.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-400 hover:text-saffron-300"
              >
                View details <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((e) => {
          const d = formatDateShort(e.startDate);
          const isFeatured = e.id === featured.id;
          return (
            <TiltCard key={e.id} maxTilt={6} className="h-full">
              <button onClick={() => setFeaturedId(e.id)} className="block h-full w-full text-left">
                <GlassCard
                  variant="light"
                  className={cn("flex h-full flex-col", isFeatured && "ring-2 ring-saffron-400")}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl bg-navy-700 text-white">
                      <span className="font-mono text-sm font-bold leading-none">{d.day}</span>
                      <span className="text-[9px] font-medium uppercase tracking-wide">{d.month}</span>
                    </div>
                    <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-600">
                      {e.category}
                    </span>
                  </div>
                  <h4 className="mt-4 font-display text-base font-semibold leading-snug text-navy-800">{e.title}</h4>
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5" /> {e.city}, {e.state}
                  </p>
                </GlassCard>
              </button>
            </TiltCard>
          );
        })}
      </div>
    </div>
  );
}
