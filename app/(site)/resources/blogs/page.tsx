import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Blogs",
  description: "Perspectives and insights from FAIITA and the IT trade ecosystem.",
};

export const revalidate = 3600;

export default async function BlogsPage() {
  const blogs = await prisma.blog.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / Blogs"
            title="Perspectives & Insights"
            description="Ideas and analysis from FAIITA's editorial desk and policy cell."
            light
          />
        </div>
      </section>
      <SectionDivider type="diagonal" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
        <div className="container-page grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogs.map((b, i) => (
            <ScrollReveal key={b.id} direction="up" delay={(i % 3) * 0.08}>
              <TiltCard maxTilt={6} className="h-full">
                <Link href={`/resources/blogs/${b.slug}`} className="group block h-full">
                  <GlassCard variant="light" className="flex h-full flex-col">
                    <div className="flex flex-wrap gap-1.5">
                      {b.tags.split(",").slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-700">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                    <h2 className="mt-4 font-display text-lg font-bold leading-snug text-navy-800">{b.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{b.excerpt}</p>
                    <div className="mt-5 flex items-center justify-between border-t border-navy-700/10 pt-4 text-xs text-muted-foreground">
                      <span>{b.author} · {formatDate(b.publishedAt)}</span>
                      <ArrowUpRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </GlassCard>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
