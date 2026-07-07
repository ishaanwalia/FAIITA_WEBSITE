import type { Metadata } from "next";
import { Download, FileText } from "lucide-react";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Reports & Publications",
  description: "FAIITA's industry research, policy papers, and annual reports.",
};

export const revalidate = 3600;

export default async function ReportsPage() {
  // Safe query - only selects existing columns
  const reports = await prisma.policy.findMany({
    orderBy: { publishedAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      fileUrl: true,
      // fileSize is commented out because it doesn't exist in DB yet
      // fileSize: true,
      publishedAt: true,
    },
  });

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / Reports"
            title="Reports & Publications"
            description="Industry research, policy papers, and annual reports."
            light
          />
        </div>
      </section>
      <SectionDivider type="curve" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.length === 0 ? (
            <p className="col-span-full py-12 text-center text-muted-foreground">
              No reports available yet.
            </p>
          ) : (
            reports.map((r, i) => (
              <ScrollReveal key={r.id} direction="up" delay={i * 0.06}>
                <TiltCard maxTilt={5}>
                  <GlassCard variant="light" className="flex h-full flex-col">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-700/5 text-navy-700">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <Badge variant="accent">{r.category}</Badge>
                      {/* <span className="text-xs text-muted-foreground">
                        PDF{r.fileSize ? ` · ${r.fileSize}` : ""}
                      </span> */}
                    </div>

                    <h3 className="mt-3 font-display text-lg font-bold text-navy-800">
                      {r.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {r.description}
                    </p>

                    <a
                      href={r.fileUrl ?? "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex w-fit items-center gap-2 rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5 transition-colors"
                    >
                      <Download className="h-4 w-4" /> Download PDF
                    </a>
                  </GlassCard>
                </TiltCard>
              </ScrollReveal>
            ))
          )}
        </div>
      </section>
    </>
  );
}
