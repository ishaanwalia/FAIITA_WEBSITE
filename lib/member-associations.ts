/**
 * Verified FAIITA member associations — city/district bodies working under a
 * state chapter. This file is the canonical source (same pattern as
 * lib/leader-profiles.ts): the member-associations page renders directly from
 * it, and prisma/seed.ts seeds the same rows into the DB so state detail
 * pages can show them as member chapters.
 *
 * `stateSlug` must match the state association slug generated in
 * prisma/seed.ts (slugified stateName, or the explicit `slug` override).
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
};

export const memberAssociations: MemberAssociationSeed[] = [
  {
    slug: "jjita-jalgaon",
    name: "Jalgaon Jilha Information Technology Association (JJITA)",
    city: "Jalgaon",
    stateName: "Maharashtra",
    stateSlug: "maharashtra",
    type: "District Association",
    memberCount: 127,
    foundedYear: 2022,
    description:
      "A registered association representing IT dealers, system integrators and technology entrepreneurs across Jalgaon district. Founded in 2022, JJITA brings the district's IT community together to foster collaboration, share knowledge and create business opportunities — driving industry growth through collective advocacy, business networking and skill development initiatives.",
    website: "https://www.jjita.com",
    contactEmail: "itajalgaonjilha@gmail.com",
    contactPhone: "+91 98601 28301",
    secretaryPhone: "+91 98349 67776",
    logoUrl: "/logos/member/JJITA.png",
  },
  {
    slug: "jcda-jalandhar",
    name: "Jalandhar Computer Dealers Association (JCDA)",
    city: "Jalandhar",
    stateName: "Punjab",
    stateSlug: "punjab",
    type: "City Association",
    memberCount: 98,
    foundedYear: 1999,
    description:
      "A collective of over 100 IT entrepreneurs dedicated to fostering the growth and development of the IT industry in the Jalandhar region since 1999. Operating on a “No Profit – No Loss” model, JCDA utilises member contributions to organise impactful initiatives and support noble causes in the community.",
    website: "https://jcdaonline.com",
    contactEmail: "info@jcdaonline.com",
    contactPhone: "+91 98140 54189",
    logoUrl: "/logos/member/jcda.jpg",
  },
];
