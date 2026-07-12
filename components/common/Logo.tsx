"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Renders /public/logo.png at a larger size, logo-only (no adjacent text —
 * the logo file itself carries the FAIITA mark). Falls back to a styled "F"
 * badge if the file is missing so the header never breaks.
 *
 * `framed` wraps the mark in the glassmorphism .logo-container (semi
 * transparent backdrop + border + shadow) — used in the navbar. The footer
 * renders the plain original with no backdrop.
 */
export function Logo({
  variant = "light",
  framed = false,
  className,
}: {
  variant?: "light" | "dark";
  framed?: boolean;
  className?: string;
}) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href="/" className={cn("flex shrink-0 items-center", className)} aria-label="FAIITA — Home">
      {!imgFailed ? (
        <span className={framed ? "logo-container" : "inline-flex items-center"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="FAIITA"
            className={cn("w-auto object-contain", framed ? "h-12 sm:h-[3.25rem]" : "h-14 sm:h-16")}
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
