/**
 * Real news posts shipped code-side — the production reseed is
 * permission-gated (see lib/state-overrides.ts), so these merge into the DB
 * rows at render time via mergeNews(). Slugs are deduped against the DB, so
 * once a reseed lands these as real rows the merge becomes a no-op.
 */
export type CodeNewsItem = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string | null;
  heroImage: string | null;
  sourceUrl: string | null;
  featured: boolean;
  isDemo: boolean;
  publishedAt: Date;
};

export const codeNews: CodeNewsItem[] = [
  {
    id: "code-news-faiita-election-2025",
    slug: "faiita-election-2025-new-team-lucknow",
    title: "FAIITA Elects New Leadership for 2025–27; Navin Gupta Takes Charge as President",
    excerpt:
      "At the federation's election held in Lucknow, member state associations elected FAIITA's new President and team for the 2025–27 tenure, with Navin Gupta taking charge as President and Devesh Rastogi as Chairman.",
    category: "Press Release",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2025-07-01T09:00:00+05:30"),
    coverImage: "/images/news/faiita-election-2025-lucknow.jpg",
    heroImage: "/images/news/faiita-election-2025-lucknow-2.jpg",
    sourceUrl: null,
    content: [
      "The Federation of All India Information Technology Associations (FAIITA) held its election for President and the national team at Lucknow in 2025, with delegates of member state associations from across the country participating in the proceedings.",
      "Mr. Navin Gupta was elected President of FAIITA for the 2025–27 tenure, succeeding Mr. Devesh Rastogi, who now serves the federation as Chairman.",
      "The office bearers for 2025–27 are: Mr. Navin Gupta (President), Mr. Liju P Raju (Senior Vice President), Mr. Praful Desai (Vice President), Mr. Sanjeev Walia (Secretary), Mr. Deepak Bommisetty (Joint Secretary), Mr. Naveen Gupta (Treasurer), Mr. Dharmesh Negandhi (Joint Treasurer), Mr. Devesh Rastogi (Chairman) and Mr. Koushik Pandya (Advisor, Past President).",
      "The Governing Body for the term further comprises Mr. Arun Dey, Mr. Pawan Agarwal, Mr. Sulalith Gupta, Mr. Neeraj Agarwal, Mr. Kuldeep S Verma, Mr. S. Karthikeyan, Mr. Susheel Kumar, Mr. Paresh Salgaonkar and Mr. Sugreev Singh Ranawat as GB Members.",
      "The new team takes charge with a mandate to strengthen the offline IT channel ecosystem, deepen brand engagement and represent the interests of IT traders across all member states.",
    ].join("\n\n"),
  },
  {
    id: "code-news-india-it-mall-2024",
    slug: "india-it-mall-launch-defence-minister-2024",
    title: "India IT Mall Launched by Hon'ble Defence Minister Shri Rajnath Singh",
    excerpt:
      "FAIITA's flagship India IT Mall initiative reached a landmark moment in 2024 with its launch at the hands of Hon'ble Defence Minister Shri Rajnath Singh.",
    category: "Events",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2024-01-15T10:15:00+05:30"),
    coverImage: "/images/news/india-it-mall-launch-2024.jpg",
    heroImage: "/images/news/india-it-mall-launch-2024.jpg",
    sourceUrl: null,
    content: [
      "In a landmark moment for India's IT trading community, the India IT Mall was launched in 2024 by the Hon'ble Defence Minister of India, Shri Rajnath Singh, in the presence of FAIITA leadership and members of the IT channel fraternity.",
      "India IT Mall is FAIITA's flagship initiative to give IT traders modern, organised retail infrastructure — bringing dealers, distributors and service providers together under one roof and giving customers a trusted, single destination for technology products and services.",
      "The launch by the Hon'ble Defence Minister underscored the government's recognition of the IT trading community's role in India's digital economy, and marked a major milestone in the federation's mission to strengthen and future-proof the offline IT channel.",
    ].join("\n\n"),
  },
];

/** Merge code-side news into DB rows: dedupe by slug (DB wins), newest first. */
export function mergeNews<T extends { slug: string; publishedAt: Date }>(
  dbNews: T[],
): (T | CodeNewsItem)[] {
  const seen = new Set(dbNews.map((n) => n.slug));
  return [...dbNews, ...codeNews.filter((n) => !seen.has(n.slug))].sort(
    (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime(),
  );
}

export function findCodeNews(slug: string): CodeNewsItem | undefined {
  return codeNews.find((n) => n.slug === slug);
}
