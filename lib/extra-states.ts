import type { StateAssociation } from "@prisma/client";

/**
 * State-association rows that exist in prisma/seed.ts but not yet in the
 * production DB — direct DB writes are permission-gated (the same reason the
 * full reseed is pending), so newly added associations ship code-side and are
 * merged into every state-association query. Idempotent: once the reseed
 * inserts a real row with the same slug, the code-side copy is skipped and
 * the entry can be deleted.
 */
const extraStates: StateAssociation[] = [
  // AISIE — all-India manufacturers' body added July 2026 (matches seed.ts).
  {
    id: "code-aisie",
    slug: "aisie",
    stateName: "Delhi",
    stateCode: "DL",
    region: "North",
    associationName: "All India Small IT & Electronics Manufacturers Association (AISIE)",
    foundedYear: 2025,
    memberCount: 500,
    presidentName: null,
    secretaryName: null,
    contactEmail: "president@aisie.org",
    secretaryEmail: "secretariat@aisie.org",
    contactPhone: null,
    websiteUrl: "https://www.aisie.org",
    address: "1105, 11th Floor, KLJ Towers North, Netaji Subhash Place, Delhi 110034",
    description: [
      "The All-India Small IT & Electronics Manufacturers Association (AISIE) is a national industry body representing MSMEs engaged in the IT and electronics manufacturing sector. AISIE is dedicated to strengthening domestic manufacturing under the Make in India and Digital India initiatives by promoting innovation, skill development, regulatory compliance, government procurement opportunities, and global market access. The Association serves as a collaborative platform for manufacturers, suppliers, and technology enterprises, enabling sustainable growth, industry collaboration, and enhanced competitiveness.",
      "Our Vision:\nTo build a globally competitive, innovation-driven, and self-reliant IT & Electronics manufacturing ecosystem that empowers MSMEs and contributes to India's manufacturing excellence.",
      "Our Mission:\n• Promote Make in India through indigenous manufacturing and local value addition.\n• Support MSMEs with compliance guidance, training, and business opportunities.\n• Enhance market access through government procurement, trade fairs, and international collaborations.\n• Encourage quality, innovation, and sustainable manufacturing practices.\n• Foster collaboration among manufacturers, suppliers, and industry stakeholders.",
    ].join("\n\n"),
    logoUrl: "/logos/state/aisie.png",
    mapX: 37,
    mapY: 25,
    isCovered: true,
    createdAt: new Date("2026-07-18"),
    updatedAt: new Date("2026-07-18"),
  },
];

/** Merge code-side rows into a DB result, skipping slugs the DB already has. */
export function withExtraStates<T extends { slug: string }>(states: T[]): (T | StateAssociation)[] {
  const present = new Set(states.map((s) => s.slug));
  return [...states, ...extraStates.filter((e) => !present.has(e.slug))];
}

/** Code-side counterpart of findUnique({ where: { slug } }) for extra rows. */
export function findExtraState(slug: string): StateAssociation | null {
  return extraStates.find((e) => e.slug === slug) ?? null;
}
