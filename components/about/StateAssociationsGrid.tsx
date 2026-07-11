"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogoImage } from "@/components/common/LogoImage";
import { cn } from "@/lib/utils";

type StateRow = {
  id: string;
  slug: string;
  stateName: string;
  associationName: string;
  region: string;
  memberCount: number;
  logoUrl?: string | null;
};

const ZONE_ORDER = ["North", "East", "North-East", "Central", "West", "South"];

export function StateAssociationsGrid({ states }: { states: StateRow[] }) {
  const [region, setRegion] = useState("All");
  const [query, setQuery] = useState("");

  const regions = useMemo(
    () => ["All", ...ZONE_ORDER.filter((z) => states.some((s) => s.region === z))],
    [states]
  );

  // A-Z by association name; "All" shows one flat list, a zone tab shows only
  // that zone under a single heading.
  const filtered = states
    .filter((s) => {
      const matchesRegion = region === "All" || s.region === region;
      const matchesQuery =
        query.trim() === "" ||
        s.stateName.toLowerCase().includes(query.toLowerCase()) ||
        s.associationName.toLowerCase().includes(query.toLowerCase());
      return matchesRegion && matchesQuery;
    })
    .sort((a, b) => a.associationName.localeCompare(b.associationName));

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

      <div className="mt-10">
        {filtered.length > 0 && (
          <div>
            {region !== "All" && (
              <h2 className="font-display text-xl font-bold text-navy-800">{region} Zone</h2>
            )}
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((s) => (
                <TiltCard key={s.id} maxTilt={6} className="h-full">
                  <Link href={`/about/state-associations/${s.slug}`} className="group block h-full">
                    <GlassCard variant="light" className="flex h-full flex-col">
                      <div className="flex items-start gap-3">
                        <LogoImage logoUrl={s.logoUrl} alt={s.associationName} size="sm" />
                        <div>
                          {/* Association leads the card — several states have more than one. */}
                          <h3 className="font-display text-sm font-bold leading-snug text-navy-800">{s.associationName}</h3>
                          <p className="mt-1 text-xs font-medium text-saffron-600">{s.stateName}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        {s.memberCount > 0 ? (
                          <span className="flex items-center gap-1.5">
                            <Users className="h-3.5 w-3.5" /> {s.memberCount.toLocaleString("en-IN")} members
                          </span>
                        ) : (
                          <span />
                        )}
                        <ArrowRight className="h-3.5 w-3.5 text-navy-700 transition-transform group-hover:translate-x-0.5" />
                      </div>
                    </GlassCard>
                  </Link>
                </TiltCard>
              ))}
            </div>
          </div>
        )}
        {filtered.length === 0 && (
          <p className="text-center text-sm text-muted-foreground">No state associations match your search.</p>
        )}
      </div>
    </div>
  );
}
