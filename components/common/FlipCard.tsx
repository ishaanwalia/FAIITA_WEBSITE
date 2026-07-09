"use client";

import { useState } from "react";
import { Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function FlipCard({
  front,
  back,
  className,
}: {
  front: React.ReactNode;
  back: React.ReactNode;
  className?: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className={cn("group/flip relative h-full", className)} style={{ perspective: 1000 }}>
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{ transformStyle: "preserve-3d", transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        <div className="relative h-full w-full" style={{ backfaceVisibility: "hidden" }}>
          {front}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(true);
            }}
            aria-label="Show contact info"
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 opacity-0 transition-opacity group-hover/flip:opacity-100 hover:bg-white/20 hover:text-white"
          >
            <Info className="h-3.5 w-3.5" />
          </button>
        </div>
        <div
          className="absolute inset-0 h-full w-full"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {back}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setFlipped(false);
            }}
            aria-label="Back"
            className="absolute right-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
