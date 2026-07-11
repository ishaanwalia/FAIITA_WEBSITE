import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

export const revalidate = 3600;

export async function generateStaticParams() {
  const items = await prisma.event.findMany({ select: { slug: true } });
  return items.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = await prisma.event.findUnique({ where: { slug } });
  return item ? { title: item.title, description: item.description } : { title: "Event" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await prisma.event.findUnique({ where: { slug } });
  if (!item) notFound();

  return (
    <article className="bg-background py-20">
      <div className="container-page max-w-3xl">
        <Link href="/resources/events" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-navy-700">
          <ArrowLeft className="h-3.5 w-3.5" /> All events
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="inline-block w-fit rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-600">
            {item.category}
          </span>
          {item.isDemo && <DemoBadge />}
        </div>
        <h1 className="mt-4 text-balance font-display text-3xl font-bold text-navy-800 sm:text-4xl">{item.title}</h1>
        <div className="mt-4 flex flex-wrap gap-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(item.startDate)}</span>
          <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {item.city}, {item.state}</span>
        </div>
        <p className="mt-8 text-base leading-relaxed text-navy-800/80">{item.description}</p>
        {item.registrationLink && (
          <Button asChild variant="accent" size="lg" className="mt-8">
            <a href={item.registrationLink} target="_blank" rel="noopener noreferrer">Register Now</a>
          </Button>
        )}
      </div>
    </article>
  );
}
