// Intentionally renders nothing. This file is Next.js's Suspense fallback
// shown while a page's async data is loading — but it renders *before* the
// (site) layout (and its CinematicLoader) ever mounts, so having a visible
// spinner here created a second, competing "loading screen" ahead of the
// real one. Returning null lets the cinematic loader be the only one seen.
export default function Loading() {
  return null;
}
