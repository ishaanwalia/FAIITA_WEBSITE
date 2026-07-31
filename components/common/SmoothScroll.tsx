"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [smooth, setSmooth] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isNarrow = window.matchMedia("(max-width: 768px)").matches;
    // Skip smoothing on mobile / reduced-motion — native scroll performs better there.
    // matchMedia isn't available during SSR, so this can only be resolved
    // post-mount — one of the few legitimate exceptions to the "no setState
    // in effect" rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSmooth(!prefersReduced && !isNarrow);
  }, []);

  // Always the same wrapper component across renders (never swap between a
  // fragment and ReactLenis) — swapping component types here would force
  // React to unmount/remount every child, including the intro loader,
  // mid-animation. Only the smoothing strength changes.
  //
  // ReactLenis defaults `autoRaf` to true regardless of lerp/duration, so
  // without `autoRaf: smooth` Lenis runs its own requestAnimationFrame loop
  // forever on every device — including mobile, where lerp:1/duration:0
  // already make it a pass-through and the RAF loop buys nothing but battery
  // and dropped frames.
  return (
    <ReactLenis
      root
      options={{ lerp: smooth ? 0.1 : 1, duration: smooth ? 1.2 : 0, syncTouch: false, autoRaf: smooth }}
    >
      {children}
    </ReactLenis>
  );
}
