"use client";

import { useRef } from "react";
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

  const handleMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      scale: 1.05,
      duration: 0.4,
      ease: "power3.out",
    });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { x: 0, y: 0, scale: 1, duration: 0.5, ease: "elastic.out(1,0.4)" });
  };

  const handleDown = () => {
    gsap.to(ref.current, { scale: 0.95, duration: 0.15 });
  };

  const handleUp = () => {
    gsap.to(ref.current, { scale: 1.05, duration: 0.2 });
  };

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
