"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Search } from "lucide-react";
import type { SearchEntry } from "@/lib/search-index";

export function SearchClient({ index }: { index: SearchEntry[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter(
      (entry) => entry.title.toLowerCase().includes(q) || entry.description.toLowerCase().includes(q)
    );
  }, [query, index]);

  return (
    <div>
      <div className="relative mx-auto max-w-xl">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          type="search"
          aria-label="Search the FAIITA website"
          placeholder="Search state associations, news, events…"
          className="w-full rounded-full border border-border bg-card py-3 pl-12 pr-4 text-base focus:border-navy-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy-700 focus-visible:ring-offset-2"
        />
      </div>

      {query.trim() === "" ? (
        <p className="mt-10 text-center text-sm text-muted-foreground">Start typing to search across the site.</p>
      ) : results.length > 0 ? (
        <ul className="mx-auto mt-10 max-w-2xl divide-y divide-navy-700/10">
          {results.map((entry) => (
            <li key={`${entry.type}-${entry.href}-${entry.title}`}>
              <Link
                href={entry.href}
                className="group flex items-start justify-between gap-4 py-4 hover:bg-navy-700/5"
              >
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-saffron-700">{entry.type}</span>
                  <h2 className="mt-1 font-display text-lg font-bold text-navy-800">{entry.title}</h2>
                  {entry.description && (
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{entry.description}</p>
                  )}
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-navy-700 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-sm text-muted-foreground">No results for &ldquo;{query}&rdquo;.</p>
      )}
    </div>
  );
}
