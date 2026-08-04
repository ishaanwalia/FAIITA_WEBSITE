"use client";

import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { animate, useReducedMotion } from "framer-motion";
import * as Icons from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { ParticleTrail } from "@/components/effects/ParticleTrail";
import type { StatItem } from "@/types";

// Renders the real value immediately (SSR baseline for no-JS visitors and
// screen readers), then — only once scrolled into view, and only if the
// visitor hasn't asked for reduced motion — dips to 0 and counts back up as
// a decorative flourish. Reduced-motion visitors just keep seeing the real
// number the whole time.
function KineticCount({ value }: { value: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const started = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!inView || started.current || !spanRef.current || prefersReduced) return;
    started.current = true;

    const node = spanRef.current;
    const controls = animate(0, value, {
      duration: 1.8,
      type: "spring",
      bounce: 0.35, // kinetic overshoot-then-settle
      onUpdate: (v) => {
        node.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [inView, value, prefersReduced]);

  return (
    <span ref={(el) => { spanRef.current = el; ref(el); }}>
      {value}
    </span>
  );
}

export function Stats({ stats }: { stats: StatItem[] }) {
  if (stats.length === 0) return null;

  return (
    <section className="relative overflow-hidden bg-navy-800 py-20">
      <div aria-hidden className="animated-gradient absolute inset-0" />
      <div aria-hidden className="grain absolute inset-0" />
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
            const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[stat.icon ?? "Sparkles"] ?? Icons.Sparkles;
            const numeric = parseInt(stat.value.replace(/[^0-9]/g, ""), 10) || 0;
            return (
              <div key={stat.id} className="group relative h-full">
                <GlassCard
                  variant="dark"
                  glow="green"
                  className="flex h-full flex-col items-center justify-center text-center shadow-elevated ring-1 ring-white/5"
                >
                  <Icon className="h-6 w-6 text-saffron-400" />
                  <div className="stat-figure mt-4 text-3xl font-bold text-white sm:text-4xl">
                    <KineticCount value={numeric} />
                    {stat.suffix}
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
