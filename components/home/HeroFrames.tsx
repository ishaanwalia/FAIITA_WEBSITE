"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { capabilityTier } from "@/lib/canvas-engine";

/**
 * Hero background: real FAIITA event photography, cross-fading every 3s.
 *
 * Frames are mounted progressively rather than all at once — an opacity-0
 * <Image> still downloads, so rendering all seven up front would pull ~1.4 MB
 * on first paint for six pictures nobody has seen yet. `reached` grows as the
 * rotation advances, so each frame costs its bytes only when it's about to be
 * shown. After one full cycle every frame is in the DOM and browser-cached, and
 * subsequent cycles are instant.
 */

const HOLD_MS = 3000;

export type HeroFrame = { src: string; alt: string };

export function HeroFrames({ frames }: { frames: HeroFrame[] }) {
  // index and reached advance together, so they live in one state object — a
  // state updater must be pure, and nesting setReached() inside setIndex()'s
  // updater silently drops it under React's double-invoke in development.
  const [{ index, reached }, setRotation] = useState({ index: 0, reached: 1 });

  // Capability can only be read after mount (matchMedia doesn't exist during
  // SSR), so it starts false and resolves post-mount. Reading it during render
  // instead would make the server and client disagree about the Ken Burns
  // class and produce a hydration mismatch.
  const [still, setStill] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStill(capabilityTier() === "still");
  }, []);

  useEffect(() => {
    if (still || frames.length < 2) return;
    const id = window.setInterval(() => {
      setRotation((prev) => {
        const next = (prev.index + 1) % frames.length;
        return { index: next, reached: Math.max(prev.reached, next + 1) };
      });
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [still, frames.length]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      {frames.slice(0, still ? 1 : reached).map((frame, i) => (
        <div
          key={frame.src}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={frame.src}
            alt=""
            fill
            // Only the first frame is the LCP candidate; the rest arrive later
            // by definition, so they must not compete for early bandwidth.
            priority={i === 0}
            loading={i === 0 ? undefined : "lazy"}
            sizes="100vw"
            className={`object-cover ${
              still ? "" : i % 2 === 0 ? "animate-kenburns-in" : "animate-kenburns-out"
            }`}
          />
        </div>
      ))}

      {/* Scrim: heavy on the left where the copy sits, opening up on the right
          so the photograph is actually visible rather than uniformly dimmed. */}
      <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-900/80 to-navy-900/45" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-navy-900/40" />
    </div>
  );
}
