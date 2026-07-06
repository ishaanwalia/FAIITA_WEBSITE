"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

type NewsRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: Date;
};

export function NewsGrid({ news }: { news: NewsRow[] }) {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");

  const categories = useMemo(() => ["All", ...Array.from(new Set(news.map((n) => n.category)))], [news]);

  const filtered = news.filter((n) => {
    const matchesCategory = category === "All" || n.category === category;
    const matchesQuery = query.trim() === "" || n.title.toLowerCase().includes(query.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search news..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-navy-700 focus:outline-none"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                category === c
                  ? "border-saffron-500 bg-saffron-500 text-navy-900"
                  : "border-border text-muted-foreground hover:border-navy-700/30"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((n, i) => (
            <ScrollReveal key={n.id} direction="up" delay={(i % 3) * 0.08}>
              <TiltCard maxTilt={6} className="h-full">
                <Link href={`/resources/news/${n.slug}`} className="group block h-full">
                  <GlassCard variant="light" className="flex h-full flex-col">
                    <Badge variant="outline" className="w-fit">{n.category}</Badge>
                    <h2 className="mt-4 font-display text-lg font-bold leading-snug text-navy-800">{n.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{n.excerpt}</p>
                    <div className="mt-5 flex items-center gap-2 border-t border-navy-700/10 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      {formatDate(n.publishedAt)}
                      <ArrowUpRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </div>
                  </GlassCard>
                </Link>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">No news matches your search.</p>
      )}
    </div>
  );
}
