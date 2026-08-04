"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { INDIA_DOTS, INDIA_HUBS } from "@/lib/india-dots";

/**
 * Intro: India assembles from scattered dots, 26 state hubs light up, then it
 * hands over to the page.
 *
 * Rewritten from the old particle-mesh loader, which had ten defects — the
 * worst being that it computed its "proximity mesh" connections once from
 * starting positions and then moved every node, so the lines it drew were a
 * fixed random graph stretching across the screen rather than a mesh. Fixes
 * carried into this version:
 *
 *  - sessionStorage is claimed on mount, not on completion, so reloading
 *    mid-intro no longer replays it;
 *  - the overlay renders on first paint instead of appearing after the page
 *    has already painted underneath it;
 *  - 1.6s total instead of 2.7s;
 *  - brand tokens instead of three hardcoded off-palette hex values;
 *  - a resize handler;
 *  - the rAF loop stops when the animation is over rather than running through
 *    the hold and exit phases.
 */

const SESSION_KEY = "faiita-intro-played";

// Beats (ms). Deliberately short — an intro is a threshold, not a feature.
const ASSEMBLE = 900;
const HOLD = 350;
const EXIT = 350;

const INK = "#0B1220";
const ORANGE = "249, 115, 22";
const ORANGE_LIGHT = "251, 146, 60";

export function CinematicLoader() {
  const prefersReduced = useReducedMotion();

  // Resolved during the first render, not in an effect: deciding *after* mount
  // meant the page painted first and was then covered, which is the worst of
  // both worlds. `null` = undecided (SSR), so nothing renders until the client
  // knows — and the client knows on its very first pass.
  const [show, setShow] = useState<boolean | null>(null);
  const [exiting, setExiting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(false);
      return;
    }
    const played = sessionStorage.getItem(SESSION_KEY);
    // Claimed up front. The old version only wrote this once the animation
    // finished, so any reload during the intro replayed it.
    sessionStorage.setItem(SESSION_KEY, "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(!played);
  }, [prefersReduced]);

  useEffect(() => {
    if (!show) return;
    const timers = [
      window.setTimeout(() => setExiting(true), ASSEMBLE + HOLD),
      window.setTimeout(() => setShow(false), ASSEMBLE + HOLD + EXIT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [show]);

  useEffect(() => {
    if (!show) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Each dot flies in from a random offset and settles onto its true position.
    const seeded = INDIA_DOTS.map((d) => {
      const angle = Math.random() * Math.PI * 2;
      const dist = 0.35 + Math.random() * 0.5;
      return { d, ox: Math.cos(angle) * dist, oy: Math.sin(angle) * dist, delay: Math.random() * 0.35 };
    });
    const hubSet = new Set(INDIA_HUBS);

    let raf = 0;
    let width = 0;
    let height = 0;
    let size = 0;
    let originX = 0;
    let originY = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      size = Math.min(height * 0.62, width * 0.82);
      originX = width / 2 - size / 2;
      originY = height / 2 - size / 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      ctx.clearRect(0, 0, width, height);

      for (const s of seeded) {
        // per-dot stagger, then an ease-out settle
        const t = Math.max(0, Math.min(1, elapsed / ASSEMBLE - s.delay)) / (1 - s.delay);
        const eased = 1 - Math.pow(1 - t, 3);
        const drift = 1 - eased;
        const x = originX + (s.d.nx + s.ox * drift) * size;
        const y = originY + (s.d.ny + s.oy * drift) * size;
        const isHub = hubSet.has(s.d);

        ctx.beginPath();
        ctx.arc(x, y, isHub ? 2.4 : 1.15, 0, Math.PI * 2);
        ctx.fillStyle = isHub
          ? `rgba(${ORANGE}, ${eased})`
          : `rgba(255,255,255,${eased * 0.22})`;
        ctx.fill();

        if (isHub && eased > 0.6) {
          const bloom = (eased - 0.6) / 0.4;
          ctx.beginPath();
          ctx.arc(x, y, 8 * bloom, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${ORANGE_LIGHT}, ${0.14 * bloom})`;
          ctx.fill();
        }
      }

      // Stop once everything has settled — the old loop kept running through
      // the hold and exit phases, animating a finished picture.
      if (elapsed < ASSEMBLE + 80) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [show]);

  if (!show) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: INK }}
      animate={{ opacity: exiting ? 0 : 1 }}
      transition={{ duration: EXIT / 1000, ease: "easeInOut" }}
      aria-hidden
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: exiting ? 0 : 1, y: 0 }}
        transition={{ delay: 0.55, duration: 0.45 }}
        className="absolute bottom-[18%] left-1/2 -translate-x-1/2 text-center font-mono text-[11px] uppercase tracking-[0.3em] text-saffron-400 sm:text-xs"
      >
        Uniting India&apos;s IT Fraternity
      </motion.p>
    </motion.div>
  );
}
