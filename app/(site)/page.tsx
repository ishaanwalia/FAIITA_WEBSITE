import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { Benefits } from "@/components/home/Benefits";
import { JoinCta } from "@/components/home/JoinCta";
import { Testimonials } from "@/components/home/Testimonials";
import { NewsSection } from "@/components/home/NewsSection";
import { EventsSection } from "@/components/home/EventsSection";
import { ReadyToConnect } from "@/components/home/ReadyToConnect";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600; // ISR — refresh homepage content hourly

export default async function HomePage() {
  const [stats, testimonials, news, events] = await Promise.all([
    prisma.stat.findMany({ orderBy: { order: "asc" } }),
    prisma.testimonial.findMany({ orderBy: { order: "asc" } }),
    prisma.news.findMany({ orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.event.findMany({ where: { isUpcoming: true }, orderBy: { startDate: "asc" }, take: 3 }),
  ]);

  return (
    <>
      <Hero />
      <Stats stats={stats} />
      <Benefits />
      <JoinCta />
      <Testimonials testimonials={testimonials} />
      <NewsSection news={news} />
      <EventsSection events={events} />
      <ReadyToConnect />
    </>
  );
}
