"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-base",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-4xl",
};

export function PhotoAvatar({
  initials,
  imageUrl,
  size = "md",
  hoverZoom = false,
  className,
}: {
  initials: string;
  imageUrl?: string | null;
  size?: keyof typeof SIZES;
  /** Gently zooms the avatar on hover of the nearest `group` ancestor (e.g. a card). */
  hoverZoom?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(imageUrl) && !failed;

  return (
    <div
      className={cn(
        "relative z-10 shrink-0 overflow-hidden rounded-2xl shadow-md transition-transform duration-300 ease-out",
        SIZES[size],
        hoverZoom && "group-hover:z-20 group-hover:scale-125",
        className
      )}
    >
      {showImage ? (
        // object-contain (not cover) so portrait photos are zoomed out to fit —
        // faces must never be cropped; the white backing fills the letterbox.
        <Image
          src={imageUrl as string}
          alt=""
          fill
          className="bg-white object-contain"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-saffron-400 to-saffron-600">
          <span className="font-display font-bold text-navy-900">{initials}</span>
        </div>
      )}
    </div>
  );
}
