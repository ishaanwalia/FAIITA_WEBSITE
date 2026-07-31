import type { TestimonialItem } from "@/types";

/**
 * Real testimonials shipped code-side — same reason as lib/code-news.ts:
 * the production reseed is permission-gated, so these merge into the DB
 * rows at render time via mergeTestimonials(). Slugs (ids) are deduped
 * against the DB, so once a reseed lands these as real rows the merge
 * becomes a no-op.
 *
 * Sourced from FAIITA Patrika Vol 1 (April 2025, public/newsletters/) —
 * short, faithful excerpts from each leader's own signed message, not
 * paraphrased. Names/roles/associations cross-checked against
 * lib/leader-profiles.ts and prisma/seed.ts (the site's authoritative
 * leadership roster) rather than trusting the Patrika's own phrasing:
 * Devesh Rastogi's current title is Chairman (2025–27) — he was President
 * 2022–24, which the Patrika message predates. Champak Raj Gurjar predates
 * the tracked GB roster entirely (founding president, 2014), so there's no
 * profile entry or photo to cross-check or reuse for him.
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
];

/** Merge code-side testimonials into DB rows: dedupe by id (DB wins), DB rows first. */
export function mergeTestimonials<T extends { id: string }>(
  dbTestimonials: T[],
): (T | TestimonialItem)[] {
  const seen = new Set(dbTestimonials.map((t) => t.id));
  return [...dbTestimonials, ...codeTestimonials.filter((t) => !seen.has(t.id))];
}
