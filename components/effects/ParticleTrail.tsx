"use client";

import { useEffect, useRef } from "react";
import { pointerDriven, registerCanvasTask } from "@/lib/canvas-engine";

/**
 * Sparks that trail the cursor across a section.
 *
 * Multi-hue on purpose: a single-colour trail reads as a cursor artefact,
 * whereas sparks drifting between orange, amber and federal green read as
 * something the section is *doing*. All three hues are in the palette.
 *
 * Runs on the shared canvas engine, so it stops dead when the section scrolls
 * out of view and never mounts at all on touch or reduced-motion.
 */

// Three hues, as in the original: one accent, one violet, one cool neutral.
// More than three and the trail stops reading as one thing.
const COLORS = ["#F97316", "#8B5CF6", "#2DD4BF"];

/** Particles emitted per pointermove event. */
const PER_MOVE = 3;
/** Life lost per second — the original burned 0.02 per frame at 60fps. */
const DECAY = 1.2;
/** Peak drift speed in px/s (the original's ±1.5px per frame). */
const DRIFT = 90;

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  /** 1 → 0. Drives both alpha and radius, so a spark shrinks as it fades. */
  life: number;
  r: number;
  c: string;
};

export function ParticleTrail({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !pointerDriven()) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const host = canvas.parentElement ?? canvas;
    let sparks: Spark[] = [];
    let w = 0;
    let h = 0;

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

    // Emitted per pointermove rather than interpolated per frame: the segment
    // interpolation this replaced produced a continuous ribbon, which is what
    // made the trail read as a smear instead of a scatter of sparks.
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      for (let i = 0; i < PER_MOVE; i++) {
        sparks.push({
          x,
          y,
          vx: (Math.random() - 0.5) * DRIFT,
          vy: (Math.random() - 0.5) * DRIFT,
          life: 1,
          r: Math.random() * 3 + 1,
          c: COLORS[(Math.random() * COLORS.length) | 0],
        });
      }
      // Hard cap so a long fast drag can't grow the array without bound.
      if (sparks.length > 400) sparks.splice(0, sparks.length - 400);
    };
    host.addEventListener("pointermove", onMove as EventListener);

    const stop = registerCanvasTask(canvas, (dt) => {
      ctx.clearRect(0, 0, w, h);
      sparks = sparks.filter((s) => {
        s.life -= DECAY * dt;
        if (s.life <= 0) return false;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        // Flat fill, not a radial gradient: a gradient the size of the dot is
        // just a blur, and the sparks stop looking like sparks.
        ctx.globalAlpha = s.life;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
        ctx.fillStyle = s.c;
        ctx.fill();
        return true;
      });
      ctx.globalAlpha = 1;
    });

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove as EventListener);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
