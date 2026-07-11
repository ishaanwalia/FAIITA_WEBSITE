import type { LeaderData } from "@/components/about/Leadership";

/**
 * Extended leader profiles, keyed by the leader's exact name in the database.
 *
 * The Leader table holds the core GB record; this overlay adds the richer
 * "visiting card" details and can override DB fields (name/role spelling
 * fixes, imageUrl, contact) without a database migration. As members send in
 * their details, add an entry here and redeploy.
 *
 * Every member uses the same fields — no special cases:
 * - journey:   association roles / memberships, one line each, optional link
 * - companies: firms, each optionally linked (Google Business, Justdial, …)
 * - location:  city-level, "City, State" style
 * - website / email / phone: single primary each
 * - bio:       free-form background paragraph
 *
 * Members not yet in the database go in `extraCurrentLeaders` below and are
 * appended to the current GB grid.
 */

export type JourneyStep = { text: string; url?: string };
export type Company = { name: string; url?: string };

export type LeaderExtras = {
  journey?: JourneyStep[];
  companies?: Company[];
  location?: string;
  website?: string;
};

type LeaderOverrides = LeaderExtras & {
  name?: string;
  role?: string;
  imageUrl?: string;
  email?: string;
  phone?: string;
  bio?: string;
};

// Shared by the 2025–27 extra entry and the 2022–24 DB record of the same person.
const samirParekhProfile: LeaderOverrides = {
  journey: [{ text: "CMDA Mumbai", url: "https://www.cmdamumbai.in" }],
  companies: [{ name: "Brainpoint Computer LLP", url: "https://jsdl.in/RSL-YDN1783757654" }],
  location: "Mumbai, Maharashtra",
  website: "https://www.brainpointcomputer.in",
  email: "brain2@ymail.com",
  phone: "+91 93215 35453",
  imageUrl: "/leadership/samir.jpg",
};

// Shared by the current "Liju P Raju" record and the past-GB "Liju R" record.
const lijuPRajuProfile: LeaderOverrides = {
  name: "Liju P Raju",
  journey: [{ text: "Past President — AKITDA (All Kerala IT Dealers Association)" }],
  companies: [{ name: "Zeta IT Innovation India Pvt Ltd" }],
  location: "Thrissur, Kerala",
  website: "https://www.zetaipl.com",
  email: "zetaliju@yahoo.in",
  phone: "+91 93874 25526",
};

const gurpreetSinghProfile: LeaderOverrides = {
  journey: [{ text: "President — ACE (Ludhiana)" }],
  companies: [{ name: "Premier Computers", url: "https://share.google/obfkiMK8eTHX0o4zx" }],
  location: "Ludhiana, Punjab",
  phone: "+91 98140 99796",
  bio: "Leads Premier Computers with 14 retail outlets and distribution offices in Ludhiana, Jalandhar, and Chandigarh.",
  imageUrl: "/leadership/gurpreet-singh.jpg",
};

const profiles: Record<string, LeaderOverrides> = {
  "Navin Gupta": {
    journey: [{ text: "Founder Member — FAIITA" }],
    companies: [{ name: "Krishna Agencies", url: "https://share.google/OO6mU5G9ffrri2Rkq" }],
    location: "Patna & Ranchi",
    phone: "+91 93347 15522",
    bio: "In the stationery business since 1964 and in IT since 1980, spanning retail, distribution, government, and corporate business. Member of Rotary Pataliputra and the Indian Cancer Society.",
  },
  "Liju P Raju": lijuPRajuProfile,
  "Praful Desai": {
    journey: [{ text: "Past President — FITAG (Federation of Information Technology Association of Gujarat)" }],
    companies: [{ name: "Anjali Infocom India", url: "https://share.google/uqBa72Tk08RIy7ouT" }],
    location: "Rajkot, Gujarat",
    website: "https://www.anjalirajkot.com",
    email: "info@anjalirajkot.com",
    phone: "+91 99099 53131",
    imageUrl: "/leadership/praful-desai.jpeg",
  },
  "Sanjeev Walia": {
    journey: [{ text: "Chairman — PACT (Punjab Association of Computer Traders)" }],
    companies: [{ name: "Jetage Computer Traders", url: "https://share.google/iwE1vp7fnwd7y4iNC" }],
    location: "Chandigarh, India",
    website: "https://www.jetageindia.in",
    email: "jetage17@gmail.com",
    phone: "+91 98149 58290",
    imageUrl: "/leadership/sanjeev-walia.jpeg",
  },
  "Deepak Bommisetty": {
    journey: [
      { text: "President — CDAN (Nellore, Andhra Pradesh)" },
      { text: "Founder Member — FAIITA" },
      { text: "Past Joint Secretary & Past Vice President (South) — FAIITA" },
    ],
    companies: [{ name: "SV Computers and Gadgets", url: "https://share.google/rIpZ5irkQ35L50KEF" }],
    location: "Nellore, Tirupati & Bangalore",
    phone: "+91 98481 75765",
    bio: "As OB Joint Secretary, coordinates FAIITA's press, social media, and promotional activities.",
  },
  "Naveen Gupta": {
    journey: [{ text: "Immediate Past President — Jammu Computer Dealers Association" }],
    companies: [{ name: "NR Computer Care LLP", url: "https://share.google/1Aa7ejjJkBIFV0Sfo" }],
    location: "Jammu",
    email: "busyjammu@gmail.com",
    phone: "+91 94191 83670",
  },
  "Koushik Pandya": {
    name: "Kaushik Pandya",
    journey: [
      { text: "Past President & Advisor — FAIITA" },
      { text: "Founder President — FITAG (Federation of IT Associations of Gujarat)" },
      { text: "Past President — ACMA (Ahmedabad Computer Merchants Association)" },
    ],
    companies: [{ name: "Kalp Systems", url: "https://share.google/oLYrKm5zQNnQZMNQt" }],
    location: "Ahmedabad, Gujarat",
    email: "kaushik@kalpsystems.com",
    phone: "+91 98250 31502",
    bio: "Electronics engineer and IT entrepreneur, running Kalp Systems — an IT security, solutions, and services company in Ahmedabad — for the last 36 years. Certified National Cyber Security Scholar (ISAC), NSD-certified cyber security governance professional, ISO 27001:2022 Lead Auditor, and consulting CISO & CIO to enterprises, corporates, NGOs, hospitals, and educational institutes.",
  },
  "Arun Dey": {
    name: "Arun Kumar Dey",
    journey: [
      { text: "Past President — IT Association of Orissa" },
      { text: "Founding Member — FAIITA" },
    ],
    companies: [{ name: "Computer Professional", url: "https://share.google/cTJ7IkChnqSUcGARo" }],
    website: "https://www.computerprofessional.in",
    email: "arunkd99@yahoo.com",
    phone: "+91 94370 33436",
  },
  "Sulalith Gupta": {
    name: "Sulalit Gupta",
    journey: [{ text: "Technology Solutions Providers Association (TECSPA), Chandigarh" }],
    companies: [{ name: "Global Systems", url: "https://share.google/3yQzZEb5MTy3iuvY8" }],
    location: "Chandigarh, India",
    email: "sulalitg@hotmail.com",
    phone: "+91 98148 82284",
  },
  "Paresh Salgaonkar": {
    journey: [
      { text: "Immediate Past President — GIBA (Goa IT Business Association)" },
      { text: "Managing Committee Member — GIBA" },
    ],
    companies: [{ name: "Suman Enterprises" }],
    location: "Porvorim, Goa",
    email: "pareshrs@gmail.com",
    phone: "+91 98221 39536",
  },
  "Neeraj Agarwal": {
    name: "Neeraj Agrawal",
    journey: [{ text: "COMPASS (Computer Association of Eastern India), estd. 1993" }],
    companies: [{ name: "Nimbus Computer Pvt Ltd", url: "https://share.google/vKrnLDZnAvuUKLpq8" }],
    location: "Weston Street, Kolkata",
    website: "https://shop.nimbus.in",
    email: "neeraj@nimbus.in",
    phone: "+91 98300 55055",
  },
  "S. Karthikeyan": {
    journey: [
      { text: "Charter President — CONFED-ITA (Tamil Nadu & Pondicherry)" },
      { text: "Founder Member — FAIITA" },
    ],
    companies: [{ name: "Bloom Electronics Pvt Ltd", url: "https://share.google/7Y3wscgOjrwEfvamA" }],
    location: "Chennai & Coimbatore, Tamil Nadu",
    website: "https://bloomonline.in",
    phone: "+91 88830 44433",
    bio: "In the IT industry since 1991, Bloom Electronics develops software for major Fortune 500 companies. He is a director of the second-greenest building in the world, located in Coimbatore.",
    imageUrl: "/leadership/karthikeyan-shanmugam.jpg",
  },
  "Susheel Kumar": {
    name: "Sushil Kumar",
    journey: [{ text: "State Coordinator (Jharkhand) — Jharkhand Computer Traders Association" }],
    companies: [{ name: "Micro Infosolutions Pvt Ltd", url: "https://share.google/DrS4BONR09EnprMfw" }],
    location: "Ranchi, Jharkhand",
    email: "sushil@mipl.net",
    phone: "+91 92346 12444",
    imageUrl: "/leadership/sushil-kumar.jpg",
  },
  "Dharmesh Negandhi": {
    role: "Joint Treasurer",
    journey: [{ text: "Mahakaushal Computer Dealers' Association" }],
    companies: [{ name: "Multitech Computer", url: "https://share.google/jJgjVCucFTUtybdvT" }],
    location: "Jabalpur, Madhya Pradesh",
    email: "multitechjbp@gmail.com",
    phone: "+91 94251 53283",
  },
  "Pawan Agarwal": {
    name: "Pawan Kr Agarwalla",
    journey: [{ text: "Past President — North East Computer Association (NECTA)" }],
    companies: [{ name: "Datamation" }],
    location: "Guwahati, Assam",
    email: "pkghy1962@gmail.com",
    phone: "+91 94350 47633",
  },
  "Sugreev Singh Ranawat": {
    journey: [
      { text: "Chairman — New Opportunities, FAIITA" },
      { text: "Immediate Past President — Rajasthan Computer Traders Association (RCTA)" },
    ],
    companies: [
      { name: "Super Sonic" },
      { name: "Rajshree Systems" },
    ],
    location: "Jaipur, Rajasthan",
    email: "rajshreesystems.udaipur@gmail.com",
    phone: "+91 94140 72413",
  },
  "Kuldeep S Verma": {
    name: "Kuldeep Singh",
    journey: [{ text: "SITDA (Shimla IT Dealer Association), Himachal Pradesh" }],
    companies: [
      { name: "Global Netcom" },
      { name: "Global E-Store" },
    ],
    location: "Shimla, Himachal Pradesh",
    website: "https://www.globalestore.in",
    email: "kuldeep@globalestore.in",
    phone: "+91 94180 45351",
  },
  // Past-GB (2022–24) records of members who also appear in the current term
  // under a differently spelled DB name — same person, same profile.
  "Liju R": lijuPRajuProfile,
  "Samir Parekh": samirParekhProfile,
  "Gurpreet Singh": gurpreetSinghProfile,
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
    companies: [{ name: "TechnoPlus Systems" }],
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
  {
    id: "extra-pratheesh-mathew",
    name: "Pratheesh Mathew",
    role: "GB Member",
    associationName: null,
    stateName: "Tamil Nadu",
    email: "info@phoenixinfoways.com",
    phone: "+91 98433 83052",
    bio: null,
    term: "2025–2027",
    imageUrl: "/leadership/pratheesh-mathew.jpg",
    journey: [
      { text: "CONFED-ITA (Confederation of Information Technology Associations), Tamil Nadu & Puducherry" },
    ],
    companies: [{ name: "Phoenix Infoways", url: "https://share.google/x92PhbS0XkjAkmB6V" }],
    location: "Coimbatore & Tirupur, Tamil Nadu",
    website: "https://www.phoenixinfoways.com",
  },
  {
    id: "extra-shiv-shankar-singh",
    name: "Shiv Shankar Singh",
    role: "GB Member",
    associationName: null,
    stateName: "Uttar Pradesh",
    email: "marketing@securenetcables.com",
    phone: "+91 73090 30979",
    bio: null,
    term: "2025–2027",
    imageUrl: "/leadership/shiv-shankar-singh.jpg",
    journey: [{ text: "UPCDWA (Uttar Pradesh Computer Dealers Welfare Association)" }],
    companies: [
      { name: "Stek Systems Pvt Ltd", url: "https://share.google/XgR08LCrYvxOlvGe0" },
      { name: "Securenet Technologies Pvt Ltd", url: "https://share.google/x5RtGIf43pmsaRlb7" },
    ],
    location: "Uttar Pradesh & Delhi",
    website: "https://www.securenetcables.com",
  },
  {
    id: "extra-rajesh-tomar",
    name: "Rajesh Tomar",
    role: "GB Member",
    associationName: null,
    stateName: "Uttarakhand",
    email: "unisoft_san@yahoo.co.in",
    phone: "+91 94120 58404",
    bio: "In the IT business since 1998, with an outlet at Rajpur Road, Dehradun.",
    term: "2025–2027",
    imageUrl: "/leadership/rajesh-tomar.jpg",
    journey: [{ text: "UITTA (Uttaranchal IT Traders Association)" }],
    location: "Dehradun, Uttarakhand",
  },
  {
    id: "extra-santosh-ghindwani",
    name: "Santosh Ghindwani",
    role: "GB Member",
    associationName: null,
    stateName: "Chhattisgarh",
    email: "itsolutionsraipur@gmail.com",
    phone: "+91 93009 07500",
    bio: null,
    term: "2025–2027",
    imageUrl: "/leadership/santosh-ghindwani.jpg",
    journey: [{ text: "CCMDA (Chhattisgarh Computer & Media Dealer Association)" }],
    companies: [{ name: "IT Solutions", url: "https://share.google/iBUu6O05AKILjwkWQ" }],
    location: "Raipur, Chhattisgarh",
  },
  {
    id: "extra-mahinder-aggarwal",
    name: "Mahinder Aggarwal",
    role: "GB Member",
    associationName: null,
    stateName: "Delhi",
    email: "broadwaydelhi@gmail.com",
    phone: "+91 92121 27937",
    bio: null,
    term: "2025–2027",
    imageUrl: "/leadership/mahinder-aggarwal.jpg",
    journey: [{ text: "President — ADCTA (All Delhi Computer Traders Association)" }],
    companies: [{ name: "Broadway Computers", url: "https://share.google/p8D4o65v9BTdl0ypK" }],
    location: "Nehru Place, New Delhi",
  },
];

export function withLeaderProfile<
  T extends {
    name: string;
    role?: string | null;
    imageUrl?: string | null;
    email?: string | null;
    phone?: string | null;
    bio?: string | null;
  }
>(leader: T): T & LeaderExtras {
  const p = profiles[leader.name];
  if (!p) return leader;
  const { journey, companies, location, website, ...overrides } = p;
  return { ...leader, ...overrides, journey, companies, location, website };
}
