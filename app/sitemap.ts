import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.faiita.co.in";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/about",
    "/about/vision-mission",
    "/about/about-faiita",
    "/about/leadership",
    "/about/state-associations",
    "/about/member-associations",
    "/resources/news",
    "/resources/events",
    "/resources/gallery",
    "/resources/newsletter",
    "/contact",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [states, news, events, newsletters] = await Promise.all([
    prisma.stateAssociation.findMany({ select: { slug: true } }),
    prisma.news.findMany({ select: { slug: true, publishedAt: true } }),
    prisma.event.findMany({ select: { slug: true, startDate: true } }),
    prisma.newsletter.findMany({ select: { slug: true, issueDate: true } }),
  ]);

  return [
    ...staticRoutes,
    ...states.map((s) => ({ url: `${siteUrl}/about/state-associations/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...news.map((n) => ({ url: `${siteUrl}/resources/news/${n.slug}`, lastModified: n.publishedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...events.map((e) => ({ url: `${siteUrl}/resources/events/${e.slug}`, lastModified: e.startDate, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...newsletters.map((n) => ({ url: `${siteUrl}/resources/newsletter/${n.slug}`, lastModified: n.issueDate, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}
