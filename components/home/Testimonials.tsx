import { Quote } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import type { TestimonialItem } from "@/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("");
}

function TestimonialCard({ t }: { t: TestimonialItem }) {
  return (
    <TiltCard maxTilt={5} className="w-[380px] shrink-0">
      <GlassCard variant="light" className="flex h-full flex-col gap-5">
        <Quote className="h-7 w-7 text-saffron-500/60" />
        <blockquote className="text-sm leading-relaxed text-navy-800/90">&ldquo;{t.quote}&rdquo;</blockquote>
        <figcaption className="mt-auto flex items-center gap-3 border-t border-navy-700/10 pt-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy-700 text-sm font-semibold text-white">
            {initials(t.name)}
          </span>
          <div>
            <p className="text-sm font-semibold text-navy-800">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.role}</p>
            <p className="text-xs text-saffron-600">{t.association}</p>
          </div>
        </figcaption>
      </GlassCard>
    </TiltCard>
  );
}

export function Testimonials({ testimonials }: { testimonials: TestimonialItem[] }) {
  const loop = [...testimonials, ...testimonials];

  return (
    <section className="overflow-hidden bg-secondary/60 py-24">
      <div className="container-page">
        <SectionHeading
          eyebrow="Testimonials"
          title="What Our Leaders Say"
          description="Voices from the state associations that make up the federation."
          align="center"
          className="mx-auto"
        />
      </div>

      <div className="group relative mt-14">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-secondary/60 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-secondary/60 to-transparent" />
        <div className="flex w-max gap-6 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((t, i) => (
            <TestimonialCard key={`${t.id}-${i}`} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
