import type { Metadata } from "next";
import { FileText, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Policy",
  description: "FAIITA's policy advocacy positions and compliance guidance.",
};

export const revalidate = 3600;

export default async function PolicyPage() {
  const policies = await prisma.policy.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / Policy"
            title="Policy & Advocacy"
            description="Position papers, representations, and compliance guidance FAIITA has delivered on behalf of its members."
            light
          />
        </div>
      </section>
      <SectionDivider type="curve" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
        <div className="container-page space-y-4">
          {policies.map((p, i) => (
            <ScrollReveal key={p.id} direction="up" delay={i * 0.06}>
              <div className="flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 sm:flex-row sm:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <Badge variant="green" className="w-fit">{p.category}</Badge>
                  <h3 className="mt-3 font-display text-base font-bold text-navy-800">{p.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">{formatDate(p.publishedAt)}</p>
                </div>
                {p.fileUrl && (
                  <a
                    href={p.fileUrl}
                    className="flex shrink-0 items-center gap-2 self-start rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5"
                  >
                    <FileText className="h-4 w-4" /> View Document
                  </a>
                )}
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
