import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Every date on this site is Indian local time.
 *
 * Postgres stores these as UTC and Vercel's servers run in UTC, so a date
 * formatted without a timeZone renders in UTC during server rendering and in
 * the visitor's own zone after hydration — which for an Indian federation is
 * wrong twice, and disagrees with itself. IST is 5h30m ahead, so a 9pm event
 * was rendering as the previous day.
 */
export const IST = "Asia/Kolkata";

export function formatDate(date: Date | string, opts: Intl.DateTimeFormatOptions = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: IST,
    ...opts,
  });
}

export function formatDateShort(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit", timeZone: IST }),
    month: d.toLocaleDateString("en-IN", { month: "short", timeZone: IST }).toUpperCase(),
    year: Number(d.toLocaleDateString("en-IN", { year: "numeric", timeZone: IST })),
  };
}

/** A timestamp for the dashboard — date and time, always IST. */
export function formatDateTime(date: Date) {
  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: IST,
  });
}

// There is no separate North-East zone — NECTA is grouped under East.
// prisma/seed.ts already says "East"; this folds any live DB rows that still
// say "North-East" until the next reseed.
export function normalizeZone(region: string) {
  return region === "North-East" ? "East" : region;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * A meta description, trimmed to what a search engine will actually show.
 *
 * News excerpts and event descriptions are written for a card, not for a
 * SERP, and several run past 200 characters — Google cuts around 160 and the
 * tail is wasted. Cuts on a word boundary rather than mid-word.
 */
export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" "))}…`;
}

/**
 * JSON-LD, ready for a <script> tag.
 *
 * JSON.stringify escapes quotes but not "</script>", and every field in these
 * schemas is now typed into the CMS by a person. Escaping "<" means a headline
 * can contain anything at all without being able to close the block early.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
