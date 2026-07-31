"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

const SESSION_KEY = "faiita-intro-played";
type Phase = "converge" | "logo" | "hold" | "exit";

// Beat durations (ms) — mirrors the original GSAP timeline's five phases,
// including the -0.4s / -0.3s overlaps between converge→logo and logo→hold.
const CONVERGE = 900;
const LOGO = 800;
const HOLD = 400;
const EXIT = 600;
const OVERLAP = 400;

export function CinematicLoader() {
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<Phase>("converge");
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return; // never replay after first load this session
    if (prefersReduced) return; // skip entirely for reduced-motion users
    // sessionStorage isn't available during SSR, so this can only be
    // resolved post-mount — one of the few legitimate exceptions to the
    // "no setState in effect" rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, [prefersReduced]);

  useEffect(() => {
    if (!mounted) return;
    const timers = [
      setTimeout(() => setPhase("logo"), CONVERGE - OVERLAP),
      setTimeout(() => setPhase("hold"), CONVERGE + LOGO - OVERLAP),
      setTimeout(() => setPhase("exit"), CONVERGE + LOGO + HOLD - OVERLAP),
      setTimeout(() => {
        sessionStorage.setItem(SESSION_KEY, "1");
        setMounted(false);
      }, CONVERGE + LOGO + HOLD + EXIT),
    ];
    return () => timers.forEach(clearTimeout);
  }, [mounted]);

  // Particle field — plain canvas + requestAnimationFrame. Only the
  // converge easing needs a progress ramp, which a three-line cubic
  // ease-out covers without pulling in a tween engine.
  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const nodeCount = 80;
    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    }));
    const connections: [number, number][] = [];
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        if (Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < 200) {
          connections.push([i, j]);
        }
      }
    }

    const start = performance.now();
    let animationId: number;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / CONVERGE);
      const eased = 1 - Math.pow(1 - t, 3);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255, 153, 51, 0.15)";
      ctx.lineWidth = 1;
      connections.forEach(([i, j]) => {
        ctx.beginPath();
        ctx.moveTo(nodes[i].x, nodes[i].y);
        ctx.lineTo(nodes[j].x, nodes[j].y);
        ctx.stroke();
      });

      nodes.forEach((node) => {
        node.x += node.vx * (1 - eased) + (centerX - node.x) * 0.02 * eased;
        node.y += node.vy * (1 - eased) + (centerY - node.y) * 0.02 * eased;
        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255, 153, 51, 0.6)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(tick);
    };
    animationId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animationId);
  }, [mounted]);

  if (!mounted) return null;

  const logoVisible = phase === "logo" || phase === "hold";

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#0A2540]"
      animate={{ opacity: phase === "exit" ? 0 : 1 }}
      transition={{ duration: 0.5, delay: phase === "exit" ? 0.15 : 0, ease: "easeInOut" }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <motion.div
        className="relative flex flex-col items-center"
        animate={
          logoVisible
            ? { opacity: 1, scale: 1 }
            : phase === "exit"
              ? { opacity: 0, scale: 0.8 }
              : { opacity: 0, scale: 0.9 }
        }
        transition={{
          duration: phase === "exit" ? 0.6 : 0.8,
          ease: phase === "exit" ? "easeIn" : [0.34, 1.56, 0.64, 1],
        }}
      >
        <div className="text-center">
          <div className="text-5xl font-bold tracking-tight text-white md:text-7xl">
            <span className="text-[#FF9933]">FAIITA</span>
          </div>
          <div className="mt-3 text-xs font-light uppercase tracking-[0.2em] text-white/40 md:text-sm">
            Federation of All India
          </div>
          <div className="text-xs font-light uppercase tracking-[0.2em] text-white/40 md:text-sm">
            Information Technology Associations
          </div>
        </div>
        <motion.p
          className="mt-6 text-sm tracking-wider text-white/30"
          animate={logoVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.5 }}
        >
          Uniting India&apos;s IT Fraternity
        </motion.p>
      </motion.div>
    </motion.div>
  );
}
