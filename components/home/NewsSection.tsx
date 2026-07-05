import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { NewsItem } from "@/types";

export function NewsSection({ news }: { news: NewsItem[] }) {
  const [lead, ...rest] = news;
  if (!lead) return null;

  return (
    <section className="bg-background py-24">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Latest Updates" title="News & Announcements" />
          <Link
            href="/resources/news"
            className="link-underline flex items-center gap-1 text-sm font-semibold text-navy-700"
          >
            View all news <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <ScrollReveal direction="left" className="lg:col-span-2">
            <TiltCard maxTilt={4} className="h-full min-h-[340px]">
              <Link
                href={`/resources/news/${lead.slug}`}
                className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden rounded-2xl bg-navy-800 p-8"
              >
                <div className="absolute inset-0 bg-network-grid opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-navy-900/40 to-transparent" />
                <div className="relative">
                  <Badge variant="accent">{lead.category}</Badge>
                  <h3 className="mt-4 max-w-lg text-balance font-display text-2xl font-bold text-white sm:text-3xl">
                    {lead.title}
                  </h3>
                  <p className="mt-3 max-w-lg text-sm text-white/60">{lead.excerpt}</p>
                  <div className="mt-5 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-white/40">
                    {formatDate(lead.publishedAt)}
                    <ArrowUpRight className="h-3.5 w-3.5 text-saffron-400 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </TiltCard>
          </ScrollReveal>

          <div className="flex flex-col gap-6">
            {rest.slice(0, 2).map((n, i) => (
              <ScrollReveal key={n.id} direction="right" delay={i * 0.1} className="flex-1">
                <TiltCard maxTilt={5} className="h-full">
                  <Link href={`/resources/news/${n.slug}`} className="group block h-full">
                    <GlassCard variant="light" className="flex h-full flex-col justify-between">
                      <div>
                        <Badge variant="outline">{n.category}</Badge>
                        <h4 className="mt-3 font-display text-base font-semibold leading-snug text-navy-800">
                          {n.title}
                        </h4>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {formatDate(n.publishedAt)}
                        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </div>
                    </GlassCard>
                  </Link>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
