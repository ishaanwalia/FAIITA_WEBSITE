"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * Full-screen photo reader: one photo per card, its caption below it, swipe or
 * arrow to the next.
 *
 * Built on the native <dialog> element rather than a hand-rolled overlay.
 * showModal() gives us focus trapping, Escape-to-close and top-layer stacking
 * for free — the last one matters most here, because the top layer sits above
 * the fixed header without entering a z-index argument with it.
 *
 * Mounted only while open (the parent keys it on the opening index), so it has
 * no "is it open" state of its own to keep in sync.
 */

export type LightboxPhoto = { src: string; caption: string };

export function Lightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: LightboxPhoto[];
  startIndex: number;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState(startIndex);
  const dragFrom = useRef<number | null>(null);
  const lenis = useLenis();

  const go = (delta: number) => setI((n) => (n + delta + photos.length) % photos.length);

  useEffect(() => {
    ref.current?.showModal();

    // showModal() blocks interaction but not scrolling, so the page behind
    // would still scroll under the overlay.
    //
    // Stop Lenis rather than setting `body { overflow: hidden }`. Lenis drives
    // the window scroll, so overriding body overflow underneath it changes
    // which box is scrolling while it is mid-flight — and WebKit resolves a
    // position:fixed header against that box. Closing the lightbox then left
    // the header adrift on the gallery page in Safari. lenis.stop() is the
    // library's own answer and touches no global styles at all.
    //
    // Lenis is deliberately not running on narrow screens or under
    // prefers-reduced-motion (see SmoothScroll), so the overflow lock stays as
    // the fallback for exactly those cases.
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [lenis]);

  const photo = photos[i];

  return (
    <dialog
      ref={ref}
      // Fires for Escape as well as for close(), so this is the only place
      // that needs to tell the parent we're done.
      onClose={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      onPointerDown={(e) => (dragFrom.current = e.clientX)}
      onPointerUp={(e) => {
        const from = dragFrom.current;
        dragFrom.current = null;
        if (from === null) return;
        const dx = e.clientX - from;
        if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-navy-900/95 p-0 text-white backdrop:bg-navy-900/80"
      aria-label="Photo viewer"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
          <span className="section-eyebrow text-white/50">
            {i + 1} / {photos.length}
          </span>
          <button
            onClick={() => ref.current?.close()}
            aria-label="Close photo viewer"
            className="flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative min-h-0 flex-1">
          <Image
            key={photo.src}
            src={photo.src}
            alt={photo.caption}
            fill
            sizes="100vw"
            priority
            className="object-contain"
            // Dragging the image itself would start a native image drag and
            // swallow the pointerup that drives the swipe.
            draggable={false}
          />
        </div>

        {/* The caption is the card, not an overlay on the photo: at this size a
            gradient scrim over the image makes both harder to read. */}
        <div className="flex items-center gap-3 border-t border-white/10 px-4 py-4 sm:px-6">
          <button
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <p className="mx-auto max-w-3xl text-center text-sm leading-relaxed text-white/75">{photo.caption}</p>
          <button
            onClick={() => go(1)}
            aria-label="Next photo"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </dialog>
  );
}
