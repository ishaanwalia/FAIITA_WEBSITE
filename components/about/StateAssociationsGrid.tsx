"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

type StateRow = {
  id: string;
  slug: string;
  stateName: string;
  associationName: string;
  region: string;
  memberCount: number;
};

export function StateAssociationsGrid({ states }: { states: StateRow[] }) {
  const [region, setRegion] = useState("All");
  const [query, setQuery] = useState("");

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);

  const filtered = states.filter((s) => {
    const matchesRegion = region === "All" || s.region === region;
    const matchesQuery =
      query.trim() === "" ||
      s.stateName.toLowerCase().includes(query.toLowerCase()) ||
      s.associationName.toLowerCase().includes(query.toLowerCase());
    return matchesRegion && matchesQuery;
  });

  const grouped = useMemo(() => {
    const map = new Map<string, StateRow[]>();
    for (const s of filtered) map.set(s.region, [...(map.get(s.region) ?? []), s]);
    return map;
  }, [filtered]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {regions.map((r) => (
            <button
              key={r}
              onClick={() => setRegion(r)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                region === r
                  ? "border-saffron-500 bg-saffron-500 text-navy-900"
                  : "border-border text-muted-foreground hover:border-navy-700/30"
              )}
            >
              {r}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search state or association..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-navy-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10 space-y-14">
        {[...grouped.entries()].map(([regionName, rows]) => (
          <div key={regionName}>
            <h2 className="font-display text-xl font-bold text-navy-800">{regionName} Zone</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((s) => (
                <TiltCard key={s.id} maxTilt={6} className="h-full">
                  <Link href={`/about/state-associations/${s.slug}`} className="group block h-full">
                    <GlassCard variant="light" className="flex h-full flex-col">
                      <h3 className="font-display text-base font-bold text-navy-800">{s.stateName}</h3>
                      <p className="mt-1 text-xs font-medium text-saffron-600">{s.associationName}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> {s.memberCount.toLocaleString("en-IN")} members
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </GlassCard>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No state associations match your search.</p>
        )}
      </div>
    </div>
  );
}
