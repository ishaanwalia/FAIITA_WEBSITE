import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "News",
  description: "The latest news and announcements from FAIITA.",
};

export const revalidate = 3600;

export default async function NewsPage() {
  const news = await prisma.news.findMany({ orderBy: { publishedAt: "desc" } });
  const [featured, ...rest] = news;

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / News"
            title="News & Announcements"
            description="Federation updates, policy wins, and press releases."
            light
          />
        </div>
      </section>
      <SectionDivider type="wave" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
        <div className="container-page">
          {featured && (
            <ScrollReveal direction="scale" className="mb-14">
              <Link href={`/resources/news/${featured.slug}`} className="group block">
                <TiltCard maxTilt={3}>
                  <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 sm:p-14">
                    <div className="absolute inset-0 bg-network-grid opacity-15" />
                    <div className="relative max-w-2xl">
                      <Badge variant="accent">Featured · {featured.category}</Badge>
                      <h2 className="mt-5 text-balance font-display text-3xl font-bold text-white sm:text-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-4 text-white/60">{featured.excerpt}</p>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-400">
                        Read the full story
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>
                    </div>
                  </div>
                </TiltCard>
              </Link>
            </ScrollReveal>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((n, i) => (
              <ScrollReveal key={n.id} direction="up" delay={(i % 3) * 0.08}>
                <TiltCard maxTilt={6} className="h-full">
                  <Link href={`/resources/news/${n.slug}`} className="group block h-full">
                    <GlassCard variant="light" className="flex h-full flex-col">
                      <Badge variant="outline" className="w-fit">{n.category}</Badge>
                      <h2 className="mt-4 font-display text-lg font-bold leading-snug text-navy-800">{n.title}</h2>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
                      <div className="mt-5 flex items-center gap-2 border-t border-navy-700/10 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {formatDate(n.publishedAt)}
                        <ArrowUpRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </GlassCard>
                  </Link>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
