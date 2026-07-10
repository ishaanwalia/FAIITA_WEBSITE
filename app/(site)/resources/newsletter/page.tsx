import type { Metadata } from "next";
import { Download, Mail } from "lucide-react";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { NewsletterForm } from "@/components/common/NewsletterForm";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Newsletter",
  description: "FAIITA's quarterly newsletter archive.",
};

export const revalidate = 3600;

export default async function NewsletterPage() {
  const newsletters = await prisma.newsletter.findMany({ orderBy: { issueDate: "desc" } });

  return (
    <>
      <PageHero
        eyebrow="Resources / Newsletter"
        title="FAIITA Quarterly"
        description="Our regular publication covering policy updates, association spotlights, and federation news."
      />

      <section className="bg-background py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {newsletters.map((n, i) => (
              <ScrollReveal key={n.id} direction="up" delay={i * 0.06}>
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-6">
                  <div>
                    <p className="font-mono text-xs font-semibold uppercase tracking-wide text-saffron-600">Issue #{n.issueNumber}</p>
                    <h3 className="mt-1 font-display text-base font-bold text-navy-800">{n.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{n.description}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{formatDate(n.issueDate)}</p>
                  </div>
                  <a
                    href={n.fileUrl ?? "#"}
                    className="flex shrink-0 items-center gap-2 rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5"
                  >
                    <Download className="h-4 w-4" /> Download PDF
                  </a>
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
