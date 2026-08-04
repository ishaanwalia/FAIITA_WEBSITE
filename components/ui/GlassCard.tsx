"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

/**
 * The site's single card component.
 *
 * `TiltCard` and `FlipCard` are gone — 3D tilt applied to every card read as a
 * template, and the leadership flip hid contact details the spotlight panel
 * already shows larger. What replaces them is light: cards differ by *which*
 * glow they give off, not by how they move.
 *
 * Every shadow comes from the shared scale in tailwind.config (`card`,
 * `card-hover`, `glow`, `glow-green`), so no component hand-rolls its own.
 */

type Glow = "saffron" | "green" | "cool" | "none";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "dark" | "light";
  /** Which light the card gives off on hover. */
  glow?: Glow;
  /** Corner bloom. Turn off for dense grids, where 30 blooms at once is noise. */
  bloom?: boolean;
  /** Set false when a child needs to visually pop outside the card bounds (e.g. a hover-zoom avatar). */
  clip?: boolean;
};

const GLOW_RING: Record<Glow, string> = {
  saffron: "hover:border-saffron-400/50 hover:shadow-glow",
  green: "hover:border-federal-green/50 hover:shadow-glow-green",
  cool: "hover:border-navy-400/50 hover:shadow-card-hover",
  none: "hover:shadow-card-hover",
};

const GLOW_BLOOM: Record<Glow, string> = {
  saffron: "group-hover:bg-saffron-400/25",
  green: "group-hover:bg-federal-green/25",
  cool: "group-hover:bg-navy-300/25",
  none: "",
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    { className, variant = "light", glow = "saffron", bloom = true, clip = true, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative rounded-2xl p-6 transition-all duration-300",
          clip && "overflow-hidden",
          variant === "dark" ? "glass-dark text-white" : "glass-light text-navy-800",
          // Tight contact shadow plus a soft ambient one, so cards sit above
          // the page rather than lying flat on it.
          "shadow-card hover:-translate-y-1.5",
          GLOW_RING[glow],
          className
        )}
        {...props}
      >
        {bloom && glow !== "none" && (
          <div
            className={cn(
              "pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full blur-2xl transition-colors duration-500",
              GLOW_BLOOM[glow]
            )}
            aria-hidden
          />
        )}
        {children}
      </div>
    );
  }
);
GlassCard.displayName = "GlassCard";
