"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders /public/logo.png at a larger size, logo-only (no adjacent text —
 * the logo file itself carries the FAIITA mark). Falls back to a styled "F"
 * badge if the file is missing so the header never breaks.
 */
export function Logo({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="FAIITA — Home">
      {!imgFailed ? (
        /* The frosted .logo-glass plate keeps the navy logo visible on the
           site's dark navy surfaces (navbar, footer). */
        <span className="logo-glass">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FAIITA"
            className="h-12 w-auto object-contain sm:h-14"
            onError={() => setImgFailed(true)}
          />
        </span>
      ) : (
        <span
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-xl font-display text-xl font-bold",
            variant === "light" ? "bg-white text-navy-700" : "bg-navy-700 text-white"
          )}
        >
          F
        </span>
      )}
    </Link>
  );
}
