"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";

/**
 * Lenis drives real window scroll (see the comment in Navbar.tsx) and lives
 * above <PageTransition> in the layout, so it survives every client-side
 * navigation — only {children} remounts per pathname. Nothing told Lenis a
 * navigation happened, so its internal scroll target stayed wherever the
 * previous page was left, instead of the top of the new one.
 */
export function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
  }, [pathname, lenis]);

  return null;
}
