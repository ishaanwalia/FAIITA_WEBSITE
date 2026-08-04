"use client";

import { useEffect, useRef } from "react";
import { pointerDriven, registerCanvasTask } from "@/lib/canvas-engine";

/**
 * A cursor-shaped magnetic field over a grid: items lean toward the pointer
 * and spring back when it leaves.
 *
 * DOM transforms rather than canvas, because the things being moved are real
 * cards and logos, not pixels. Positions are measured once per resize — reading
 * getBoundingClientRect for every child on every frame would force a layout
 * recalculation 60 times a second, which is exactly how these effects earn
 * their bad reputation on mid-range phones.
 *
 * Still driven by the shared engine so it pauses off-screen, and it never
 * mounts on touch or under reduced-motion.
 */

export function MagneticField({
  children,
  radius = 220,
  strength = 16,
  selector = ":scope > *",
  className,
}: {
  children: React.ReactNode;
  /** Influence radius in px. */
  radius?: number;
  /** Peak displacement in px at the centre of the field. */
  strength?: number;
  /** Which descendants move. Defaults to direct children. */
  selector?: string;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !pointerDriven()) return;

    type Item = { el: HTMLElement; cx: number; cy: number; x: number; y: number };
    let items: Item[] = [];
    const pointer = { x: 0, y: 0, on: false };

    const measure = () => {
      const hostRect = host.getBoundingClientRect();
      items = [...host.querySelectorAll<HTMLElement>(selector)].map((el) => {
        const r = el.getBoundingClientRect();
        return {
          el,
          cx: r.left - hostRect.left + r.width / 2,
          cy: r.top - hostRect.top + r.height / 2,
          x: 0,
          y: 0,
        };
      });
    };
    measure();
    window.addEventListener("resize", measure);

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => (pointer.on = false);
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const stop = registerCanvasTask(host, (dt) => {
      // critically-damped-ish spring toward the target offset
      const k = Math.min(1, dt * 9);
      for (const it of items) {
        let tx = 0;
        let ty = 0;
        if (pointer.on) {
          const dx = pointer.x - it.cx;
          const dy = pointer.y - it.cy;
          const dist = Math.hypot(dx, dy);
          if (dist < radius && dist > 0.01) {
            const falloff = (1 - dist / radius) ** 2;
            tx = (dx / dist) * falloff * strength;
            ty = (dy / dist) * falloff * strength;
          }
        }
        it.x += (tx - it.x) * k;
        it.y += (ty - it.y) * k;
        it.el.style.transform =
          Math.abs(it.x) < 0.05 && Math.abs(it.y) < 0.05
            ? ""
            : `translate3d(${it.x.toFixed(2)}px, ${it.y.toFixed(2)}px, 0)`;
      }
    });

    return () => {
      stop();
      window.removeEventListener("resize", measure);
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
      items.forEach((it) => (it.el.style.transform = ""));
    };
  }, [radius, strength, selector]);

  return (
    <div ref={hostRef} className={className}>
      {children}
    </div>
  );
}
