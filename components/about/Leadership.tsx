"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Mail, MapPin, Phone } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export type LeaderData = {
  id: string;
  name: string;
  role: string;
  associationName: string | null;
  stateName: string | null;
  email: string | null;
  phone: string | null;
  bio: string | null;
  term: string;
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export function Leadership({
  current,
  past,
}: {
  current: LeaderData[];
  past: LeaderData[];
}) {
  const [tab, setTab] = useState<"current" | "past">("current");
  const activeList = tab === "current" ? current : past;
  const [featuredId, setFeaturedId] = useState<string | undefined>(current[0]?.id);
  const featured = activeList.find((l) => l.id === featuredId) ?? activeList[0];

  const selectTab = (t: "current" | "past") => {
    setTab(t);
    setFeaturedId((t === "current" ? current : past)[0]?.id);
  };

  return (
    <div>
      <div className="mx-auto flex w-fit gap-1 rounded-full border border-border bg-secondary/60 p-1">
        {(["current", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => selectTab(t)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              tab === t ? "bg-navy-700 text-white" : "text-muted-foreground hover:text-navy-700"
            )}
          >
            {t === "current" ? `Current GB (${current[0]?.term ?? ""})` : `Past GB (${past[0]?.term ?? ""})`}
          </button>
        ))}
      </div>

      {/* Spotlight — the selected leader, shown prominently */}
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-10 overflow-hidden rounded-3xl bg-navy-800 p-8 sm:p-10"
          >
            <div className="absolute inset-0 bg-network-grid opacity-10" />
            <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
              <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 font-display text-4xl font-bold text-navy-900">
                {initials(featured.name)}
              </span>
              <div className="flex-1">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-400">
                  <Award className="h-3 w-3" /> {featured.role}
                </span>
                <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">{featured.name}</h3>
                {featured.associationName && (
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-saffron-400">
                    <MapPin className="h-3.5 w-3.5" /> {featured.associationName}
                  </p>
                )}
                {featured.bio && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">{featured.bio}</p>}
                {tab === "current" && (featured.email || featured.phone) && (
                  <div className="mt-4 flex gap-4">
                    {featured.email && (
                      <a href={`mailto:${featured.email}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white">
                        <Mail className="h-3.5 w-3.5" /> {featured.email}
                      </a>
                    )}
                    {featured.phone && (
                      <a href={`tel:${featured.phone}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white">
                        <Phone className="h-3.5 w-3.5" /> {featured.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid — click any card to feature it above */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeList.map((l, i) => (
          <ScrollReveal key={l.id} direction="up" delay={i * 0.05}>
            <TiltCard maxTilt={6}>
              <button onClick={() => setFeaturedId(l.id)} className="block w-full text-left">
                <GlassCard
                  variant="dark"
                  className={cn("text-center transition-all", featured?.id === l.id && "ring-2 ring-saffron-400")}
                >
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-saffron-400 to-saffron-600 font-display text-lg font-bold text-navy-900">
                    {initials(l.name)}
                  </span>
                  <h4 className="mt-3 font-display text-base font-bold text-white">{l.name}</h4>
                  <p className="text-xs font-semibold text-saffron-400">{l.role}</p>
                  {l.associationName && <p className="mt-1 text-[11px] text-white/50">{l.associationName}</p>}
                </GlassCard>
              </button>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
