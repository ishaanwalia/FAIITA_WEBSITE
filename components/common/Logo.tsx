"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders /public/logo.png at a larger size, logo-only (no adjacent text —
 * the logo file itself carries the FAIITA mark). Falls back to a styled "F"
 * badge if the file is missing so the header never breaks.
 *
 * The mark is lifted on dark surfaces with a brightness/contrast filter
 * only — no panels, glows or backgrounds — applied everywhere it renders.
 *
 * The source file is 3508x1798 (a print-resolution export) for a mark that
 * never renders past 64px tall — next/image downscales and serves it as
 * AVIF/WebP instead of shipping the full 230KB PNG on every page.
 */
export function Logo({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="FAIITA — Home">
      {!imgFailed ? (
        <Image
          src="/logo.png"
          alt="FAIITA"
          width={3508}
          height={1798}
          priority
          className="h-14 w-auto object-contain brightness-[1.35] contrast-[1.1] sm:h-16"
          onError={() => setImgFailed(true)}
        />
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
