"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 });

  // Rendered inside Navbar's <header> (sticky, not position:fixed) rather
  // than as its own independent fixed element — a standalone fixed bar
  // hit the exact same iOS Safari desync bug the header itself had, once
  // that got fixed and made the drift on this one visible by comparison.
  // Anchoring to the header's own (now reliable) positioning instead of
  // re-solving the same problem a second time.
  return (
    <motion.div
      style={{ scaleX }}
      className="absolute inset-x-0 top-0 z-[110] h-[2px] origin-left bg-saffron-500 print:hidden"
      aria-hidden
    />
  );
}
