import type { LeaderData } from "@/components/about/Leadership";

/**
 * Extended leader profiles, keyed by the leader's exact name in the database.
 *
 * The Leader table holds the core GB record; this overlay adds the richer
 * "visiting card" details (past association roles, business, website) and can
 * override DB fields such as imageUrl without a database migration. As members
 * send in their details, add an entry here and redeploy.
 *
 * Members not yet in the database go in `extraCurrentLeaders` below and are
 * appended to the current GB grid.
 */

export type JourneyStep = { text: string; url?: string };

export type LeaderExtras = {
  /** Earlier or concurrent roles in their state association, e.g. "Past President — FITAG (…)" */
  journey?: JourneyStep[];
  company?: string;
  /** Link opened when the company name is clicked, e.g. a Google Business profile */
  companyUrl?: string;
  location?: string;
  website?: string;
};

type LeaderOverrides = LeaderExtras & {
  imageUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
};

// Shared by the 2025–27 extra entry and the 2022–24 DB record of the same person.
const samirParekhProfile: LeaderOverrides = {
  journey: [{ text: "CMDA Mumbai", url: "https://www.cmdamumbai.in" }],
  company: "Brainpoint Computer LLP",
  companyUrl: "https://jsdl.in/RSL-YDN1783757654",
  location: "Mumbai, Maharashtra",
  website: "https://www.brainpointcomputer.in",
  email: "brain2@ymail.com",
  phone: "+91 93215 35453",
};

const gurpreetSinghProfile: LeaderOverrides = {
  journey: [{ text: "President — ACE (Ludhiana)" }],
  company: "Premier Computers",
  companyUrl: "https://share.google/obfkiMK8eTHX0o4zx",
  location: "Ludhiana, Punjab",
  phone: "+91 98140 99796",
  bio: "Leads Premier Computers with 14 retail outlets and distribution offices in Ludhiana, Jalandhar, and Chandigarh.",
  imageUrl: "/leadership/gurpreet-singh.jpg",
};

const profiles: Record<string, LeaderOverrides> = {
  // Past-GB (2022–24) records of members who also appear in the current term
  "Samir Parekh": samirParekhProfile,
  "Gurpreet Singh": gurpreetSinghProfile,
  "Liju P Raju": {
    journey: [{ text: "Past President — AKITDA (All Kerala IT Dealers Association)" }],
    company: "Zeta IT Innovation India Pvt Ltd",
    location: "Thrissur, Kerala",
    website: "https://www.zetaipl.com",
    email: "zetaliju@yahoo.in",
    phone: "+91 93874 25526",
  },
  "Sanjeev Walia": {
    journey: [{ text: "Chairman — PACT (Punjab Association of Computer Traders)" }],
    company: "Jetage Computer Traders",
    companyUrl: "https://share.google/iwE1vp7fnwd7y4iNC",
    location: "Chandigarh, India",
    website: "https://www.jetageindia.in",
    email: "jetage17@gmail.com",
    phone: "+91 98149 58290",
    imageUrl: "/leadership/sanjeev-walia.jpeg",
  },
  "Praful Desai": {
    journey: [{ text: "Past President — FITAG (Federation of Information Technology Association of Gujarat)" }],
    company: "Anjali Infocom India",
    companyUrl: "https://share.google/uqBa72Tk08RIy7ouT",
    location: "Rajkot, Gujarat",
    website: "https://www.anjalirajkot.com",
    email: "info@anjalirajkot.com",
    phone: "+91 99099 53131",
    imageUrl: "/leadership/praful-desai.jpeg",
  },
  "Naveen Gupta": {
    journey: [{ text: "Immediate Past President — Jammu Computer Dealers Association" }],
    company: "NR Computer Care LLP",
    companyUrl: "https://share.google/1Aa7ejjJkBIFV0Sfo",
    location: "Jammu",
    email: "busyjammu@gmail.com",
    phone: "+91 94191 83670",
  },
  "Arun Dey": {
    journey: [
      { text: "Past President — IT Association of Odisha" },
      { text: "Founder Member — FAIITA" },
    ],
  },
  "S. Karthikeyan": {
    journey: [
      { text: "Charter President — CONFED-ITA (Tamil Nadu & Pondicherry)" },
      { text: "Founder Member — FAIITA" },
    ],
    company: "Bloom Electronics Pvt Ltd",
    companyUrl: "https://share.google/7Y3wscgOjrwEfvamA",
    location: "Chennai & Coimbatore, Tamil Nadu",
    website: "https://bloomonline.in",
    phone: "+91 88830 44433",
    bio: "In the IT industry since 1991, Bloom Electronics develops software for major Fortune 500 companies. He is a director of the second-greenest building in the world, located in Coimbatore.",
    imageUrl: "/leadership/karthikeyan-shanmugam.jpg",
  },
};

/**
 * Current-term (2025–27) GB members who are not in the database yet.
 * Appended after the DB list on the leadership page.
 */
export const extraCurrentLeaders: LeaderData[] = [
  {
    id: "extra-samir-p-parekh",
    name: "Samir P Parekh",
    role: "GB Member",
    associationName: null,
    stateName: "Maharashtra",
    bio: null,
    term: "2025–2027",
    email: samirParekhProfile.email ?? null,
    phone: samirParekhProfile.phone ?? null,
    ...samirParekhProfile,
  },
  {
    id: "extra-pankaj-s-shah",
    name: "Pankaj S. Shah",
    role: "GB Member",
    associationName: null,
    stateName: "Maharashtra",
    email: "technops@gmail.com",
    phone: "+91 98201 49462",
    bio: null,
    term: "2025–2027",
    imageUrl: "/leadership/pankaj-s-shah.jpg",
    journey: [
      {
        text: "Founding Secretary & Past President — ASIRT (Association of System Integrators & Retailers in Technology), Mumbai",
        url: "https://www.asirt.in",
      },
    ],
    company: "TechnoPlus Systems",
    location: "Mumbai, Maharashtra",
    website: "https://www.technoplussystems.com",
  },
  {
    id: "extra-gurpreet-singh",
    name: "Gurpreet Singh",
    role: "GB Member",
    associationName: null,
    stateName: "Punjab",
    email: null,
    term: "2025–2027",
    phone: gurpreetSinghProfile.phone ?? null,
    bio: gurpreetSinghProfile.bio ?? null,
    ...gurpreetSinghProfile,
  },
];

export function withLeaderProfile<
  T extends { name: string; imageUrl?: string | null; email?: string | null; phone?: string | null; bio?: string | null }
>(leader: T): T & LeaderExtras {
  const p = profiles[leader.name];
  if (!p) return leader;
  const { journey, company, companyUrl, location, website, ...overrides } = p;
  return { ...leader, ...overrides, journey, company, companyUrl, location, website };
}
