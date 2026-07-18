import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import { codeNews, findCodeNews } from "@/lib/code-news";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await prisma.news.findMany({ select: { slug: true } });
  return [...items, ...codeNews].map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = (await prisma.news.findUnique({ where: { slug } })) ?? findCodeNews(slug);
  return item ? { title: item.title, description: item.excerpt } : { title: "News" };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = (await prisma.news.findUnique({ where: { slug } })) ?? findCodeNews(slug);
  if (!item) notFound();

  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-3xl">
        <Link href="/resources/news" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700">
          <ArrowLeft className="h-3.5 w-3.5" /> All news
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="w-fit">{item.category}</Badge>
          {item.isDemo && <DemoBadge />}
        </div>
        <h1 className="mt-4 text-balance font-display text-3xl font-bold text-navy-800 sm:text-4xl">{item.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{formatDate(item.publishedAt)}</p>
        {(item.heroImage ?? item.coverImage) && (
          <Image
            src={(item.heroImage ?? item.coverImage)!}
            alt={item.title}
            width={1200}
            height={675}
            className="mt-8 w-full rounded-2xl object-cover"
            priority
          />
        )}
        <div className="mt-8 space-y-4 text-base leading-relaxed text-navy-800/80">
          {item.content.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
        {item.sourceUrl && (
          <a
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-navy-700 hover:text-saffron-600"
          >
            Read the original coverage <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </article>
  );
}
