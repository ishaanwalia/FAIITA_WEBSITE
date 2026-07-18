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

export default async function HomePage() {
  const [stats, testimonials, news, events, states] = await Promise.all([
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.news.findMany({ where: { isDemo: false }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.event.findMany({ where: { isUpcoming: true }, orderBy: { startDate: "asc" }, take: 3 }),
    prisma.stateAssociation.findMany({ select: { slug: true, stateName: true }, orderBy: { stateName: "asc" } }),
  ]);

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
