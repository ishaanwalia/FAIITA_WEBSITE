"use client";

import { useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "@/components/ui/button";

const SPRING = { type: "spring" as const, stiffness: 300, damping: 25, mass: 0.5 };
const SCALE_SPRING = { type: "spring" as const, stiffness: 260, damping: 20 };

export function MagneticButton({
  children,
  className,
  strength = 0.4,
  clipped = false,
  ...props
}: ButtonProps & { strength?: number; clipped?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  // Independent per-property animate() calls — like the old gsap.quickTo —
  // so a mousedown scale doesn't stomp whatever x/y tween is mid-flight.
  const setX = (v: number) => ref.current && animate(ref.current, { x: v }, SPRING);
  const setY = (v: number) => ref.current && animate(ref.current, { y: v }, SPRING);
  const setScale = (v: number) => ref.current && animate(ref.current, { scale: v }, SCALE_SPRING);

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (reducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    setX(relX * strength);
    setY(relY * strength);
    setScale(1.05);
  };

  const handleLeave = () => {
    if (reducedMotion) return;
    setX(0);
    setY(0);
    setScale(1);
  };

  const handleDown = () => !reducedMotion && setScale(0.95);
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
