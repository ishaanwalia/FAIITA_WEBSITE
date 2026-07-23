"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

export function MagneticButton({
  children,
  className,
  strength = 0.4,
  clipped = false,
  ...props
}: ButtonProps & { strength?: number; clipped?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const quickX = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickY = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const quickScale = useRef<ReturnType<typeof gsap.quickTo> | null>(null);
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!ref.current || reducedMotion.current) return;
    // quickTo reuses a single tween setter instead of creating a new one on
    // every mousemove — much cheaper for high-frequency updates.
    quickX.current = gsap.quickTo(ref.current, "x", { duration: 0.4, ease: "power3.out" });
    quickY.current = gsap.quickTo(ref.current, "y", { duration: 0.4, ease: "power3.out" });
    quickScale.current = gsap.quickTo(ref.current, "scale", { duration: 0.3, ease: "power3.out" });
  }, []);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion.current) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    quickX.current?.(relX * strength);
    quickY.current?.(relY * strength);
    quickScale.current?.(1.05);
  };

  const handleLeave = () => {
    quickX.current?.(0);
    quickY.current?.(0);
    quickScale.current?.(1);
  };

  const handleDown = () => quickScale.current?.(0.95);
  // Reset to rest state, not the hover scale — touch devices fire this
  // without a preceding/following mousemove or mouseleave, so resolving to
  // the hover size here would leave tapped buttons stuck looking enlarged.
  const handleUp = () => handleLeave();

  return (
    <Button
      ref={ref}
      data-magnetic
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseDown={handleDown}
      onMouseUp={handleUp}
      className={cn(clipped && "clip-corner rounded-none", className)}
      {...props}
    >
      {children}
    </Button>
  );
}