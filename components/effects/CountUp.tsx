"use client";

import { useEffect, useRef } from "react";
import { registerCanvasTask } from "@/lib/canvas-engine";

/**
 * A digit count from 0 up to `value`, suffix held static throughout.
 *
 * Same shape as GlyphDecode: the real, final number is what's in the SSR
 * markup (so it's what a no-JS or reduced-motion visitor sees), driven by
 * the shared canvas engine rather than its own rAF (scroll-arrival gating,
 * pausing on a hidden tab, and a reduced-motion path that just paints the
 * final value for free), and unregisters itself the moment it locks.
 */
export function CountUp({
  value,
  suffix = "",
  duration = 1.4,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const paint = () => {
      el.textContent = `${value}${suffix}`;
    };

    let t = 0;
    const unregister = registerCanvasTask(
      el,
      (dt) => {
        t += dt;
        if (t >= duration) {
          paint();
          unregister();
          return;
        }
        // easeOutQuint — fast start, long settle, so the final digits (the
        // ones actually worth reading) hold still for longer than they churn.
        const eased = 1 - Math.pow(1 - t / duration, 5);
        el.textContent = `${Math.round(value * eased)}${suffix}`;
      },
      { still: paint }
    );

    return () => {
      unregister();
      paint();
    };
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
