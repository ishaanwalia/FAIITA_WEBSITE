"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { PhotoAvatar } from "@/components/common/PhotoAvatar";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { TestimonialItem } from "@/types";

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + count) % count);
  };

  useEffect(() => {
    if (paused || count <= 1) return;
    timerRef.current = setInterval(() => go(1), 5000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused, count]);

  if (count === 0) return null;
  const t = testimonials[index];

  return (
    <section className="overflow-hidden bg-secondary/60 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Leaders Say"
          description="Voices from the state associations that make up the federation — swipe or drag to browse."
          align="center"
          className="mx-auto"
        />

        <div
          className="relative mx-auto mt-14 max-w-2xl"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="relative h-[280px] sm:h-[240px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={t.id}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) go(1);
                  else if (info.offset.x > 60) go(-1);
                }}
                className="absolute inset-0 cursor-grab active:cursor-grabbing"
              >
                <GlassCard variant="light" className="flex h-full flex-col gap-4">
                  <Quote className="h-7 w-7 text-saffron-500/60" />
                  <blockquote className="flex-1 text-sm leading-relaxed text-navy-800/90">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 border-t border-navy-700/10 pt-4">
                    <PhotoAvatar initials={initials(t.name)} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-navy-800">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                      <p className="text-xs text-saffron-700">{t.association}</p>
                    </div>
                  </figcaption>
                </GlassCard>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={() => go(-1)}
            aria-label="Previous testimonial"
            className="absolute -left-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-secondary sm:-left-12"
          >
            <ChevronLeft className="h-4 w-4 text-navy-700" />
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next testimonial"
            className="absolute -right-4 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card shadow-sm hover:bg-secondary sm:-right-12"
          >
            <ChevronRight className="h-4 w-4 text-navy-700" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                aria-label={`Go to testimonial ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-6 bg-saffron-500" : "w-1.5 bg-navy-700/20"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
