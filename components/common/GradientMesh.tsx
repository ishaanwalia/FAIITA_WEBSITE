import { cn } from "@/lib/utils";

export type MeshVariant = "aurora" | "dawn" | "tide" | "ember" | "meadow" | "zenith";

export const MESH_VARIANTS: MeshVariant[] = ["aurora", "dawn", "tide", "ember", "meadow", "zenith"];

/**
 * Each variant spreads the glow differently so no two page heroes feel
 * identical: "dawn" rises from the horizon, "tide" swells in from the sides,
 * "ember" smoulders in a corner, "meadow" leads with green, "zenith" beams
 * down from above. "aurora" is the original balanced spread.
 */
const ORBS: Record<MeshVariant, { className: string; delay?: string }[]> = {
  aurora: [
    { className: "-left-24 -top-24 h-96 w-96 bg-saffron-500/20 blur-[100px]" },
    { className: "-right-24 top-1/3 h-80 w-80 bg-navy-500/30 blur-[100px]", delay: "1.5s" },
    { className: "bottom-0 left-1/3 h-72 w-72 bg-federal-green/15 blur-[100px]", delay: "3s" },
  ],
  dawn: [
    { className: "-bottom-32 left-1/4 h-[28rem] w-[28rem] bg-saffron-500/25 blur-[110px]" },
    { className: "-right-20 -top-20 h-72 w-72 bg-electric/10 blur-[100px]", delay: "2s" },
    { className: "-left-16 top-1/4 h-64 w-64 bg-violet-500/20 blur-[90px]", delay: "3.5s" },
  ],
  tide: [
    { className: "-left-32 top-1/4 h-96 w-96 bg-teal-400/15 blur-[100px]" },
    { className: "-right-32 top-1/2 h-96 w-96 bg-violet-600/25 blur-[100px]", delay: "1.5s" },
    { className: "-top-24 left-1/2 h-64 w-64 bg-saffron-500/15 blur-[90px]", delay: "3s" },
  ],
  ember: [
    { className: "-bottom-24 -right-24 h-96 w-96 bg-saffron-500/25 blur-[100px]" },
    { className: "-top-20 left-[15%] h-72 w-72 bg-electric/[0.08] blur-[90px]", delay: "2s" },
    { className: "left-1/2 top-1/2 h-80 w-80 bg-violet-600/20 blur-[110px]", delay: "3.5s" },
  ],
  meadow: [
    { className: "-right-24 -top-24 h-96 w-96 bg-teal-500/20 blur-[100px]" },
    { className: "-left-24 bottom-0 h-80 w-80 bg-saffron-500/15 blur-[100px]", delay: "1.5s" },
    { className: "-bottom-16 right-1/3 h-72 w-72 bg-violet-500/20 blur-[90px]", delay: "3s" },
  ],
  zenith: [
    { className: "-top-40 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 bg-violet-500/[0.18] blur-[120px]" },
    { className: "-bottom-12 -left-24 h-72 w-72 bg-saffron-500/15 blur-[100px]", delay: "2s" },
    { className: "-bottom-12 -right-24 h-72 w-72 bg-teal-400/[0.12] blur-[100px]", delay: "3.5s" },
  ],
};

export function GradientMesh({
  className,
  variant = "aurora",
}: {
  className?: string;
  variant?: MeshVariant;
}) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {ORBS[variant].map((orb, i) => (
        <div
          key={i}
          className={cn("absolute animate-float-slow rounded-full", orb.className)}
          style={orb.delay ? { animationDelay: orb.delay } : undefined}
        />
      ))}
    </div>
  );
}
