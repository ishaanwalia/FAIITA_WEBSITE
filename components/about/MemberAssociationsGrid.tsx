"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, Users } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { LogoImage } from "@/components/common/LogoImage";
import { cn } from "@/lib/utils";

type MemberRow = {
  slug: string;
  name: string;
  city: string;
  stateName: string;
  memberCount: number;
  logoUrl?: string | null;
};

// Mirrors StateAssociationsGrid: filter tabs (by state) + search, compact
// cards that link through to each association's detail page.
export function MemberAssociationsGrid({ members }: { members: MemberRow[] }) {
  const [state, setState] = useState("All");
  const [query, setQuery] = useState("");

  const stateNames = useMemo(
    () => ["All", ...Array.from(new Set(members.map((m) => m.stateName))).sort()],
    [members]
  );

  const filtered = members
    .filter((m) => {
      const matchesState = state === "All" || m.stateName === state;
      const matchesQuery =
        query.trim() === "" ||
        m.name.toLowerCase().includes(query.toLowerCase()) ||
        m.city.toLowerCase().includes(query.toLowerCase()) ||
        m.stateName.toLowerCase().includes(query.toLowerCase());
      return matchesState && matchesQuery;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {stateNames.map((s) => (
            <button
              key={s}
              onClick={() => setState(s)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                state === s
                  ? "border-saffron-500 bg-saffron-500 text-navy-900"
                  : "border-border text-muted-foreground hover:border-navy-700/30"
              )}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, city, state..."
            className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-4 text-sm focus:border-navy-700 focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-10">
        {filtered.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((m) => (
              <TiltCard key={m.slug} maxTilt={6} className="h-full">
                <Link href={`/about/member-associations/${m.slug}`} className="group block h-full">
                  <GlassCard variant="light" className="flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      <LogoImage logoUrl={m.logoUrl} alt={m.name} size="sm" />
                      <div>
                        <h3 className="font-display text-sm font-bold leading-snug text-navy-800">{m.name}</h3>
                        <p className="mt-1 text-xs font-medium text-saffron-600">{m.city}, {m.stateName}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                      {m.memberCount > 0 ? (
                        <span className="flex items-center gap-1.5">
                          <Users className="h-3.5 w-3.5" /> {m.memberCount.toLocaleString("en-IN")} members
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
        ) : (
          <p className="text-center text-sm text-muted-foreground">No member associations match your search.</p>
        )}
      </div>
    </div>
  );
}
