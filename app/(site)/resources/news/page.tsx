import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { NewsGrid } from "@/components/resources/NewsGrid";
import { Badge } from "@/components/ui/badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
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
      <PageHero
        eyebrow="Resources / News"
        title="News & Announcements"
        description="Federation updates, policy wins, and press releases."
      />

      <section className="bg-background py-20">
        <div className="container-page">
          {featured && (
            <ScrollReveal direction="scale" className="mb-14">
              <Link href={`/resources/news/${featured.slug}`} className="group block">
                <TiltCard maxTilt={3}>
                  <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-10 sm:p-14">
                    {featured.coverImage ? (
                      <>
                        <Image
                          src={featured.coverImage}
                          alt=""
                          fill
                          className="object-cover opacity-40"
                          priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/80 to-navy-900/30" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-network-grid opacity-15" />
                    )}
                    <div className="relative max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="accent">Featured · {featured.category}</Badge>
                        {featured.isDemo && <DemoBadge />}
                      </div>
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

          <NewsGrid news={rest} />
        </div>
      </section>
    </>
  );
}
