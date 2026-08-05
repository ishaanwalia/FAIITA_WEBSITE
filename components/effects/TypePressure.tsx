"use client";

import { useEffect, useRef } from "react";
import { pointerDriven } from "@/lib/canvas-engine";

/**
 * A headline that thickens under the cursor — letters near the pointer take
 * the heavier weight and swell slightly, and relax as it moves away.
 *
 * Two things worth knowing before extending this:
 *
 * 1. The site loads Geist as four *static* weights (see app/layout.tsx), not
 *    the variable font, so `font-variation-settings: "wght"` does nothing
 *    here — only the 500/600/700/800 steps exist. The continuous part of the
 *    pressure is carried by `scale`, which is free on the compositor; the
 *    weight steps ride on top. Switching Geist to variable would let this
 *    interpolate properly, but that is a site-wide font change and this is a
 *    404 page.
 * 2. No rAF loop: a CSS transition does the smoothing, so the pointermove
 *    handler only writes the target and the compositor animates toward it.
 */

const WEIGHTS = [500, 600, 700, 800];
const RADIUS = 220;

export function TypePressure({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerDriven()) return;

    const letters = [...el.querySelectorAll<HTMLElement>("[data-pressure]")];
    let centres: { el: HTMLElement; x: number; y: number }[] = [];

    // Measured per resize, not per pointermove — otherwise every mouse move
    // forces a layout of the whole headline.
    const measure = () => {
      centres = letters.map((node) => {
        const r = node.getBoundingClientRect();
        return { el: node, x: r.left + r.width / 2, y: r.top + r.height / 2 };
      });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, { passive: true });

    const onMove = (e: PointerEvent) => {
      for (const c of centres) {
        const p = Math.max(0, 1 - Math.hypot(e.clientX - c.x, e.clientY - c.y) / RADIUS) ** 2;
        c.el.style.fontWeight = String(WEIGHTS[Math.min(WEIGHTS.length - 1, Math.round(p * WEIGHTS.length))]);
        c.el.style.transform = `scale(${(1 + p * 0.18).toFixed(3)})`;
      }
    };
    window.addEventListener("pointermove", onMove);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure);
      for (const c of centres) {
        c.el.style.fontWeight = "";
        c.el.style.transform = "";
      }
    };
  }, [text]);

  return (
    <h1 ref={ref} className={className}>
      {[...text].map((char, i) =>
        char === " " ? (
          " "
        ) : (
          <span
            // Order is stable — the string never reorders — so the index is a
            // legitimate key here.
            key={i}
            data-pressure
            className="inline-block origin-bottom transition-[transform,font-weight] duration-300 ease-out motion-reduce:transition-none"
          >
            {char}
          </span>
        )
      )}
    </h1>
  );
}
