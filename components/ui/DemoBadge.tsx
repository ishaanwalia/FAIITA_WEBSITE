import { cn } from "@/lib/utils";

/**
 * Marks placeholder/sample content (rows seeded with isDemo: true) so visitors
 * and editors can tell it apart from real federation content. Remove the demo
 * rows from prisma/seed.ts as real resources replace them.
 */
export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-dashed border-amber-500/60 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-600",
        className
      )}
    >
      Demo
    </span>
  );
}
