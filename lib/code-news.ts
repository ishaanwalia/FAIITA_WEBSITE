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
  {
    id: "code-news-faiita-patrika-2025-26",
    slug: "faiita-patrika-2025-26-released",
    title: "FAIITA Patrika 2025–26 Released, Covering IT Association Activities Across India",
    excerpt:
      "FAIITA Patrika 2025–26, published by the Federation of All India IT Associations, documents key activities, leadership messages, and industry trends shaping India's IT channel ecosystem.",
    category: "Press Release",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2026-04-01T09:00:00+05:30"),
    coverImage: "/images/gallery/faiita-patrika-launch-2025-26-01.jpg",
    heroImage: "/images/gallery/faiita-patrika-launch-2025-26-01.jpg",
    sourceUrl: "/resources/newsletter",
    content: [
      "FAIITA Patrika 2025–26, published by the Federation of All India IT Associations, has been released, covering IT association activities across India.",
      "The edition documents key activities, leadership messages, and industry trends shaping India's IT channel ecosystem, giving member state associations and the wider IT trade community a single, consolidated view of the federation's work through the year.",
      "Every issue of FAIITA Patrika is available to read online in the federation's newsletter archive.",
    ].join("\n\n"),
  },
  {
    id: "code-news-ncn-meet-new-delhi-2024",
    slug: "faiita-meets-national-computer-news-new-delhi-2024",
    title: "FAIITA Leadership Meets National Computer News (NCN) Team in New Delhi",
    excerpt:
      "FAIITA leadership held a meeting with the National Computer News (NCN) team in New Delhi in 2024, strengthening ties with one of the IT trade's leading media platforms.",
    category: "Events",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2024-07-01T09:00:00+05:30"),
    coverImage: "/images/gallery/ncn-meet-new-delhi-2024-01.jpg",
    heroImage: "/images/gallery/ncn-meet-new-delhi-2024-02.jpg",
    sourceUrl: null,
    content: [
      "FAIITA leadership met with the National Computer News (NCN) team in New Delhi in 2024, as part of the federation's ongoing engagement with media platforms serving India's IT trade community.",
      "The meeting brought together representatives of FAIITA and NCN to discuss coverage of the IT channel ecosystem and ways to keep the trade community informed of developments across the federation's member states.",
    ].join("\n\n"),
  },
  {
    id: "code-news-it-india-expo-2025-ludhiana",
    slug: "it-india-expo-2025-ludhiana",
    title: "IT India Expo 2025 Draws Massive Response in Ludhiana; Inaugurated by Punjab Finance Minister S. Harpal Singh Cheema",
    excerpt:
      "The IT India Expo 2025, held in Ludhiana from 22–24 August, was inaugurated by Punjab Finance Minister S. Harpal Singh Cheema and drew thousands of visitors across its three-day run.",
    category: "Events",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2025-08-25T09:00:00+05:30"),
    coverImage: "/images/gallery/it-india-expo-2025-ludhiana-02.jpg",
    heroImage: "/images/gallery/it-india-expo-2025-ludhiana-03.jpg",
    sourceUrl: null,
    content: [
      "Ludhiana, August 2025 — The much-awaited IT India Expo 2025 was successfully held in Ludhiana from 22nd to 24th August at Hotel Regenta Classik. The mega IT showcase was inaugurated by the Chief Guest, Honourable Finance Minister of Punjab, S. Harpal Singh Cheema, in the presence of eminent leaders and industry stakeholders.",
      "The event was jointly hosted by the Association of Computer Entrepreneurs (ACE) – Ludhiana, in collaboration with PACT (Punjab Association of Computer Traders) and FAIITA (Federation of All India IT Associations). The inaugural ceremony witnessed the participation of prominent dignitaries, including Kulwant Singh Sidhu (Local MLA), Navin Gupta (All India FAIITA President), Sanjeev Walia (Secretary, FAIITA), Gurpreet Singh Sunny (Chairman, PACT), Prem Saini (President, PACT), Gurpreet Singh (President, ACE) and Devesh Rastogi (Past President FAIITA) among others.",
      "In his address, Finance Minister Harpal Singh Cheema emphasized the government's vision to make Punjab a growing hub for information technology. \"The government is continuously making efforts to promote the IT sector in the state. A large IT hub will soon be developed in Punjab, and these initiatives will be expanded across multiple regions of the state,\" he said. The Minister also lauded the efforts of ACE, PACT, and FAIITA for bringing together the IT community through such a platform.",
      "The three-day expo attracted thousands of visitors, including IT professionals, entrepreneurs, distributors, and students, who witnessed cutting-edge technologies and innovations across the IT sector. The exhibition showcased the latest products, solutions, and services from leading IT companies and provided a valuable networking platform for industry players.",
      "Vice President - ACE, Devinder Mehandru, expressed his delight over the overwhelming response. \"The IT India Expo 2025 was a grand success, with tremendous participation from exhibitors and visitors alike. Looking at the encouraging response, we are committed to organizing more such events in the future to keep strengthening the IT ecosystem in the region,\" he said.",
      "With its successful execution, IT India Expo 2025 has established itself as one of the most prominent IT trade events in North India, reinforcing Ludhiana's position as a rapidly growing technology and business hub.",
    ].join("\n\n"),
  },
  {
    id: "code-news-faiita-agm-2020-ahmedabad",
    slug: "faiita-agm-2020-ahmedabad",
    title: "FAIITA Holds Annual General Meeting 2020 in Ahmedabad, Hosted by FITAG",
    excerpt:
      "FAIITA's Annual General Meeting was held on 10th January 2020 at Ahmedabad, hosted by FITAG, bringing together delegates of member state associations from across India.",
    category: "Events",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2020-01-10T11:00:00+05:30"),
    coverImage: "/images/gallery/faiita-agm-2020-ahmedabad-01.jpg",
    heroImage: "/images/gallery/faiita-agm-2020-ahmedabad-05.jpg",
    sourceUrl: null,
    content: [
      "The Federation of All India Information Technology Associations (FAIITA) held its Annual General Meeting on 10th January 2020 at the Marriott Courtyard's Shaan Convention Hall in Ahmedabad, hosted by FITAG (Federation of IT Associations of Gujarat).",
      "Delegates and office bearers of FAIITA's member state associations travelled from across the country to attend the AGM, with proceedings opened by a traditional lamp-lighting ceremony followed by welcome addresses from the host association.",
      "The meeting featured presentations from member associations and partners, including an update on COMPUTEX Taipei 2020, as well as sessions from exhibitors showcasing CCTV surveillance and VR/AR-based training technology on the sidelines of the event.",
      "Platinum sponsor Enjay, along with Silver Sponsors including ASUS and eMedical, and media partner National Computer News (NCN), supported the AGM, underlining the continued backing of the IT trade and technology ecosystem for FAIITA's federating mission.",
    ].join("\n\n"),
  },
  {
    id: "code-news-cmda-pune-it-expo-2020",
    slug: "cmda-pune-it-expo-2020",
    title: "FAIITA Represented at CMDA Pune IT Expo 2020 B2B",
    excerpt:
      "FAIITA President Kaushik Pandya and National Convenor Sanjeev Walia represented the federation at the CMDA IT-Expo 2020 B2B in Pune, engaging district IT associations from across Maharashtra.",
    category: "Events",
    featured: false,
    isDemo: false,
    publishedAt: new Date("2020-02-11T10:00:00+05:30"),
    coverImage: "/images/gallery/cmda-pune-it-expo-2020-02.jpg",
    heroImage: "/images/gallery/cmda-pune-it-expo-2020-01.jpg",
    sourceUrl: null,
    content: [
      "CMDA Pune organized \"CMDA IT-Expo 2020 B2B\" at Hotel Conrad, Pune, Maharashtra, on 11th and 12th February 2020. A two-member delegation from FAIITA — President Kaushik Pandya and National Convenor Sanjeev Walia — travelled from Ahmedabad and Chandigarh respectively to represent the federation.",
      "At the inaugural ceremony, CMDA Pune President Mr. Kausar Dabhia invited FAIITA President Kaushik Pandya to deliver the inaugural address, in which Mr. Pandya presented the vision of FAIITA and of the IT industry more broadly. The ceremony's Chief Guest was Mr. Sanjay Saha, National Sales Head (Hyderabad) of Redington India Ltd, with Mr. Jayant Goradia as Guest of Honour.",
      "The FAIITA delegation toured the exhibitors' stalls at the expo and interacted with participants, amid a significant presence of dignitaries from district IT associations across Maharashtra — including Mumbai, Pune, Dhule, Satara, Latur, Jalgaon, Sangli and Bhusawal.",
      "FAIITA subsequently organized a meeting with the office bearers of these district associations, convened by National Convenor Sanjeev Walia. President Kaushik Pandya presented FAIITA's vision, the benefits of district and state associations joining the federation directly, and the functioning of FAIITA's task committees — a meeting CMDA President Kausar Dabhia welcomed with gratitude.",
      "Alongside the expo, National Computer News (NCN) held its Channel Partners Summit 2020, featuring a group discussion in which FAIITA's Founder President and Chief Mentor, Mr. Champak Raj Gurjar, presented the federation's achievements and roadmap. NCN also invited the FAIITA delegation to present awards to winners at the summit.",
      "On 12th February, National Convenor Sanjeev Walia travelled to Mumbai to meet TAIT President Mr. Samir Parekh and State Co-ordinator Mr. Praveen Dhoka, discussing plans for an exhibition committee and a membership drive to enroll all 23 district IT associations of Maharashtra under the FAIITA banner.",
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
