"use client";

/**
 * Single Canvas Engine & Capability Gate
 * ======================================
 * One requestAnimationFrame loop drives every canvas effect on the site.
 *
 * Why one loop: each effect owning its own rAF means N loops competing for the
 * same frame budget, and — the bug this replaces — a loop that keeps running
 * forever after its canvas has scrolled a page and a half out of view.
 *
 * The loop stops completely when nothing is visible (raf = 0) and is restarted
 * by the IntersectionObserver or the visibilitychange handler. So an idle page
 * costs zero frames, not "a cheap frame".
 */

export type CanvasTask = (dt: number) => void;

type Entry = {
  run: CanvasTask;
  /** Rendered once when motion is gated off, so the effect still shows something. */
  still?: CanvasTask;
  visible: boolean;
};

const entries = new Map<Element, Entry>();
let raf = 0;
let last = 0;
let observer: IntersectionObserver | null = null;

// ---------------------------------------------------------------- capability

export type Tier =
  /** Full interactive effects. */
  | "full"
  /** Ambient motion only — no cursor-driven effects (touch, no hover). */
  | "ambient"
  /** No motion at all — render one static frame. */
  | "still";

let cachedTier: Tier | null = null;

/**
 * What this device/user should actually get. Cached: media queries here don't
 * change without a reload in practice, and every effect calls this on mount.
 *
 * `still` wins over everything — a reduced-motion preference is a user
 * instruction, not a performance hint.
 */
export function capabilityTier(): Tier {
  if (typeof window === "undefined") return "still"; // SSR renders the static case
  if (cachedTier) return cachedTier;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return (cachedTier = "still");

  // saveData and low core counts are the two cheapest honest signals that this
  // is a device where a particle field is a bad trade. Neither is guaranteed to
  // exist, so both are optional-chained rather than assumed.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return (cachedTier = "still");
  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) {
    return (cachedTier = "ambient");
  }

  const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  return (cachedTier = fine ? "full" : "ambient");
}

/** True when cursor-driven effects (magnetic field, particle trail) should run. */
export function pointerDriven(): boolean {
  return capabilityTier() === "full";
}

// -------------------------------------------------------------------- engine

function loop(now: number) {
  const dt = Math.min((now - last) / 1000, 0.05); // clamp: tab-switch returns a huge delta
  last = now;

  let anyVisible = false;
  for (const entry of entries.values()) {
    if (!entry.visible) continue;
    anyVisible = true;
    entry.run(dt);
  }

  // Nothing on screen — stop entirely. The IO/visibility handlers restart us.
  raf = anyVisible ? requestAnimationFrame(loop) : 0;
}

function start() {
  if (raf || typeof window === "undefined") return;
  if (document.hidden) return;
  last = performance.now();
  raf = requestAnimationFrame(loop);
}

function stop() {
  if (!raf) return;
  cancelAnimationFrame(raf);
  raf = 0;
}

function ensureObserver() {
  if (observer || typeof window === "undefined") return;
  observer = new IntersectionObserver(
    (records) => {
      for (const record of records) {
        const entry = entries.get(record.target);
        if (entry) entry.visible = record.isIntersecting;
      }
      start();
    },
    // A little margin so an effect is already running by the time it scrolls in,
    // rather than visibly starting from a blank canvas.
    { rootMargin: "120px" }
  );

  document.addEventListener("visibilitychange", () => (document.hidden ? stop() : start()));
}

/**
 * Register a per-frame callback tied to an element's visibility.
 *
 * Returns an unregister function — call it on unmount, or the entry keeps the
 * element alive and the loop keeps ticking for a component that's gone.
 */
export function registerCanvasTask(
  el: Element,
  run: CanvasTask,
  options: { still?: CanvasTask } = {}
): () => void {
  const tier = capabilityTier();

  // Motion is gated off: paint one frame and never schedule a loop at all.
  if (tier === "still") {
    (options.still ?? run)(0);
    return () => {};
  }

  ensureObserver();
  entries.set(el, { run, still: options.still, visible: false });
  observer?.observe(el);
  start();

  return () => {
    observer?.unobserve(el);
    entries.delete(el);
    if (entries.size === 0) stop();
  };
}

/** Test seam — capability is cached, and tests need to re-evaluate it. */
export function __resetCapabilityCache() {
  cachedTier = null;
}
