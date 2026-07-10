/**
 * Extended leader profiles, keyed by the leader's exact name in the database.
 *
 * The Leader table holds the core GB record; this overlay adds the richer
 * "visiting card" details (past association roles, business, website) and can
 * override DB fields such as imageUrl without a database migration. As members
 * send in their details, add an entry here and redeploy.
 */

export type LeaderExtras = {
  /** Earlier or concurrent roles in their state association, e.g. "Past President — FITAG (…)" */
  journey?: string[];
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
};

const profiles: Record<string, LeaderOverrides> = {
  "Liju P Raju": {
    journey: ["Past President — AKITDA (All Kerala IT Dealers Association)"],
    company: "Zeta IT Innovation India Pvt Ltd",
    location: "Thrissur, Kerala",
    website: "https://www.zetaipl.com",
    email: "zetaliju@yahoo.in",
    phone: "+91 93874 25526",
  },
  "Sanjeev Walia": {
    journey: ["Chairman — PACT (Punjab Association of Computer Traders)"],
    company: "Jetage Computer Traders",
    companyUrl: "https://share.google/iwE1vp7fnwd7y4iNC",
    location: "Chandigarh, India",
    website: "https://www.jetageindia.in",
    email: "jetage17@gmail.com",
    phone: "+91 98149 58290",
    imageUrl: "/leadership/sanjeev-walia.jpeg",
  },
  "Praful Desai": {
    journey: ["Past President — FITAG (Federation of Information Technology Association of Gujarat)"],
    company: "Anjali Infocom India",
    companyUrl: "https://share.google/uqBa72Tk08RIy7ouT",
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
  const { journey, company, companyUrl, location, website, ...overrides } = p;
  return { ...leader, ...overrides, journey, company, companyUrl, location, website };
}
