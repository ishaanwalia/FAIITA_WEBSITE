"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Briefcase, Building2, Globe, History, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { PhotoAvatar } from "@/components/common/PhotoAvatar";
import { FlipCard } from "@/components/common/FlipCard";
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
  imageUrl?: string | null;
  linkedIn?: string | null;
  focusAreas?: string | null;
  /** Extended profile fields merged in from lib/leader-profiles.ts */
  journey?: { text: string; url?: string }[];
  companies?: { name: string; url?: string }[];
  location?: string;
  website?: string;
};

/** "https://www.anjalirajkot.com" → "anjalirajkot.com" for display */
function prettyUrl(url: string) {
  return url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");
}

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
  const spotlightRef = useRef<HTMLDivElement>(null);

  const selectTab = (t: "current" | "past") => {
    setTab(t);
    setFeaturedId((t === "current" ? current : past)[0]?.id);
  };

  // On small screens the spotlight card sits above the grid, so tapping a tile
  // must scroll back up to it — otherwise the selection appears to do nothing.
  const featureLeader = (id: string) => {
    setFeaturedId(id);
    if (typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => spotlightRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
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

      {/* Spotlight — longer card, with extra info not shown on the grid tiles.
          scroll-mt clears the fixed navbar when the mobile auto-scroll lands here. */}
      <div ref={spotlightRef} className="scroll-mt-24">
      <AnimatePresence mode="wait">
        {featured && (
          <motion.div
            key={featured.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative mt-10 min-h-[320px] overflow-hidden rounded-3xl bg-navy-800 p-8 sm:p-12"
          >
            <div className="absolute inset-0 bg-network-grid opacity-10" />
            <div className="relative flex h-full flex-col gap-8 sm:flex-row">
              <PhotoAvatar initials={initials(featured.name)} imageUrl={featured.imageUrl} size="xl" className="rounded-3xl" />

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
                {featured.journey?.map((step) => (
                  <p key={step.text} className="mt-2 flex items-start gap-1.5 text-sm text-white/55">
                    <History className="mt-0.5 h-3.5 w-3.5 shrink-0 text-electric/70" />
                    {step.url ? (
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline hover:text-white"
                      >
                        {step.text}
                      </a>
                    ) : (
                      step.text
                    )}
                  </p>
                ))}
                {featured.bio && <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{featured.bio}</p>}

                {/* Digital visiting card — the leader's business identity at a glance */}
                {(featured.companies?.length || featured.location || featured.website) && (
                  <div className="mt-5 inline-flex flex-wrap items-center gap-x-6 gap-y-2.5 rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                    {featured.companies?.map((c) =>
                      c.url ? (
                        <a
                          key={c.name}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="link-underline flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white"
                        >
                          <Building2 className="h-4 w-4 text-saffron-400" /> {c.name}
                        </a>
                      ) : (
                        <span key={c.name} className="flex items-center gap-2 text-sm font-medium text-white/80">
                          <Building2 className="h-4 w-4 text-saffron-400" /> {c.name}
                        </span>
                      )
                    )}
                    {featured.location && (
                      <span className="flex items-center gap-2 text-sm text-white/65">
                        <MapPin className="h-4 w-4 text-saffron-400" /> {featured.location}
                      </span>
                    )}
                    {featured.website && (
                      <a
                        href={featured.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline flex items-center gap-2 text-sm text-white/65 hover:text-white"
                      >
                        <Globe className="h-4 w-4 text-saffron-400" /> {prettyUrl(featured.website)}
                      </a>
                    )}
                  </div>
                )}

                {featured.focusAreas && (
                  <div className="mt-5">
                    <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-white/40">
                      <Briefcase className="h-3.5 w-3.5" /> Focus Areas
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {featured.focusAreas.split(",").map((tag) => (
                        <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex flex-wrap gap-4 border-t border-white/10 pt-5">
                  {tab === "current" && featured.email && (
                    <a href={`mailto:${featured.email}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white">
                      <Mail className="h-3.5 w-3.5" /> {featured.email}
                    </a>
                  )}
                  {tab === "current" && featured.phone && (
                    <a href={`tel:${featured.phone}`} className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white">
                      <Phone className="h-3.5 w-3.5" /> {featured.phone}
                    </a>
                  )}
                  {featured.linkedIn && (
                    <a href={featured.linkedIn} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white">
                      <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Bento grid — click a tile to feature it above; hover a tile to see
          its photo zoom in, click the info icon to flip for contact details. */}
      <div className="mt-8 grid auto-rows-[172px] grid-cols-2 gap-4 sm:grid-cols-4" style={{ perspective: 1400 }}>
        {activeList.map((l, i) => {
          const spanClass =
            i === 0 ? "col-span-2 row-span-2" : i === 1 ? "col-span-2 row-span-1" : "col-span-1 row-span-1";
          const isFeatured = featured?.id === l.id;
          const hasContact = tab === "current" && (l.email || l.phone || l.website);

          const frontFace = (
            <GlassCard
              variant="dark"
              clip
              className={cn(
                "flex h-full flex-col items-center justify-center text-center transition-all",
                isFeatured && "ring-2 ring-saffron-400"
              )}
            >
              <PhotoAvatar
                initials={initials(l.name)}
                imageUrl={l.imageUrl}
                size={i === 0 ? "xl" : "md"}
                hoverZoom
                className="mx-auto"
              />
              <h4 className={cn("font-display font-bold text-white", i === 0 ? "mt-6 text-xl" : "mt-4 text-sm")}>
                {l.name}
              </h4>
              <p className={cn("font-semibold text-saffron-400", i === 0 ? "text-sm" : "text-xs")}>{l.role}</p>
              {l.associationName && i < 2 && <p className="mt-1 text-xs text-white/50">{l.associationName}</p>}
            </GlassCard>
          );

          const backFace = (
            <GlassCard variant="dark" className="flex h-full flex-col items-center justify-center gap-2 text-center">
              <p className="text-xs font-semibold uppercase tracking-wide text-saffron-400">Contact</p>
              {l.email && (
                <a href={`mailto:${l.email}`} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white">
                  <Mail className="h-3.5 w-3.5" /> {l.email}
                </a>
              )}
              {l.phone && (
                <a href={`tel:${l.phone}`} className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white">
                  <Phone className="h-3.5 w-3.5" /> {l.phone}
                </a>
              )}
              {l.website && (
                <a
                  href={l.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white"
                >
                  <Globe className="h-3.5 w-3.5" /> {prettyUrl(l.website)}
                </a>
              )}
            </GlassCard>
          );

          return (
            <ScrollReveal key={l.id} direction="up" delay={i * 0.05} className={spanClass}>
              <TiltCard maxTilt={8} className="h-full">
                {hasContact ? (
                  <FlipCard
                    className="h-full"
                    front={
                      <button onClick={() => featureLeader(l.id)} className="block h-full w-full text-left">
                        {frontFace}
                      </button>
                    }
                    back={backFace}
                  />
                ) : (
                  <button onClick={() => featureLeader(l.id)} className="block h-full w-full text-left">
                    {frontFace}
                  </button>
                )}
              </TiltCard>
            </ScrollReveal>
          );
        })}
      </div>
    </div>
  );
}
