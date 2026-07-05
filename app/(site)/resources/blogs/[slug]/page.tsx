import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await prisma.blog.findMany({ select: { slug: true } });
  return items.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.blog.findUnique({ where: { slug } });
  return item ? { title: item.title, description: item.excerpt } : { title: "Blog" };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.blog.findUnique({ where: { slug } });
  if (!item) notFound();

  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-3xl">
        <Link href="/resources/blogs" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700">
          <ArrowLeft className="h-3.5 w-3.5" /> All blogs
        </Link>
        <h1 className="mt-6 text-balance font-display text-3xl font-bold text-navy-800 sm:text-4xl">{item.title}</h1>
        <p className="mt-3 text-sm text-muted-foreground">{item.author} · {formatDate(item.publishedAt)}</p>
        <div className="mt-8 space-y-4 text-base leading-relaxed text-navy-800/80">
          <p>{item.content}</p>
        </div>
      </div>
    </article>
  );
}
