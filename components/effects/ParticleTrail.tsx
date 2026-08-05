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

// Palette-legal hues the sparks pick from, weighted toward the accent: orange
// is listed twice so roughly a third of the sparks are the brand colour and the
// trail still reads as orange, while the cool hues keep it from looking like a
// single-colour cursor artefact.
const HUES: [number, number, number][] = [
  [249, 115, 22], // saffron-500
  [249, 115, 22],
  [251, 146, 60], // saffron-400
  [253, 186, 116], // saffron-300
  [23, 166, 122], // federal green
  [139, 92, 246], // violet-500
  [45, 212, 191], // teal-400
];

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  r: number;
  hue: [number, number, number];
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
    const pointer = { x: 0, y: 0, px: 0, py: 0, on: false };

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

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      if (!pointer.on) {
        pointer.px = pointer.x;
        pointer.py = pointer.y;
      }
      pointer.on = true;
    };
    const onLeave = () => (pointer.on = false);
    host.addEventListener("pointermove", onMove as EventListener);
    host.addEventListener("pointerleave", onLeave);

    const stop = registerCanvasTask(canvas, (dt) => {
      // emit along the segment travelled since the last frame, so fast
      // movement leaves a continuous ribbon rather than dotted clumps
      const speed = Math.hypot(pointer.x - pointer.px, pointer.y - pointer.py);
      if (pointer.on && speed > 1.5) {
        const n = Math.min(5, Math.round(speed / 8) + 1);
        for (let i = 0; i < n; i++) {
          const t = i / n;
          sparks.push({
            x: pointer.px + (pointer.x - pointer.px) * t,
            y: pointer.py + (pointer.y - pointer.py) * t,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() - 0.5) * 30 - 10,
            life: 0,
            max: 0.5 + Math.random() * 0.7,
            r: Math.random() * 1.6 + 0.7,
            hue: HUES[(Math.random() * HUES.length) | 0],
          });
        }
      }
      pointer.px = pointer.x;
      pointer.py = pointer.y;

      ctx.clearRect(0, 0, w, h);
      sparks = sparks.filter((s) => {
        s.life += dt;
        if (s.life >= s.max) return false;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
        s.vx *= 0.94;
        s.vy *= 0.94;
        const a = (1 - s.life / s.max) ** 1.5;
        const [r, g, b] = s.hue;
        const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 5);
        grad.addColorStop(0, `rgba(${r},${g},${b},${a * 0.9})`);
        grad.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
        return true;
      });
      // hard cap so a long fast drag can't grow the array without bound
      if (sparks.length > 400) sparks.splice(0, sparks.length - 400);
    });

    return () => {
      stop();
      window.removeEventListener("resize", resize);
      host.removeEventListener("pointermove", onMove as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden />;
}
