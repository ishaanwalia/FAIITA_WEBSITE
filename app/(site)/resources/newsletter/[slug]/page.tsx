import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Maximize2 } from "lucide-react";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await prisma.newsletter.findMany({ select: { slug: true } });
  return items.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.newsletter.findUnique({ where: { slug } });
  if (!item) return { title: "Newsletter" };
  return {
    title: item.title,
    description: item.description ?? "FAIITA Patrika — the federation's e-bulletin.",
    alternates: { canonical: `/resources/newsletter/${slug}` },
    openGraph: { images: [`/api/og?eyebrow=FAIITA+Patrika&title=${encodeURIComponent(item.title)}`] },
  };
}

export default async function NewsletterIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.newsletter.findUnique({ where: { slug } });
  if (!item || !item.fileUrl) notFound();

  const isFlipbook = item.fileUrl.includes("heyzine.com");
  const isPdf = item.fileUrl.toLowerCase().endsWith(".pdf");

  return (
    <article className="bg-background pb-20 pt-28">
      <div className="container-page">
        <Link href="/resources/newsletter" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700">
          <ArrowLeft className="h-3.5 w-3.5" /> All issues
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-wide text-saffron-700">
              Issue #{item.issueNumber}
              {item.isDemo && <DemoBadge />}
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold text-navy-800 sm:text-4xl">{item.title}</h1>
            <p className="mt-2 text-sm text-muted-foreground">{formatDate(item.issueDate)}</p>
          </div>
          <div className="flex items-center gap-3">
            {isFlipbook && (
              <a
                href={item.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5"
              >
                <Maximize2 className="h-4 w-4" /> Open Fullscreen
              </a>
            )}
            {isPdf && (
              <a
                href={item.fileUrl}
                download
                className="flex items-center gap-2 rounded-full border border-navy-700/20 px-4 py-2 text-sm font-semibold text-navy-700 hover:bg-navy-700/5"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            )}
          </div>
        </div>

        {item.description && <p className="mt-4 max-w-3xl text-sm text-muted-foreground">{item.description}</p>}

        {/* Heyzine's viewer ships page-flip, pinch/scroll zoom, and fullscreen;
            PDFs fall back to the browser's built-in viewer. */}
        <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-navy-900 shadow-xl">
          <iframe
            src={item.fileUrl}
            title={item.title}
            allowFullScreen
            className="h-[75vh] min-h-[480px] w-full border-0 sm:h-[82vh]"
          />
        </div>

        {isPdf && (
          <p className="mt-4 text-center text-xs text-muted-foreground">
            If the issue doesn&apos;t display on your device, use the Download PDF button above.
          </p>
        )}
      </div>
    </article>
  );
}
