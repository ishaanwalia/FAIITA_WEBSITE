"use client";

import { useMemo, useState } from "react";
import { Building2, MapPin, Search, User, Users } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/badge";
import { LogoImage } from "@/components/common/LogoImage";
import { cn } from "@/lib/utils";

type MemberRow = {
  id: string;
  name: string;
  city: string | null;
  type: string;
  memberCount: number;
  description: string | null;
  presidentName?: string | null;
  logoUrl?: string | null;
  state: { stateName: string };
};

export function MemberAssociationsGrid({ members }: { members: MemberRow[] }) {
  const [type, setType] = useState("All");
  const [query, setQuery] = useState("");

  const types = useMemo(() => ["All", ...Array.from(new Set(members.map((m) => m.type)))], [members]);

  const filtered = members.filter((m) => {
    const matchesType = type === "All" || m.type === type;
    const matchesQuery =
      query.trim() === "" ||
      m.name.toLowerCase().includes(query.toLowerCase()) ||
      m.state.stateName.toLowerCase().includes(query.toLowerCase()) ||
      (m.city ?? "").toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors",
                type === t
                  ? "border-saffron-500 bg-saffron-500 text-navy-900"
                  : "border-border text-muted-foreground hover:border-navy-700/30"
              )}
            >
              {t}
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

      {filtered.length > 0 ? (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <TiltCard key={m.id} maxTilt={6} className="h-full">
              <GlassCard variant="light" className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <Badge variant="outline" className="w-fit">{m.type}</Badge>
                  <LogoImage logoUrl={m.logoUrl} alt={m.name} size="sm" />
                </div>
                <h3 className="mt-4 font-display text-base font-bold text-navy-800">{m.name}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {m.city}, {m.state.stateName}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{m.description}</p>
                {m.presidentName && (
                  <p className="mt-3 flex items-center gap-1.5 text-xs text-navy-700/70">
                    <User className="h-3.5 w-3.5" /> {m.presidentName}, President
                  </p>
                )}
                <p className="mt-2 flex items-center gap-1.5 border-t border-navy-700/10 pt-4 text-xs font-semibold text-saffron-600">
                  <Users className="h-3.5 w-3.5" /> {m.memberCount.toLocaleString("en-IN")} members
                </p>
              </GlassCard>
            </TiltCard>
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-3xl border border-dashed border-border p-16 text-center">
          <Building2 className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-4 text-sm text-muted-foreground">No member associations match your filters.</p>
        </div>
      )}
    </div>
  );
}
