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
    associationName: "Uttarakhand IT Trade Association (UITTA)",
    foundedYear: 2001,
    memberCount: 120,
    presidentName: null,
    contactEmail: "president@uitta.org",
    secretaryEmail: null,
    contactPhone: null,
    websiteUrl: null,
    description: "UITTA is a group of individuals who come together with a shared vision and common purpose established in year 2001. We as UITTA promotes unity, cooperation and support to their members and also collective efforts for the betterment of our members.",
  },
};

export function applyStateOverrides<T extends { slug: string }>(state: T): T {
  const fix = overrides[state.slug];
  return fix ? { ...state, ...fix } : state;
}
