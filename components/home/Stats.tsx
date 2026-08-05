"use client";

import {
  Briefcase,
  Building2,
  CalendarClock,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { GradientMesh } from "@/components/common/GradientMesh";
import { ParticleTrail } from "@/components/effects/ParticleTrail";
import { GlyphDecode } from "@/components/effects/GlyphDecode";
import type { StatItem } from "@/types";

/**
 * The icons a stat row is allowed to name.
 *
 * This was `import * as Icons` with a lookup by string, which pulled lucide's
 * entire ~1,750-icon barrel into the bundle — a 550 KB chunk on **every page
 * of the site**, for six icons on one band. No tree-shaking and no
 * modularizeImports transform can see past a namespace import; only naming
 * them fixes it.
 *
 * Adding a stat with a new icon means adding it here, which is the point: the
 * set is small, deliberate, and visible.
 */
const ICONS: Record<string, LucideIcon> = {
  MapPinned,
  Building2,
  Users,
  Briefcase,
  CalendarClock,
  ShieldCheck,
  Sparkles,
};

export function Stats({ stats }: { stats: StatItem[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-800 py-20">
      <div aria-hidden className="animated-gradient absolute inset-0" />
      {/* The wash alone barely registers on this band: it's a short, wide strip,
          so the radial centres in .animated-gradient sit mostly outside the box
          and only their faintest edges land inside. The mesh puts actual
          blurred orbs in frame, which is what makes the violet and teal read
          here rather than measuring correctly and looking orange. */}
      <GradientMesh variant="zenith" />
      <div aria-hidden className="grain absolute inset-0 opacity-20" />
      {/* Particle trail lives here rather than in the hero: this is the most
          static band on the page, so it's the one that gains most from
          rewarding cursor movement. */}
      <ParticleTrail className="pointer-events-none absolute inset-0 h-full w-full" />
      <div className="container-page relative">
        <SectionHeading
          eyebrow="Our Impact"
          title="FAIITA by the Numbers"
          description="A growing federation with real, measurable reach across India's IT trade ecosystem."
          align="center"
          light
          className="mx-auto"
        />

        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => {
            const Icon = ICONS[stat.icon ?? ""] ?? Sparkles;
            const figure = `${parseInt(stat.value.replace(/[^0-9]/g, ""), 10) || 0}${stat.suffix ?? ""}`;
            return (
              <div key={stat.id} className="group relative h-full">
                <GlassCard
                  variant="dark"
                  glow="green"
                  className="flex h-full flex-col items-center justify-center text-center shadow-elevated ring-1 ring-white/5"
                >
                  <Icon className="h-6 w-6 text-saffron-400" />
                  <div className="stat-figure mt-4 text-3xl font-bold text-white sm:text-4xl">
                    <GlyphDecode text={figure} stagger={0.07} />
                  </div>
                  <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/50">{stat.label}</p>
                </GlassCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
