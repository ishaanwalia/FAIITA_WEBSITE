/**
 * Display-level overrides for state association rows, keyed by slug — the
 * same stopgap pattern as `statFixes` / `normalizeZone`. The production DB
 * reseed is pending (permission-gated), so verified corrections shipped in
 * prisma/seed.ts are mirrored here to show immediately. Idempotent: once the
 * reseed runs these become no-ops and the entries can be deleted.
 */
type StateOverride = {
  associationName?: string;
  foundedYear?: number | null;
  memberCount?: number;
  presidentName?: string | null;
  contactEmail?: string | null;
  secretaryEmail?: string | null;
  contactPhone?: string | null;
  websiteUrl?: string | null;
  description?: string | null;
  logoUrl?: string | null;
};

const overrides: Record<string, StateOverride> = {
  // CMDA Mumbai — verified details supplied July 2026 (matches seed.ts).
  maharashtra: {
    foundedYear: 1981,
    memberCount: 225,
    presidentName: "Samir Parekh",
    contactEmail: "Brain2@ymail.com",
    secretaryEmail: "devang@3findia.com",
    contactPhone: null,
    websiteUrl: "https://www.cmdamumbai.in",
    description: [
      "CMDA Mumbai is a premier IT channel association in Maharashtra, recently revitalised into a highly active hub of collaboration. Under the visionary guidance of industry leaders, it unites IT business owners, resellers, system integrators, cybersecurity experts and hardware manufacturers across Mumbai. The association serves as a powerful collective voice — driving networking, financial literacy and regulatory advocacy to empower Mumbai's technology trade community.",
      "Founded in 1981 and registered under the Ministry of Corporate Affairs as Computer Media Dealers' Association, CMDA Mumbai today brings together nearly 225 senior, reputable business owners — under recent leadership the association grew its active base from a dwindling 25 members to its current strength.",
    ].join("\n\n"),
  },
  // JCDA Jammu — verified details supplied July 2026 (matches seed.ts).
  "jammu-kashmir": {
    associationName: "Jammu Computer Dealer Association (Regd.)",
    foundedYear: 2005,
    memberCount: 120,
    presidentName: "Mahajan Atul",
    contactEmail: "mahajanatul136@gmail.com",
    secretaryEmail: "drgopalpsharma@gmail.com",
    contactPhone: "9419188409",
    websiteUrl: "http://jcdajammu.com/",
    description: "Jammu Computer Dealer Association (Regd.) popularly known as JCDA is the representative body of IT Dealers in Jammu province covering ten districts of Jammu & Kashmir. JCDA has always stood for ethical business and has fought for the cause of IT fraternity. Apart from representing its members, the association is actively involved in social activities. As member of FAIITA, JCDA has represented Jammu and Kashmir at national level as and when required.",
  },
  // UITTA Uttarakhand — verified details supplied July 2026 (matches seed.ts).
  uttarakhand: {
    associationName: "Uttaranchal IT Traders Association (UITTA)",
    foundedYear: 2001,
    memberCount: 120,
    presidentName: null,
    contactEmail: "president@uitta.org",
    secretaryEmail: null,
    contactPhone: null,
    websiteUrl: null,
    description: "UITTA is a group of individuals who come together with a shared vision and common purpose established in year 2001. We as UITTA promotes unity, cooperation and support to their members and also collective efforts for the betterment of our members.",
  },
  // ASIRT Maharashtra — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-asirt": {
    associationName: "Association Of System Integrators & Retailers in Technology (ASIRT), Mumbai",
    foundedYear: 2012,
    memberCount: 270,
    presidentName: null,
    contactEmail: "president@asirt.in",
    secretaryEmail: "secretary@asirt.in",
    contactPhone: null,
    websiteUrl: "https://www.asirt.in",
    description: "ASIRT (Association of System Integrators and Retailers in Technology) is one of India's most dynamic IT channel associations, dedicated to empowering System Integrators, Solution Providers, Retailers, Cloud Partners, and IT Services companies. Founded in Mumbai and serving the IT community since 2012, ASIRT provides a powerful platform for collaboration, networking, business growth, and knowledge sharing.\n\nWith a vibrant community of over 270 members, ASIRT brings together technology entrepreneurs and business leaders to create meaningful partnerships and new business opportunities. Through regular technology seminars, business conclaves, training programs, consortium initiatives, and industry interactions, ASIRT helps members evolve, expand, and stay ahead in a rapidly changing technology landscape.\n\nASIRT also acts as a strong voice for the IT channel community, facilitating engagement with OEMs and vendors, addressing member grievances, and fostering a healthy and profitable business ecosystem. Beyond business, ASIRT nurtures a spirit of camaraderie through events such as the ASIRT Synergy Biz Conclave, ACPL cricket tournament, social gatherings, and family-oriented activities.\n\nDriven by its philosophy of Partner, Progress, and Evolve, ASIRT continues to build a unified, future-ready IT partner ecosystem where members learn, grow, and win together.",
  },
  // TAIT Maharashtra — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-tait": {
    associationName: "Trade Association Of Information Technology (TAIT)",
    foundedYear: 1996,
    memberCount: 450,
    presidentName: null,
    contactEmail: "president@tait.in",
    secretaryEmail: "swetal@megamaninfo.com",
    contactPhone: null,
    websiteUrl: "https://www.tait.in",
    description: "Trade Association of Information Technology (TAIT) was formed in March 1996 to represent the interest of IT community in the ecosystem of Distributors / Sub-distributors / Resellers, System Integrators & Service Providers.\n\nTAIT has over 450+ members representing the complete spectrum of IT organizations. The association was formed to uphold the larger interest of the IT trade, which represents 70% of Mumbai's IT industry. It's a forum where the challenges of Mumbai's domestic IT Industry business is heard and understood. TAIT is a pro-active, leading IT association of India.\n\nTAIT enjoys cordial relations with all OEMs. TAIT's role has also been lauded by various IT / non IT media on several occasions and partnered with them from time to time. TAIT is also fortunate to have very resourceful members who bring in expertise to share their perspective with fellow members. TAIT has very cordial working relationship with other representative associations like MAIT, NASSCOM, IMC and work closely with them on issues related to IT industry.\n\nTAIT over the past years have interacted with state Government Departments, Central Government Departments to brief and resolution of IT channel community business challenges. It continues to do so in future.\n\nTAIT has its own office in Mumbai managed by professional team. It has team of consultants on board on various taxation and policy matters.\n\nTAIT organizes regular meetings on member's issues like non-payments / warranty / service, SI meet, Technology sessions, Product Promotion meets, and Media Meets. It sponsors ICT events / meets organized by the government, IT media, and industry players at regional & national level. TAIT Knowledge Series Events focus on Seminars / workshops on technology awareness and professional / personal skills development of the member community.",
  },
  // GIBA Goa — verified details supplied July 2026 (matches seed.ts).
  goa: {
    foundedYear: 1996,
    memberCount: 105,
    presidentName: null,
    contactEmail: "gibaofficegoa@gmail.com",
    secretaryEmail: null,
    contactPhone: null,
    websiteUrl: "https://gibagoa.co.in",
    description: "Goa IT Business Association (GIBA) was formed in the year 1996. GIBA has around 105 members at present and its primary objective is to offer guidance, support and most importantly an opportunity to grow their businesses.\n\nEvery year GIBA organises events such as Tech Days, Blood Donation Camps, GIBA Family Get-together and sports activities such as the GIBA Cricket event, technical training for GIBA members and their employees, medical check-up camps and more.\n\nGIBA's objective is to unite all the IT dealers of Goa and extend whatever help is needed to ensure they develop and grow their respective business in this highly competitive environment.\n\nGIBA has members from the fields of IT hardware, software, Internet Service Providers, CCTV and more.",
  },
  // JCTA Jharkhand — verified details supplied July 2026 (matches seed.ts).
  jharkhand: {
    logoUrl: "/logos/state/jcta.jpeg",
    foundedYear: 2007,
    memberCount: 145,
    presidentName: null,
    contactEmail: "president@jcta.org.in",
    secretaryEmail: "secretary@jcta.org.in",
    contactPhone: null,
    websiteUrl: "https://www.jcta.org.in",
    description: "The Jharkhand Computer Traders Association (JCTA) is the premier association representing the IT trade, dealers, distributors, and system integrators across Jharkhand. Dedicated to uniting the IT fraternity and fostering a collaborative ecosystem, JCTA plays a pivotal role in protecting local traders' interests, resolving business challenges, and bridging them with national bodies. Promoting ethical trade practices, our mission is to drive digital empowerment, technological growth, and support a robust, progressive IT trade ecosystem in the region.",
  },
  // VCMDWA Nagpur — verified details supplied July 2026 (matches seed.ts).
  "maharashtra-vcmdwa": {
    logoUrl: "/logos/state/vcmdwa.png",
    associationName: "Vidarbha Computer & Media Dealers Welfare Association (VCMDWA)",
    foundedYear: 1991,
    memberCount: 125,
    presidentName: "Dinesh Naidu",
    contactEmail: "dinesh@dineshnaidu.com",
    secretaryEmail: "lg40@hotmail.com",
    contactPhone: null,
    websiteUrl: "https://www.vcmdwa.org",
    description: "The Vidarbha Computer & Media Dealers Welfare Association (VCMDWA), established in 1991, is a registered charitable trust under the Societies Registration Act, 1860. It is one of Central India's most active and respected industry associations representing the interests of computer hardware, software, digital media, surveillance, and IT service providers.\n\nWith a robust network of over 125+ active members, VCMDWA functions as a non-profit, non-political body, promoting ethical business practices, industry collaboration, customer trust, and community welfare in the IT and electronics sector.",
  },
  // UPCDWA Uttar Pradesh — verified details supplied July 2026 (matches seed.ts).
  "uttar-pradesh": {
    logoUrl: "/logos/state/upcdwa.jpeg",
    foundedYear: 2014,
    memberCount: 550,
    presidentName: null,
    contactEmail: "president@upcdwa.com",
    secretaryEmail: "secretary@upcdwa.com",
    contactPhone: null,
    websiteUrl: "https://www.upcdwa.com",
    description: "The Uttar Pradesh Computer Dealers Welfare Association (UPCDWA) is the premier industry body representing IT hardware and software dealers, retailers, and distributors across the state of Uttar Pradesh. Operating under the national umbrella of the Federation of All India IT Associations (FAIITA) since 2014, the association unites over 550 members to give local IT businesses a collective voice.",
  },
  // PACT Punjab — verified details supplied July 2026 (matches seed.ts).
  punjab: {
    logoUrl: "/logos/state/pact.webp",
    associationName: "Punjab Association of Computer Traders (PACT)",
    foundedYear: 2012,
    memberCount: 800,
    presidentName: null,
    contactEmail: "president@pactpunjab.com",
    secretaryEmail: "secretary@pactpunjab.com",
    contactPhone: null,
    websiteUrl: "https://www.pactpunjab.com",
    description: "Punjab Association of Computer Traders - PACT is the apex body representing the IT trade across Punjab and Chandigarh. It unites computer dealers, distributors, system integrators, networking and surveillance solution providers and technology businesses on a common platform. PACT is committed to safeguarding the interests of the IT industry, promoting ethical business practices, fostering collaboration and representing the trade before government authorities and industry stakeholders. Through advocacy, networking and knowledge-sharing initiatives, PACT is working towards building a stronger, more progressive and future-ready IT ecosystem for Punjab. United for the Growth of Punjab's IT Industry.",
  },
};

export function applyStateOverrides<T extends { slug: string }>(state: T): T {
  const fix = overrides[state.slug];
  return fix ? { ...state, ...fix } : state;
}

/**
 * Associations removed from FAIITA's data in July 2026 — CCMDA (Chhattisgarh),
 * FITDAK (Karnataka) and CIMEIT (Delhi). prisma/seed.ts no longer carries
 * them, but the production rows survive until the next reseed, so every
 * state query filters them out here. Idempotent: once the reseed runs this
 * matches nothing and the set can be emptied.
 */
const removedStateSlugs = new Set(["chhattisgarh", "karnataka", "delhi-cimeit"]);

export function isRemovedStateSlug(slug: string): boolean {
  return removedStateSlugs.has(slug);
}

export function excludeRemovedStates<T extends { slug: string }>(states: T[]): T[] {
  return states.filter((s) => !removedStateSlugs.has(s.slug));
}
