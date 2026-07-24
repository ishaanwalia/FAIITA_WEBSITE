import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { StateMarquee } from "@/components/home/StateMarquee";
import { Stats } from "@/components/home/Stats";
import { MembershipBenefits } from "@/components/common/MembershipBenefits";
import { JoinCta } from "@/components/home/JoinCta";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsSection } from "@/components/home/NewsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ReadyToConnect } from "@/components/home/ReadyToConnect";
import { prisma } from "@/lib/prisma";
import { excludeRemovedStates } from "@/lib/state-overrides";
import { mergeNews } from "@/lib/code-news";
import type { StatItem } from "@/types";

export const metadata: Metadata = { alternates: { canonical: "/" } };

export const revalidate = 3600; // ISR — refresh homepage content hourly

// Display corrections for DB records the site owner updates separately.
const associationFixes: Record<string, string> = {
  "Kerala IT Dealers Association": "All Kerala IT Dealers Association (AKITDA)",
};

// Display fixes for stat rows the live DB still carries with old figures —
// FAIITA prefers the states figure (31 associations span 26 states).
// prisma/seed.ts is already corrected; this keeps production right until
// the next reseed.
const statFixes: Record<string, { label: string; value: string }> = {
  "Affiliated Associations": { label: "States Covered", value: "26" },
  "States Covered": { label: "States Covered", value: "26" },
};

// ISR already serves the last-good render if a revalidation fetch fails, so
// this only matters for a cold start (fresh deploy, empty cache) that
// happens to race a DB blip — rare, but the alternative is a hard crash on
// the very first request instead of the section that exists to prove scale.
// Numbers mirror the seeded stat.findMany() row values (prisma/seed.ts) and
// the "50,000+ across 26 states" copy already used in Hero.tsx.
const fallbackStats: StatItem[] = [
  { id: "fallback-states", label: "States Covered", value: "26", suffix: "", icon: "MapPinned" },
  { id: "fallback-associations", label: "Member Associations", value: "100", suffix: "+", icon: "Building2" },
  { id: "fallback-partners", label: "Channel Partners", value: "50", suffix: "K+", icon: "Users" },
  { id: "fallback-employment", label: "Employment Generated", value: "5", suffix: "L+", icon: "Briefcase" },
  { id: "fallback-years", label: "Years Since 2014", value: "12", suffix: "+", icon: "CalendarClock" },
  { id: "fallback-policy", label: "Policy Advocacy Wins", value: "300", suffix: "+", icon: "ShieldCheck" },
];

type Stats = Awaited<ReturnType<typeof prisma.stat.findMany>>;
type Testimonials = Awaited<ReturnType<typeof prisma.testimonial.findMany>>;
type News = Awaited<ReturnType<typeof prisma.news.findMany>>;
type Events = Awaited<ReturnType<typeof prisma.event.findMany>>;
type States = Awaited<ReturnType<typeof prisma.stateAssociation.findMany<{
  select: { slug: true; stateName: true };
  orderBy: { stateName: "asc" };
}>>>;

export default async function HomePage() {
  let stats: Stats | StatItem[];
  let testimonials: Testimonials;
  let news: News;
  let events: Events;
  let states: States;
  try {
    [stats, testimonials, news, events, states] = await Promise.all([
      prisma.stat.findMany({ orderBy: { order: "asc" } }),
      prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
      prisma.news.findMany({ where: { isDemo: false }, orderBy: { publishedAt: "desc" }, take: 3 }),
      prisma.event.findMany({ where: { isUpcoming: true }, orderBy: { startDate: "asc" }, take: 3 }),
      prisma.stateAssociation.findMany({ select: { slug: true, stateName: true }, orderBy: { stateName: "asc" } }),
    ]);
  } catch {
    stats = fallbackStats;
    testimonials = [];
    news = [];
    events = [];
    states = [];
  }

  return (
    <>
      <Hero />
      <StateMarquee states={[...new Set(excludeRemovedStates(states).map((s) => s.stateName))]} />
      <Stats stats={stats.map((s) => (statFixes[s.label] ? { ...s, ...statFixes[s.label] } : s))} />
      <MembershipBenefits />
      <JoinCta />
      <Testimonials
        testimonials={testimonials.map((t) => ({
          ...t,
          association: associationFixes[t.association] ?? t.association,
        }))}
      />
      <NewsSection news={mergeNews(news).slice(0, 3)} />
      <EventsSection events={events} />
      <ReadyToConnect />
    </>
  );
}
