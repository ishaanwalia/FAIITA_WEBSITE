"use client";

import { useEffect, useRef } from "react";
import { registerCanvasTask } from "@/lib/canvas-engine";

/**
 * Text that arrives scrambled and resolves left-to-right as it scrolls in.
 *
 * Used on the mono surfaces — section eyebrows and stat figures — where the
 * character cells are already fixed-width, so nothing reflows while the glyphs
 * churn. Digits scramble against digits and letters against letters, so the
 * shape of the string never changes either.
 *
 * Driven by the shared canvas engine rather than its own rAF: it is not a
 * canvas effect, but it wants exactly what the engine already provides —
 * scroll-arrival gating, pausing on a hidden tab, and a reduced-motion path
 * that just paints the final text. It unregisters itself the moment the last
 * character locks, so a decoded heading costs nothing for the rest of the page.
 */

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DIGITS = "0123456789";

export function GlyphDecode({
  text,
  className,
  /** Seconds between one character locking and the next. */
  stagger = 0.04,
}: {
  text: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const chars = [...text];
    // Whitespace and punctuation never scramble — they're the shape the eye
    // reads the word by, so churning them makes it look like a glitch instead
    // of a decode.
    const scrambles = chars.map((c) => (/[A-Za-z]/.test(c) ? LETTERS : /[0-9]/.test(c) ? DIGITS : null));
    const lockAt = chars.map((_, i) => 0.12 + i * stagger);
    const total = lockAt[lockAt.length - 1] ?? 0;

    let t = 0;
    let unregister: (() => void) | null = null;
    const paint = () => {
      el.textContent = text;
    };

    unregister = registerCanvasTask(
      el,
      (dt) => {
        t += dt;
        if (t >= total) {
          paint();
          unregister?.();
          return;
        }
        el.textContent = chars
          .map((c, i) => {
            const pool = scrambles[i];
            if (!pool || t >= lockAt[i]) return c;
            return pool[(Math.random() * pool.length) | 0];
          })
          .join("");
      },
      { still: paint }
    );

    return () => {
      unregister?.();
      paint();
    };
  }, [text, stagger]);

  // The real text is what renders on the server and what a no-JS or
  // reduced-motion visitor keeps seeing.
  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
