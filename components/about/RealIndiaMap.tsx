"use client";

import { useState } from "react";
import Link from "next/link";
import { IndiaMap } from "@vishalvoid/react-india-map";
import type { StateData } from "@vishalvoid/react-india-map";
import { ArrowRight, Building2, Users } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { StateMapPoint } from "@/types";

export function RealIndiaMap({ states }: { states: StateMapPoint[] }) {
  const [hovered, setHovered] = useState<StateMapPoint | null>(null);

  const stateData: StateData[] = states.map((s) => ({
    id: `IN-${s.stateCode}`,
    customData: {
      slug: s.slug,
      stateName: s.stateName,
      associationName: s.associationName,
      memberCount: s.memberCount,
    },
  }));

  const findByIsoId = (isoId: string) => states.find((s) => `IN-${s.stateCode}` === isoId) ?? null;

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
      <div className="rounded-3xl border border-border bg-navy-800 p-6">
        <IndiaMap
          mapStyle={{
            backgroundColor: "transparent",
            hoverColor: "#F2921D",
          }}
          stateData={stateData}
          onStateHover={(stateId) => setHovered(findByIsoId(stateId))}
          onStateClick={(stateId) => setHovered(findByIsoId(stateId))}
        />
      </div>

      <GlassCard variant="light" className="flex h-fit flex-col">
        {hovered ? (
          <>
            <span className="w-fit rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-saffron-600">
              {hovered.region} Zone
            </span>
            <h3 className="mt-4 font-display text-xl font-bold text-navy-800">{hovered.stateName}</h3>
            <p className="text-sm font-medium text-saffron-600">{hovered.associationName}</p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-secondary p-4">
                <Users className="h-4 w-4 text-navy-700" />
                <p className="mt-2 font-mono text-lg font-bold text-navy-800">
                  {hovered.memberCount.toLocaleString("en-IN")}
                </p>
                <p className="text-xs text-muted-foreground">Members</p>
              </div>
              <div className="rounded-xl bg-secondary p-4">
                <Building2 className="h-4 w-4 text-navy-700" />
                <p className="mt-2 font-mono text-lg font-bold text-navy-800">{hovered.foundedYear ?? "—"}</p>
                <p className="text-xs text-muted-foreground">Founded</p>
              </div>
            </div>
            <Link
              href={`/about/state-associations/${hovered.slug}`}
              className="link-underline mt-6 flex items-center gap-1.5 text-sm font-semibold text-navy-700"
            >
              View full profile <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </>
        ) : (
          <div className="py-10 text-center text-sm text-muted-foreground">
            Hover or tap any state to see its FAIITA association.
          </div>
        )}
      </GlassCard>
    </div>
  );
}
