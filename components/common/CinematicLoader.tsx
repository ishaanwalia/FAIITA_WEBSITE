"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "faiita-intro-played";

// Fixed (not random-per-render) node positions so SSR/CSR markup matches.
const NODES = [
  [12, 18], [28, 8], [46, 14], [66, 9], [84, 20], [92, 40], [80, 58],
  [88, 76], [70, 88], [50, 92], [30, 86], [14, 70], [8, 48], [22, 34],
  [60, 30], [38, 60],
].map(([x, y]) => ({ x, y }));

const CENTER = { x: 50, y: 48 };

// A hexagonal "federation" emblem — six states converging into one shape.
const EMBLEM_POINTS = "50,30 66,39 66,57 50,66 34,57 34,39";

export function CinematicLoader() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const emblemRef = useRef<SVGPolygonElement>(null);
  const nodesRef = useRef<(SVGCircleElement | null)[]>([]);
  const linesRef = useRef<(SVGLineElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setMounted(true);
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(prefersReduced);
  }, []);

  useEffect(() => {
    if (!mounted || !rootRef.current) return;

    const finish = () => {
      sessionStorage.setItem(SESSION_KEY, "1");
      gsap.to(rootRef.current, {
        opacity: 0,
        scale: 1,
        duration: 0.6,
        ease: "power2.inOut",
        onComplete: () => setMounted(false),
      });
    };

    if (reduced) {
      gsap.set(rootRef.current, { scale: 1.1 });
      gsap.to([emblemRef.current, wordmarkRef.current, taglineRef.current], {
        opacity: 1,
        duration: 0.4,
      });
      const t = setTimeout(finish, 700);
      return () => clearTimeout(t);
    }

    gsap.set(rootRef.current, { scale: 1.1 });
    const nodes = nodesRef.current.filter(Boolean) as SVGCircleElement[];
    const lines = linesRef.current.filter(Boolean) as SVGLineElement[];

    const tl = gsap.timeline({
      onComplete: () => {
        // Enforce the 2.5s-minimum feel regardless of timeline length.
        const elapsed = tl.totalDuration() * 1000;
        setTimeout(finish, Math.max(0, 2500 - elapsed));
      },
    });

    tl.to(rootRef.current, { scale: 1, duration: 0.01 })
      .fromTo(
        nodes,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.35, stagger: 0.04, ease: "back.out(2)" }
      )
      .fromTo(
        lines,
        { strokeDashoffset: 40, opacity: 0 },
        { strokeDashoffset: 0, opacity: 0.5, duration: 0.4, stagger: 0.02, ease: "power2.out" },
        "-=0.15"
      )
      .to(
        nodes,
        {
          attr: { cx: CENTER.x, cy: CENTER.y },
          duration: 0.7,
          stagger: 0.015,
          ease: "power3.inOut",
        },
        "+=0.1"
      )
      .to(lines, { opacity: 0, duration: 0.2 }, "<")
      .fromTo(
        emblemRef.current,
        { strokeDashoffset: 200, opacity: 0 },
        { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
        "-=0.4"
      )
      .to(nodes, { opacity: 0, duration: 0.3 }, "-=0.2")
      .fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
        "-=0.2"
      )
      .fromTo(
        taglineRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.25"
      );

    return () => {
      tl.kill();
    };
  }, [mounted, reduced]);

  if (!mounted) return null;

  return (
    <div
      ref={rootRef}
      role="status"
      aria-label="Loading FAIITA"
      className="fixed inset-0 z-[999] flex items-center justify-center overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0A0A0F 0%, #1A1A2E 100%)" }}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        {NODES.map((n, i) => (
          <line
            key={`line-${i}`}
            ref={(el) => { linesRef.current[i] = el; }}
            x1={n.x}
            y1={n.y}
            x2={CENTER.x}
            y2={CENTER.y}
            stroke="#F2921D"
            strokeWidth="0.15"
            strokeDasharray="40"
          />
        ))}
        {NODES.map((n, i) => (
          <circle
            key={`node-${i}`}
            ref={(el) => { nodesRef.current[i] = el; }}
            cx={n.x}
            cy={n.y}
            r="1"
            fill="#F2921D"
          />
        ))}
        <polygon
          ref={emblemRef}
          points={EMBLEM_POINTS}
          fill="none"
          stroke="#ffffff"
          strokeWidth="0.6"
          strokeDasharray="200"
          opacity={reduced ? 1 : 0}
        />
      </svg>

      <div className="relative flex flex-col items-center gap-3">
        <div ref={wordmarkRef} className="font-display text-4xl font-bold tracking-tight text-white opacity-0 sm:text-6xl">
          FAIITA
        </div>
        <p ref={taglineRef} className="font-mono text-xs uppercase tracking-[0.3em] text-saffron-400 opacity-0">
          29 States · One Federation
        </p>
      </div>
    </div>
  );
}
