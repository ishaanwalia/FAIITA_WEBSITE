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
};

export function applyStateOverrides<T extends { slug: string }>(state: T): T {
  const fix = overrides[state.slug];
  return fix ? { ...state, ...fix } : state;
}
