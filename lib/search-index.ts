import { prisma } from "@/lib/prisma";

export type SearchEntry = {
  title: string;
  description: string;
  href: string;
  type: "Page" | "State Association" | "Member Association" | "News" | "Event" | "Newsletter";
};

const STATIC_PAGES: SearchEntry[] = [
  { title: "About FAIITA", description: "Our structure, history and how the federation works.", href: "/about/about-faiita", type: "Page" },
  { title: "Vision & Mission", description: "What we stand for and where we're headed.", href: "/about/vision-mission", type: "Page" },
  { title: "Leadership", description: "The Governing Body and office bearers.", href: "/about/leadership", type: "Page" },
  { title: "State Associations", description: "26 states, one federated network.", href: "/about/state-associations", type: "Page" },
  { title: "Member Associations", description: "Associations affiliated under FAIITA.", href: "/about/member-associations", type: "Page" },
  { title: "News & Announcements", description: "Federation updates, policy wins, and press releases.", href: "/resources/news", type: "Page" },
  { title: "Events", description: "Summits, AGMs and workshops.", href: "/resources/events", type: "Page" },
  { title: "Gallery", description: "Moments from across the federation.", href: "/resources/gallery", type: "Page" },
  { title: "Newsletter", description: "Our quarterly publication, FAIITA Patrika.", href: "/resources/newsletter", type: "Page" },
  { title: "Contact", description: "Get in touch or bring your state association into the federation.", href: "/contact", type: "Page" },
];

export async function getSearchIndex(): Promise<SearchEntry[]> {
  const live = { deletedAt: null };
  const [states, members, news, events, newsletters] = await Promise.all([
    prisma.stateAssociation.findMany({ where: live, select: { stateName: true, associationName: true, slug: true } }),
    prisma.memberAssociation.findMany({ where: live, select: { name: true, city: true, slug: true } }),
    prisma.news.findMany({ where: live, select: { title: true, excerpt: true, slug: true } }),
    prisma.event.findMany({ where: live, select: { title: true, description: true, slug: true } }),
    prisma.newsletter.findMany({ where: live, select: { title: true, description: true, slug: true } }),
  ]);

  return [
    ...STATIC_PAGES,
    ...states.map((s): SearchEntry => ({
      title: s.stateName,
      description: s.associationName,
      href: `/about/state-associations/${s.slug}`,
      type: "State Association",
    })),
    ...members.map((m): SearchEntry => ({
      title: m.name,
      description: m.city ?? "",
      href: `/about/member-associations/${m.slug}`,
      type: "Member Association",
    })),
    ...news.map((n): SearchEntry => ({
      title: n.title,
      description: n.excerpt,
      href: `/resources/news/${n.slug}`,
      type: "News",
    })),
    ...events.map((e): SearchEntry => ({
      title: e.title,
      description: e.description,
      href: `/resources/events/${e.slug}`,
      type: "Event",
    })),
    ...newsletters.map((n): SearchEntry => ({
      title: n.title,
      description: n.description ?? "",
      href: `/resources/newsletter/${n.slug}`,
      type: "Newsletter",
    })),
  ];
}
