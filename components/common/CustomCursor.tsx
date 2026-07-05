"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    document.documentElement.classList.add("custom-cursor-active");

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Plain 1:1 position tracking — no smoothing, no magnetic pull, no per-target
    // math. The ring's slight "lag" look comes from a cheap CSS transition, not JS.
    const onMove = (e: MouseEvent) => {
      const x = `${e.clientX}px`;
      const y = `${e.clientY}px`;
      dot.style.transform = `translate3d(${x}, ${y}, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${x}, ${y}, 0) translate(-50%, -50%)`;
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-2 w-2 rounded-full bg-saffron-500 md:block"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-8 w-8 rounded-full border border-saffron-400/60 transition-transform duration-150 ease-out md:block"
        aria-hidden
      />
    </>
  );
}
