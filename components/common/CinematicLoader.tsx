"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const SESSION_KEY = "faiita-intro-played";

// A jagged EKG/pulse-style zigzag spanning the viewBox width.
const ZIGZAG_PATH = "M 2,50 L 16,50 L 22,20 L 30,80 L 38,35 L 46,65 L 54,50 L 68,50 L 74,15 L 82,85 L 90,50 L 98,50";

export function CinematicLoader() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGCircleElement>(null);
  const trailRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    setMounted(true);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
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
      gsap.to([wordmarkRef.current, taglineRef.current], { opacity: 1, duration: 0.4 });
      const t = setTimeout(finish, 700);
      return () => clearTimeout(t);
    }

    gsap.set(rootRef.current, { scale: 1.1 });

    const path = pathRef.current;
    const trail = trailRef.current;
    const pulse = pulseRef.current;
    if (!path || !trail || !pulse) return;

    const length = path.getTotalLength();
    gsap.set([path, trail], { strokeDasharray: length, strokeDashoffset: length });

    const proxy = { p: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        const elapsed = tl.totalDuration() * 1000;
        setTimeout(finish, Math.max(0, 2500 - elapsed));
      },
    });

    tl.to(rootRef.current, { scale: 1, duration: 0.01 })
      .to(proxy, {
        p: 1,
        duration: 1.5,
        ease: "power1.inOut",
        onUpdate: () => {
          const dashOffset = length * (1 - proxy.p);
          path.style.strokeDashoffset = String(dashOffset);
          trail.style.strokeDashoffset = String(Math.max(0, dashOffset - length * 0.08));
          const pt = path.getPointAtLength(proxy.p * length);
          pulse.setAttribute("cx", String(pt.x));
          pulse.setAttribute("cy", String(pt.y));
        },
      })
      .to(pulse, { scale: 0, opacity: 0, duration: 0.15, transformOrigin: "center" }, ">-0.05")
      .fromTo(
        flashRef.current,
        { opacity: 0.9 },
        { opacity: 0, duration: 0.5, ease: "power2.out" },
        "<"
      )
      .fromTo(
        wordmarkRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.6)" },
        "<0.05"
      )
      .fromTo(taglineRef.current, { opacity: 0 }, { opacity: 1, duration: 0.5 }, "-=0.2");

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
      <div className="absolute inset-0 bg-network-grid opacity-20" />

      <svg viewBox="0 0 100 100" className="absolute inset-x-0 top-1/2 h-40 w-full -translate-y-1/2" preserveAspectRatio="none" aria-hidden>
        <path
          ref={trailRef}
          d={ZIGZAG_PATH}
          fill="none"
          stroke="#F2921D"
          strokeOpacity="0.25"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path
          ref={pathRef}
          d={ZIGZAG_PATH}
          fill="none"
          stroke="#F2921D"
          strokeWidth="0.8"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <circle ref={pulseRef} r="1.6" fill="#ffffff" />
      </svg>

      <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" aria-hidden />

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
