"use client";


import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import gsap from "gsap";
import * as Icons from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StatItem } from "@/types";

function KineticCount({ value }: { value: number }) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });
  const started = useRef(false);

  useEffect(() => {
    if (!inView || started.current || !spanRef.current) return;
    started.current = true;

    const counter = { val: 0 };
    gsap.to(counter, {
      val: value,
      duration: 1.8,
      ease: "elastic.out(1, 0.55)", // kinetic overshoot-then-settle
      onUpdate: () => {
        if (spanRef.current) spanRef.current.textContent = Math.round(counter.val).toString();
      },
    });
  }, [inView, value]);

  return <span ref={(el) => { spanRef.current = el; ref(el); }}>0</span>;
}

export function Stats({ stats }: { stats: StatItem[] }) {
  return (
    <section className="bg-navy-800 py-20">
      <div className="container-page">
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
              <GlassCard key={stat.id} variant="dark" className="text-center">
                <Icon className="mx-auto h-6 w-6 text-saffron-400" />
                <div className="stat-figure mt-4 text-3xl font-bold text-white sm:text-4xl">
                  <KineticCount value={numeric} />
                  {stat.suffix}
                </div>
                <p className="mt-2 text-xs font-medium uppercase tracking-wide text-white/50">{stat.label}</p>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
