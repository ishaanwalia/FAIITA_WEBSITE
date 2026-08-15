"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useLenis } from "lenis/react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/**
 * The festival poster: a full-bleed artwork over the homepage, once a session,
 * with nothing on it but a cross.
 *
 * Built on the native <dialog> for the same reasons as the gallery Lightbox —
 * showModal() brings focus trapping, Escape-to-close and top-layer stacking, so
 * the poster sits above the sticky header without a z-index argument.
 *
 * Three states rather than one, because the pictures have to arrive before the
 * curtain goes up:
 *
 *   armed   — markup is in the DOM but the dialog is closed, so both posters
 *             are already being fetched (loading="eager"; a lazy image inside a
 *             display:none dialog would never load at all).
 *   open    — showModal() has run and the card animates in.
 *   closing — the exit animation is playing; close() fires when it finishes.
 */

export type Poster = {
  id: string;
  title: string;
  imagePortrait: string;
  imageLandscape: string;
  linkUrl: string | null;
};

const SESSION_KEY = "faiita-popup-seen";

/** Longest the intro overlay can hold the stage before we go anyway. */
const INTRO_FAILSAFE_MS = 7000;

/** Breathing room after the page settles, when there is no intro to wait for. */
const SETTLE_MS = 700;

// Orientation, not a width breakpoint: a 9:16 artwork belongs on anything
// taller than it is wide, which is exactly the question being asked.
const PORTRAIT = "(max-aspect-ratio: 1/1)";
const subscribeOrientation = (onChange: () => void) => {
  const mq = window.matchMedia(PORTRAIT);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
};
const isPortraitNow = () => window.matchMedia(PORTRAIT).matches;

export function PopupPoster({ posters }: { posters: Poster[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [armed, setArmed] = useState(false);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [index, setIndex] = useState(0);
  const dragFrom = useRef<number | null>(null);
  const dragged = useRef(false);
  const lenis = useLenis();
  const prefersReduced = useReducedMotion();

  // Server renders landscape; the dialog is not shown until well after
  // hydration, so the first client read can never mismatch visible markup.
  const portrait = useSyncExternalStore(subscribeOrientation, isPortraitNow, () => false);

  // A new campaign should interrupt a session that has already dismissed the
  // last one, so the seen-marker is the set of poster ids, not a bare flag.
  const seenKey = posters.map((p) => p.id).join(",");

  useEffect(() => {
    if (posters.length === 0 || sessionStorage.getItem(SESSION_KEY) === seenKey) return;

    // A one-time mount decision, not a synchronisation: sessionStorage cannot
    // be read during render, and the markup has to exist before the dialog
    // opens so the pictures are already on their way.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArmed(true);
    const reveal = () => {
      sessionStorage.setItem(SESSION_KEY, seenKey);
      setOpen(true);
    };

    // CinematicLoader owns the first few seconds of a fresh session and is
    // painted over everything; opening underneath it would burn the poster's
    // one appearance on a black screen. On a repeat visit the loader has
    // already removed itself in a layout effect, which runs before this one.
    const intro = document.getElementById("intro-loader");
    if (!intro) {
      const timer = window.setTimeout(reveal, SETTLE_MS);
      return () => window.clearTimeout(timer);
    }

    const failsafe = window.setTimeout(reveal, INTRO_FAILSAFE_MS);
    const onIntroDone = () => {
      window.clearTimeout(failsafe);
      reveal();
    };
    window.addEventListener("faiita:intro-done", onIntroDone, { once: true });
    return () => {
      window.clearTimeout(failsafe);
      window.removeEventListener("faiita:intro-done", onIntroDone);
    };
  }, [posters.length, seenKey]);

  useEffect(() => {
    if (!open) return;
    dialogRef.current?.showModal();

    // showModal() blocks interaction but not scrolling. Stop Lenis rather than
    // setting body overflow — see the note in components/gallery/Lightbox.tsx
    // for why overriding the scroll box underneath Lenis breaks the header in
    // WebKit. The overflow lock stays as the fallback for the cases where
    // Lenis deliberately isn't running (narrow screens, reduced motion).
    if (lenis) {
      lenis.stop();
      return () => lenis.start();
    }
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open, lenis]);

  if (!armed || posters.length === 0) return null;

  const poster = posters[index];
  const many = posters.length > 1;
  const go = (delta: number) => setIndex((n) => (n + delta + posters.length) % posters.length);

  const image = (
    <Image
      key={portrait ? poster.imagePortrait : poster.imageLandscape}
      src={portrait ? poster.imagePortrait : poster.imageLandscape}
      alt={poster.title}
      fill
      // Not preloaded — this is never the LCP element — but not lazy either:
      // a lazy image inside a closed <dialog> is display:none, so its observer
      // never fires and the poster would still be blank when the dialog opens.
      loading="eager"
      sizes="(max-width: 640px) 92vw, 900px"
      // object-contain, not cover: an editor's artwork is rarely exactly 9:16,
      // and cropping somebody's greeting is worse than a little empty space.
      className="object-contain"
      draggable={false}
    />
  );

  return (
    <dialog
      ref={dialogRef}
      // Fires for Escape as well as close(), so this is the single place that
      // has to put the component back to rest.
      onClose={() => {
        setOpen(false);
        setClosing(false);
      }}
      onKeyDown={(e) => {
        if (!many) return;
        if (e.key === "ArrowRight") go(1);
        if (e.key === "ArrowLeft") go(-1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-navy-900/90"
      aria-label={poster.title}
    >
      <div
        className="flex h-full w-full items-center justify-center p-4 sm:p-8"
        // Clicking the empty space around the poster dismisses it, the way
        // every other overlay on the web does.
        onClick={(e) => {
          if (e.target === e.currentTarget) setClosing(true);
        }}
      >
        <motion.div
          initial={false}
          animate={
            open && !closing
              ? { opacity: 1, scale: 1, y: 0 }
              : { opacity: 0, scale: 0.96, y: 12 }
          }
          transition={
            prefersReduced
              ? { duration: 0.15 }
              : { type: "spring", stiffness: 240, damping: 26, mass: 0.8 }
          }
          onAnimationComplete={() => {
            if (closing) dialogRef.current?.close();
          }}
          onPointerDown={(e) => {
            dragFrom.current = e.clientX;
            dragged.current = false;
          }}
          onPointerUp={(e) => {
            const from = dragFrom.current;
            dragFrom.current = null;
            if (from === null) return;
            const dx = e.clientX - from;
            // Anything past a wobble is a swipe, not a tap — recorded so the
            // poster's own link doesn't fire at the end of it.
            dragged.current = Math.abs(dx) > 10;
            if (many && Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
          }}
          className={`relative w-full ${
            portrait
              ? "aspect-[9/16] max-w-[min(92vw,47dvh)]"
              : "aspect-[16/9] max-w-[min(92vw,1100px,151dvh)]"
          }`}
        >
          <div className="relative h-full w-full overflow-hidden rounded-2xl shadow-2xl shadow-black/50">
            {poster.linkUrl ? (
              <a
                href={poster.linkUrl}
                // A full address leaves the site, so it opens beside it; a path
                // of our own navigates in place.
                target={/^https?:\/\//.test(poster.linkUrl) ? "_blank" : undefined}
                rel={/^https?:\/\//.test(poster.linkUrl) ? "noopener noreferrer" : undefined}
                onClick={(e) => {
                  if (dragged.current) e.preventDefault();
                }}
                className="block h-full w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
                aria-label={poster.title}
              >
                {image}
              </a>
            ) : (
              image
            )}
          </div>

          <button
            type="button"
            onClick={() => setClosing(true)}
            aria-label="Close"
            className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full bg-navy-900/75 text-white/85 transition-colors hover:bg-navy-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
          >
            <X className="h-5 w-5" />
          </button>

          {many && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous poster"
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/65 text-white/80 transition-colors hover:bg-navy-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next poster"
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-navy-900/65 text-white/80 transition-colors hover:bg-navy-900 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-400"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute inset-x-0 -bottom-7 flex items-center justify-center gap-2">
                {posters.map((p, n) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndex(n)}
                    aria-label={`Show ${p.title}`}
                    aria-current={n === index}
                    className={`h-2 rounded-full transition-all ${
                      n === index ? "w-6 bg-saffron-400" : "w-2 bg-white/35 hover:bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </motion.div>
      </div>
    </dialog>
  );
}
