import type { TestimonialItem } from "@/types";

/**
 * Real testimonials shipped code-side — same reason as lib/code-news.ts:
 * the production reseed is permission-gated, so these merge into the DB
 * rows at render time via mergeTestimonials(). Deduped by NAME (not id —
 * DB rows get random cuids that would never match a code-side id, and a
 * name match is what actually matters: never show the same person twice),
 * so once a reseed lands these as real rows the merge becomes a no-op.
 *
 * Patrika-sourced entries (Champak Raj Gurjar, Koushik Pandya, Devesh
 * Rastogi) are short, faithful excerpts from FAIITA Patrika Vol 1 (April
 * 2025, public/newsletters/) — not paraphrased. Names/roles/associations
 * cross-checked against lib/leader-profiles.ts and prisma/seed.ts (the
 * site's authoritative leadership roster) rather than trusting the
 * Patrika's own phrasing: Devesh Rastogi's current title is Chairman
 * (2025–27) — he was President 2022–24, which the Patrika message
 * predates. Champak Raj Gurjar predates the tracked GB roster entirely
 * (founding president, 2014), so there's no profile entry or photo to
 * cross-check or reuse for him.
 *
 * Liju P Raju's entry mirrors the (unreseeded) row already written into
 * prisma/seed.ts, just with the canonical no-period spelling of his name
 * used everywhere else on the site, and its own photo attached.
 */
export const codeTestimonials: TestimonialItem[] = [
  {
    id: "patrika-champak-raj-gurjar",
    name: "Champak Raj Gurjar",
    role: "Founding President",
    association: "FAIITA",
    imageUrl: null,
    quote:
      "It was a privilege to have formed and led FAIITA as its founding president, during which our team worked with dedication and integrity, achieving remarkable milestones for the industry.",
  },
  {
    id: "patrika-koushik-pandya",
    name: "Koushik Pandya",
    role: "Past President & Advisor, FAIITA",
    association: "FITAG, Gujarat",
    imageUrl: "/leadership/koushik-pandya.jpg",
    quote:
      "FAIITA's strength lies in its rich diversity, drawing representation from every corner of India. Despite geographical distances, the organization continues to thrive — thanks to the power of technology and collective will.",
  },
  {
    id: "patrika-devesh-rastogi",
    name: "Devesh Rastogi",
    role: "Chairman, FAIITA",
    association: "AISIE",
    imageUrl: "/leadership/devesh-rastogi.jpg",
    quote:
      "I wish Navin Gupta and his team all the best as they embark on this journey. May you successfully meet the expectations of our community and advance our collective goals.",
  },
  {
    id: "seed-liju-p-raju",
    name: "Liju P Raju",
    role: "Senior Vice President, FAIITA",
    association: "AKITDA (All Kerala IT Dealers Association)",
    imageUrl: "/leadership/liju-p-raju.jpg",
    quote:
      "Being part of FAIITA gives our state association a voice at the national level. The networking opportunities are invaluable.",
  },
];

/** Merge code-side testimonials into DB rows: dedupe by name (DB wins), DB rows first. */
export function mergeTestimonials<T extends { name: string }>(
  dbTestimonials: T[],
): (T | TestimonialItem)[] {
  const seen = new Set(dbTestimonials.map((t) => t.name));
  return [...dbTestimonials, ...codeTestimonials.filter((t) => !seen.has(t.name))];
}
