"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

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

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

    let magnetTarget: HTMLElement | null = null;

    const onMove = (e: MouseEvent) => {
      let x = e.clientX;
      let y = e.clientY;

      if (magnetTarget) {
        const rect = magnetTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        x = cx + (e.clientX - cx) * 0.3;
        y = cy + (e.clientY - cy) * 0.3;
      }

      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
    };

    const onOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor='hover'], [data-magnetic]"
      );
      if (target) {
        ring.classList.add("scale-[2]", "opacity-60");
        dot.classList.add("scale-0");
        if (target.hasAttribute("data-magnetic")) magnetTarget = target;
      }
    };

    const onOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [data-cursor='hover'], [data-magnetic]"
      );
      if (target) {
        ring.classList.remove("scale-[2]", "opacity-60");
        dot.classList.remove("scale-0");
        magnetTarget = null;
      }
    };

    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-saffron-500 transition-transform duration-150 md:block"
        aria-hidden
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[200] hidden h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-saffron-400/70 transition-all duration-200 md:block"
        aria-hidden
      />
    </>
  );
}
