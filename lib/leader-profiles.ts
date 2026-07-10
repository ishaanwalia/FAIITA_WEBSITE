/**
 * Extended leader profiles, keyed by the leader's exact name in the database.
 *
 * The Leader table holds the core GB record; this overlay adds the richer
 * "visiting card" details (past association roles, business, website) and can
 * override DB fields such as imageUrl without a database migration. As members
 * send in their details, add an entry here and redeploy.
 */

export type LeaderExtras = {
  /** Earlier or concurrent roles, e.g. "Past President — FITAG (…)" */
  journey?: string[];
  company?: string;
  location?: string;
  website?: string;
};

type LeaderOverrides = LeaderExtras & {
  imageUrl?: string;
  email?: string;
  phone?: string;
};

const profiles: Record<string, LeaderOverrides> = {
  "Praful Desai": {
    journey: ["Past President — FITAG (Federation of Information Technology Association of Gujarat)"],
    company: "Anjali Infocom India",
    location: "Rajkot, Gujarat",
    website: "https://www.anjalirajkot.com",
    email: "info@anjalirajkot.com",
    phone: "+91 99099 53131",
    imageUrl: "/leadership/praful-desai.jpeg",
  },
};

export function withLeaderProfile<
  T extends { name: string; imageUrl?: string | null; email?: string | null; phone?: string | null }
>(leader: T): T & LeaderExtras {
  const p = profiles[leader.name];
  if (!p) return leader;
  const { journey, company, location, website, ...overrides } = p;
  return { ...leader, ...overrides, journey, company, location, website };
}
