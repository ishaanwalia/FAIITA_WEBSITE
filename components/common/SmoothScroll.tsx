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
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    // Skip Lenis on mobile / reduced-motion — native scroll performs better there.
    setEnabled(!prefersReduced && !isNarrow);
  }, []);

  if (!enabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, syncTouch: false }}>
      <GsapSync />
      {children}
    </ReactLenis>
  );
}
