"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "dark" | "light";
  glowCorner?: boolean;
  /** Set false when a child needs to visually pop outside the card bounds (e.g. a hover-zoom avatar). */
  clip?: boolean;
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "light", glowCorner = true, clip = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group holo-ring relative rounded-2xl p-6 transition-all duration-300",
          clip && "overflow-hidden",
          variant === "dark" ? "glass-dark text-white" : "glass-light text-navy-800",
          // Dimensional/soft-UI shadow: a tight contact shadow plus a larger
          // soft ambient one, giving cards a sense of physically sitting
          // above the page rather than being flat.
          "shadow-[0_2px_8px_rgba(11,42,74,0.06),0_16px_40px_-12px_rgba(11,42,74,0.18)]",
          "hover:-translate-y-1.5 hover:shadow-[0_4px_12px_rgba(11,42,74,0.08),0_28px_60px_-14px_rgba(11,42,74,0.28)]",
          variant === "dark" && "hover:shadow-saffron-500/10",
          "hover:border-saffron-400/40",
          className
        )}
        {...props}
      >
        {glowCorner && (
          <div
            className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-saffron-400/0 blur-2xl transition-colors duration-500 group-hover:bg-saffron-400/20"
            aria-hidden
          />
        )}
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
