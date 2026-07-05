"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Drop your transparent-background logo at /public/logo.png (or .svg) and it
 * will be picked up automatically. Until then, a styled wordmark is shown so
 * the header never breaks.
 */
export function Logo({ variant = "light", className }: { variant?: "light" | "dark"; className?: string }) {
  const [imgFailed, setImgFailed] = useState(false);

  return (
    <Link href="/" className={cn("flex items-center gap-3 group", className)} aria-label="FAIITA — Home">
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center">
        {!imgFailed ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src="/logo.png"
            alt="FAIITA logo"
            className="h-10 w-10 object-contain"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-xl font-display text-base font-bold",
              variant === "light" ? "bg-white text-navy-700" : "bg-navy-700 text-white"
            )}
          >
            F
          </span>
        )}
      </span>
      <span className="flex flex-col leading-none">
        
      </span>
    </Link>
  );
}
