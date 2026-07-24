import { MapPin } from "lucide-react";

export function StateMarquee({ states }: { states: string[] }) {
  const loop = [...states, ...states];

  return (
    <section className="overflow-hidden border-y border-white/10 bg-navy-900 py-6">
      <div className="group relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-navy-900 to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-navy-900 to-transparent sm:w-32" />
        <div className="flex w-max items-center gap-10 animate-marquee group-hover:[animation-play-state:paused]">
          {loop.map((name, i) => (
            <span key={`${name}-${i}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white/60">
              <MapPin className="h-3.5 w-3.5 text-saffron-500/60" />
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
