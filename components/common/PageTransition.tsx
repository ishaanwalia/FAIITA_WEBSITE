"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      {/* Reveal panel — sweeps in to cover the old page, then shrinks away to reveal the new one */}
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] as const }}
          style={{ transformOrigin: "top" }}
          className="pointer-events-none fixed inset-0 z-[150] bg-navy-800"
        />
      </AnimatePresence>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.35, delay: 0.15, ease: [0.65, 0, 0.35, 1] as const }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </>
  );
}
