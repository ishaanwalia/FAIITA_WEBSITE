/**
 * Verified FAIITA member associations — city/district bodies working under a
 * state chapter. This file is the canonical source (same pattern as
 * lib/leader-profiles.ts): the member-associations page renders directly from
 * it, and prisma/seed.ts seeds the same rows into the DB so state detail
 * pages can show them as member chapters.
 *
 * `stateSlug` must match the state association slug generated in
 * prisma/seed.ts (slugified stateName, or the explicit `slug` override).
 *
 * Entries flagged `isDemo: true` are placeholder cards shown only so the page
 * doesn't look empty — they carry a Demo badge, are NOT seeded into the DB,
 * and should be deleted as verified member listings come in.
 */
export type MemberAssociationSeed = {
  slug: string;
  name: string;
  city: string;
  stateName: string;
  stateSlug: string;
  type: string;
  memberCount: number;
  foundedYear?: number;
  description: string;
  website?: string;
  presidentName?: string;
  contactEmail?: string;
  /** President's phone */
  contactPhone?: string;
  secretaryPhone?: string;
  /** Path under /public, e.g. /logos/member/<file> */
  logoUrl?: string;
  /** Placeholder card — shown with a Demo badge, never seeded into the DB. */
  isDemo?: boolean;
};

export const memberAssociations: MemberAssociationSeed[] = [
  {
    slug: "demo-city-it-association",
    name: "Sample City IT Association",
    city: "Sample City",
    stateName: "India",
    stateSlug: "",
    type: "City Association",
    memberCount: 0,
    description:
      "This is a placeholder listing. Verified FAIITA member associations — the city and district bodies working under each state chapter — are being onboarded and will appear here with their real details, logos and contact information.",
    isDemo: true,
  },
];
