import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Images, Newspaper, BookOpen } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resources",
  description: "News, events, gallery and the FAIITA Patrika newsletter — everything the federation publishes, in one place.",
  alternates: { canonical: "/resources" },
};

export const revalidate = 3600;

export default async function ResourcesPage() {
  // One round trip rather than four sequential awaits — the four queries are
  // independent, and this page is the slowest thing on the route otherwise.
  const live = { deletedAt: null };
  const [allNews, events, galleryItems, newsletters] = await Promise.all([
    prisma.news.findMany({ where: live, orderBy: { publishedAt: "desc" } }),
    prisma.event.findMany({ where: live, orderBy: { startDate: "asc" } }),
    prisma.galleryAlbum.findMany({ where: live, orderBy: { order: "asc" }, include: { _count: { select: { photos: true } } } }),
    prisma.newsletter.findMany({ where: live, orderBy: { issueDate: "desc" }, take: 1 }),
  ]);

  const now = new Date();
  const upcoming = events.filter((e) => e.startDate >= now);
  const nextEvent = upcoming[0] ?? events[events.length - 1];
  const latestNews = allNews[0];
  const latestIssue = newsletters[0];
  const albumPhotos = galleryItems.reduce((n, a) => n + a._count.photos, 0);

  const sections = [
    {
      href: "/resources/news",
      icon: Newspaper,
      title: "News & Announcements",
      blurb: "Federation updates, policy wins and press releases.",
      count: `${allNews.length} ${allNews.length === 1 ? "story" : "stories"}`,
      latest: latestNews && {
        label: latestNews.title,
        meta: formatDate(latestNews.publishedAt),
      },
    },
    {
      href: "/resources/events",
      icon: CalendarDays,
      title: "Events",
      blurb: "Summits, AGMs, expos and workshops across the country.",
      count: upcoming.length > 0 ? `${upcoming.length} upcoming` : `${events.length} in the archive`,
      latest: nextEvent && {
        label: nextEvent.title,
        meta: formatDate(nextEvent.startDate),
      },
    },
    {
      href: "/resources/gallery",
      icon: Images,
      title: "Gallery",
      blurb: "Moments from conclaves, expos and state chapter meets.",
      count: `${galleryItems.length} albums · ${albumPhotos} photos`,
      latest: galleryItems[0] && {
        label: galleryItems[0].title,
        meta: `${galleryItems[0]._count.photos} photos`,
      },
    },
    {
      href: "/resources/newsletter",
      icon: BookOpen,
      title: "FAIITA Patrika",
      blurb: "Our quarterly publication, read online or downloaded.",
      count: `${newsletters.length} ${newsletters.length === 1 ? "issue" : "issues"}`,
      latest: latestIssue && {
        label: latestIssue.title,
        meta: formatDate(latestIssue.issueDate),
      },
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Resources"
        title="Everything the federation publishes"
        description="News, events, photographs and the Patrika — one place to find what FAIITA has been doing, and what it is doing next."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2">
            {sections.map((s, i) => (
              <ScrollReveal key={s.href} direction="up" delay={i * 0.06}>
                <Link href={s.href} className="group block h-full">
                  <GlassCard variant="light" glow="saffron" className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-saffron-50 text-saffron-700">
                        <s.icon className="h-5 w-5" />
                      </span>
                      <span className="section-eyebrow text-muted-foreground">{s.count}</span>
                    </div>

                    <h2 className="mt-5 font-display text-xl font-bold text-navy-800">{s.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.blurb}</p>

                    {s.latest && (
                      <div className="mt-5 border-t border-border pt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Most recent
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm font-medium text-navy-800">{s.latest.label}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{s.latest.meta}</p>
                      </div>
                    )}

                    <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-semibold text-saffron-700">
                      Open
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/*
        FAQ — 3.2. Written and ready, deliberately not rendered yet: the answers
        below are drafted from the About and Contact copy, and need the
        President's or Secretary's sign-off before they go out as the
        federation's official answers. Uncomment this section once that lands.
        It needs no other change — `FAQ_ITEMS` and the markup are complete.

      <section className="border-t border-border bg-secondary/30 py-20">
        <div className="container-page">
          <SectionHeading
            eyebrow="Common Questions"
            title="Frequently asked"
            description="The questions state and city associations ask us most often."
            align="center"
            className="mx-auto"
          />
          <div className="mx-auto mt-12 max-w-3xl divide-y divide-border">
            {FAQ_ITEMS.map((item) => (
              <details key={item.q} className="group py-5">
                <summary className="flex cursor-pointer items-center justify-between gap-4 text-left font-display text-base font-semibold text-navy-800 marker:content-none">
                  {item.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-saffron-700 transition-transform duration-300 group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      */}
    </>
  );
}

/*
FAQ content for the section above. Kept out of the commented block so it stays
readable and greppable while it waits for sign-off.

const FAQ_ITEMS = [
  {
    q: "Who can join FAIITA?",
    a: "FAIITA is a federation of associations, not of individuals. State-level IT trade associations join FAIITA directly; city and district associations join through their state chapter. If your state has no chapter yet, write to us and we will help you start one.",
  },
  {
    q: "What does membership cost?",
    a: "Membership terms are set per state chapter. Write to us through the contact form and the Secretary will send your association the current schedule.",
  },
  {
    q: "What does FAIITA actually do for a member association?",
    a: "Three things, in order of how often members use them: it represents the trade before government bodies, the GST Council and regulators; it connects members to a national network of over 50,000 IT entrepreneurs across 26 states; and it runs training, summits and expos that a single state association could not run alone.",
  },
  {
    q: "How is FAIITA governed?",
    a: "An elected Governing Body serves a two-year term, so leadership renews regularly and every state association has an equal opportunity to be represented nationally. The current GB serves 2025-27.",
  },
  {
    q: "How do I list my association's event or news on this site?",
    a: "Send it through the contact form with the dates, venue and a photograph. The federation publishes member events alongside national ones.",
  },
  {
    q: "Is the FAIITA Patrika available in print?",
    a: "The Patrika is published quarterly and distributed to member associations. Every issue is also readable online and downloadable from the newsletter page.",
  },
] as const;
*/
