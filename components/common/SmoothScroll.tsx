"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "lenis/dist/lenis.css";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

function GsapSync() {
  useLenis(() => {
    ScrollTrigger.update();
  });

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);
  }, []);

  return null;
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    // Skip smoothing on mobile / reduced-motion — native scroll performs better there.
    setSmooth(!prefersReduced && !isNarrow);
  }, []);

  // Always the same wrapper component across renders (never swap between a
  // fragment and ReactLenis) — swapping component types here would force
  // React to unmount/remount every child, including the intro loader,
  // mid-animation. Only the smoothing strength changes.
  return (
    <ReactLenis root options={{ lerp: smooth ? 0.1 : 1, duration: smooth ? 1.2 : 0, syncTouch: false }}>
      <GsapSync />
      {children}
    </ReactLenis>
  );
}
