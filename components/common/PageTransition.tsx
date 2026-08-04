"use client";

import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A 160ms fade-and-lift on route change. That's the whole thing.
 *
 * What this replaced: a full-viewport opaque panel that swept down over the
 * old page (500ms) plus a content fade held back by a 150ms delay — so nothing
 * was readable for roughly half a second after every click. On a site with 40+
 * pages that is the single most-felt animation on it, and it was costing more
 * than it returned.
 *
 * There's deliberately no exit animation and no AnimatePresence: `mode="wait"`
 * makes the incoming page queue behind the outgoing one's exit, which doubles
 * the delay. Keying on pathname remounts and replays `initial`, so the new page
 * paints immediately and fades up under its own steam.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  if (reduced) return <>{children}</>;

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
