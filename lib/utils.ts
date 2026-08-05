import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, opts: Intl.DateTimeFormatOptions = {}) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...opts,
  });
}

export function formatDateShort(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return {
    day: d.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase(),
    year: d.getFullYear(),
  };
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
 * JSON-LD, ready for a <script> tag.
 *
 * JSON.stringify escapes quotes but not "</script>", and every field in these
 * schemas is now typed into the CMS by a person. Escaping "<" means a headline
 * can contain anything at all without being able to close the block early.
 */
export function jsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
