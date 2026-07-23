"use client";

import { useState } from "react";
import Image from "next/image";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

/**
 * Renders a state/member association logo from the public folder, falling
 * back to a generic building icon when logoUrl is unset OR the file 404s
 * (e.g. the association hasn't supplied a logo yet).
 */
export function LogoImage({
  logoUrl,
  alt,
  size = "md",
  className,
}: {
  logoUrl?: string | null;
  alt: string;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(logoUrl) && !failed;

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-sm",
        SIZES[size],
        className
      )}
    >
      {showImage ? (
        <Image
          src={logoUrl as string}
          alt={alt}
          fill
          sizes="80px"
          className="object-contain p-1"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-lg bg-secondary/60 text-navy-700/40">
          <Building2 className="h-1/2 w-1/2" />
        </div>
      )}
    </div>
  );
}
