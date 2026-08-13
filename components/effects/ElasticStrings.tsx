"use client";

import { useEffect, useRef } from "react";
import { pointerDriven, registerCanvasTask } from "@/lib/canvas-engine";

/**
 * A pluckable divider: horizontal strings that the cursor drags out of true
 * and that snap back with a decaying wobble.
 *
 * Used between homepage bands. A plain 1px rule does the same structural job,
 * so this is the rare case where an effect and its content are the same thing —
 * nothing is hidden behind it and nothing is lost if it never runs.
 *
 * Each string is a quadratic curve with a single control point, so the physics
 * is one spring per string rather than a per-vertex simulation.
 */

type Tone = "light" | "dark";

const STROKE: Record<Tone, string> = {
  light: "rgba(11, 18, 32, 0.14)",
  dark: "rgba(255, 255, 255, 0.14)",
};
const ACCENT = "249, 115, 22";

export function ElasticStrings({
  strings = 3,
  tone = "light",
  className,
  onStringClick,
}: {
  strings?: number;
  tone?: Tone;
  className?: string;
  /** Fires on click (not hover) with the clicked string's position, 1 = topmost. */
  onStringClick?: (position: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mirrored in a ref rather than the effect below depending on it directly:
  // an inline callback from the caller gets a new identity every render, and
  // this effect owns the spring state — restarting it on every parent render
  // would reset every string's physics mid-wobble.
  const onStringClickRef = useRef(onStringClick);
  useEffect(() => {
    onStringClickRef.current = onStringClick;
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0;
    let h = 0;
    // one spring per string: offset, velocity, and where along x it's held
    const state = Array.from({ length: strings }, () => ({ y: 0, v: 0, grabX: 0.5 }));
    const pointer = { x: 0, y: 0, on: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const gap = h / (strings + 1);
      state.forEach((s, i) => {
        const baseY = gap * (i + 1);
        const cx = w * s.grabX;
        const cy = baseY + s.y * 2; // control point pulls twice the visual sag
        ctx.beginPath();
        ctx.moveTo(0, baseY);
        ctx.quadraticCurveTo(cx, cy, w, baseY);
        const pull = Math.min(1, Math.abs(s.y) / 14);
        ctx.strokeStyle =
          pull > 0.02 ? `rgba(${ACCENT}, ${0.14 + pull * 0.5})` : STROKE[tone];
        ctx.lineWidth = 1;
        ctx.stroke();
      });
    };

    if (!pointerDriven()) {
      // Static rules — same structure, no physics. The redraw handler has to
      // be a named reference: registering an inline closure and then removing
      // `resize` leaks a listener on every remount.
      const redraw = () => {
        resize();
        draw();
      };
      redraw();
      window.addEventListener("resize", redraw);
      return () => {
        window.removeEventListener("resize", resize);
        window.removeEventListener("resize", redraw);
      };
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.on = true;
    };
    const onLeave = () => (pointer.on = false);
    canvas.addEventListener("pointermove", onMove as EventListener);
    canvas.addEventListener("pointerleave", onLeave);

    const onClick = (e: MouseEvent) => {
      if (!onStringClickRef.current) return;
      const r = canvas.getBoundingClientRect();
      const y = e.clientY - r.top;
      const gap = h / (strings + 1);
      let closest = 0;
      let closestDist = Infinity;
      for (let i = 0; i < strings; i++) {
        const dist = Math.abs(y - gap * (i + 1));
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      }
      if (closestDist < gap * 0.9) onStringClickRef.current(closest + 1);
    };
    canvas.addEventListener("click", onClick);

    const stop = registerCanvasTask(canvas, (dt) => {
      const gap = h / (strings + 1);
      state.forEach((s, i) => {
        const baseY = gap * (i + 1);
        let target = 0;
        if (pointer.on) {
          const dy = pointer.y - baseY;
          // only the string the cursor is near gets caught
          if (Math.abs(dy) < gap * 0.9) {
            target = dy * 0.55;
            s.grabX = Math.max(0.08, Math.min(0.92, pointer.x / w));
          }
        }
        // spring toward target, damped — releases into a decaying wobble
        s.v += (target - s.y) * 26 * dt;
        s.v *= 0.86;
        s.y += s.v * dt * 10;
      });
      draw();
    });

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointermove", onMove as EventListener);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("click", onClick);
    };
  }, [strings, tone]);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
