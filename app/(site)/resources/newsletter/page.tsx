import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Download, Mail } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "FAIITA Patrika",
  description: "FAIITA Patrika — the federation's e-bulletin archive, readable online.",
};

export const revalidate = 3600;

export default async function NewsletterPage() {
  const newsletters = await prisma.newsletter.findMany({ orderBy: { issueDate: "desc" } });

  return (
    <>
      <PageHero
        eyebrow="Resources / Newsletter"
        title="FAIITA Patrika"
        description="The federation's e-bulletin — policy updates, association spotlights, and news from across India's IT trade. Read every issue right here."
      />

      <section className="bg-background py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {newsletters.map((n, i) => (
              <ScrollReveal key={n.id} direction="up" delay={i * 0.06}>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-saffron-600">
                      Issue #{n.issueNumber}
                      {n.isDemo && <DemoBadge />}
                    </p>
                    <h3 className="mt-1 font-display text-base font-bold text-navy-800">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.issueDate)}</p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <Link
                      href={`/resources/newsletter/${n.slug}`}
                      className="flex items-center gap-2 rounded-full bg-navy-700 px-5 py-2 text-sm font-semibold text-white hover:bg-navy-800"
                    >
                      <BookOpen className="h-4 w-4" /> Read Issue
                    </Link>
                    {n.fileUrl?.toLowerCase().endsWith(".pdf") && (
                      <a
                        href={n.fileUrl}
                        download
                        className="flex items-center gap-2 rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5"
                      >
                        <Download className="h-4 w-4" /> PDF
                      </a>
                    )}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-secondary/60 p-6">
            <Mail className="h-6 w-6 text-navy-700" />
            <h3 className="mt-3 font-display text-lg font-bold text-navy-800">Subscribe for updates</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Get every new issue delivered straight to your inbox.
            </p>
            <div className="mt-4 [&_input]:border-navy-700/15 [&_input]:bg-white [&_input]:text-navy-800 [&_input]:placeholder:text-navy-400">
              <NewsletterForm />
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
