"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type GlassCardProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "dark" | "light";
  glowCorner?: boolean;
};

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "light", glowCorner = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "group relative overflow-hidden rounded-2xl p-6 transition-all duration-300",
          variant === "dark" ? "glass-dark text-white" : "glass-light text-navy-800",
          "hover:-translate-y-1 hover:shadow-xl",
          variant === "dark" ? "hover:shadow-saffron-500/10" : "hover:shadow-navy-700/10",
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
