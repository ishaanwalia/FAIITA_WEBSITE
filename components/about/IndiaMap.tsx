"use client";

import { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { ArrowRight, Building2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { RegionDataValue } from "react-datamaps-india";
import type { StateMapPoint } from "@/types";

// This library touches `window` at module scope, so it must never be part of
// the server bundle — load it purely on the client.
const DatamapsIndia = dynamic(() => import("react-datamaps-india"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[420px] items-center justify-center text-sm text-muted-foreground">
      Loading map…
    </div>
  ),
});

const COVERED_FILL = "#F2921D";
const COVERED_HOVER = "#D97A0E";
const UNCOVERED_FILL = "#F1F5F9";
const BORDER_COLOR = "#0B2A4A";

function HoverCard({ value }: { value: RegionDataValue & { name?: string } }) {
  if (!value?.memberCount) {
    return <span className="text-xs text-white/60">{value?.name}</span>;
  }
  return (
    <div className="text-left">
      <p className="text-sm font-semibold text-white">{value.name}</p>
      <p className="text-xs text-white/60">
        {Number(value.memberCount).toLocaleString("en-IN")} members · Click below for details
      </p>
    </div>
  );
}

export function IndiaMap({ states }: { states: StateMapPoint[] }) {
  const [active, setActive] = useState<StateMapPoint | null>(null);
  const [region, setRegion] = useState<string>("All");
  const [view, setView] = useState<"map" | "list">("map");

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);
  const filtered = region === "All" ? states : states.filter((s) => s.region === region);

  const regionData = useMemo(() => {
    const data: Record<string, RegionDataValue> = {};
    for (const s of filtered) {
      data[s.stateName] = {
        value: s.memberCount,
        memberCount: s.memberCount,
        name: s.stateName,
      };
    }
    return data;
  }, [filtered]);

  const findState = (name?: string) => (name ? states.find((s) => s.stateName === name) : undefined);

  return (
    <div className="relative">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
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
        <button
          onClick={() => setView(view === "map" ? "list" : "map")}
          className="rounded-full border border-border px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-navy-700 hover:bg-secondary lg:hidden"
        >
          {view === "map" ? "View as list" : "View map"}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div
          className={cn(
            "relative overflow-hidden rounded-3xl border border-border bg-white p-2 sm:p-4",
            view === "list" && "hidden lg:block"
          )}
        >
          <div className="min-h-[360px] sm:min-h-[480px] [&_svg]:h-auto [&_svg]:w-full">
            <DatamapsIndia
              regionData={regionData}
              hoverComponent={HoverCard}
              onClick={(name: string) => {
                const match = findState(name);
                if (match) setActive(match);
              }}
              mapLayout={{
                startColor: COVERED_FILL,
                endColor: COVERED_FILL,
                hoverColor: COVERED_HOVER,
                noDataColor: UNCOVERED_FILL,
                borderColor: BORDER_COLOR,
                hoverBorderColor: BORDER_COLOR,
                hoverTitle: "Members",
              }}
            />
          </div>

          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-xl border border-border bg-white/90 px-3 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: COVERED_FILL }} />
            <span className="text-[10px] font-medium uppercase tracking-wide text-navy-700/70">FAIITA Covered State</span>
          </div>
        </div>

        <div className={cn("flex flex-col gap-4", view === "map" && "hidden lg:flex")}>
          {active ? (
            <StateDetailCard state={active} onClose={() => setActive(null)} />
          ) : (
            <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              Select a state on the map, or from the list below, to view its association details.
            </div>
          )}

          <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-3xl border border-border p-3">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition-colors",
                  active?.id === s.id ? "bg-navy-700 text-white" : "hover:bg-secondary"
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{s.stateName}</span>
                  <span className={cn("text-xs", active?.id === s.id ? "text-white/60" : "text-muted-foreground")}>
                    {s.associationName}
                  </span>
                </span>
                <span className="font-mono text-xs">{s.memberCount.toLocaleString("en-IN")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StateDetailCard({ state, onClose }: { state: StateMapPoint; onClose: () => void }) {
  return (
    <div className="relative rounded-3xl border border-border bg-card p-7">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        aria-label="Close details"
      >
        ×
      </button>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-900">
        {state.region} Zone
      </span>
      <h3 className="mt-4 font-display text-2xl font-bold text-navy-800">{state.stateName}</h3>
      <p className="text-sm font-medium text-saffron-600">{state.associationName}</p>

      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-xl bg-secondary p-4">
          <Users className="h-4 w-4 text-navy-700" />
          <p className="mt-2 font-mono text-lg font-bold text-navy-800">{state.memberCount.toLocaleString("en-IN")}</p>
          <p className="text-xs text-muted-foreground">Members</p>
        </div>
        <div className="rounded-xl bg-secondary p-4">
          <Building2 className="h-4 w-4 text-navy-700" />
          <p className="mt-2 font-mono text-lg font-bold text-navy-800">{state.foundedYear ?? "—"}</p>
          <p className="text-xs text-muted-foreground">Founded</p>
        </div>
      </div>

      <Link
        href={`/about/state-associations/${state.slug}`}
        className="link-underline mt-6 flex items-center gap-1.5 text-sm font-semibold text-navy-700"
      >
        <ArrowRight className="h-3.5 w-3.5" /> View full state profile
      </Link>
    </div>
  );
}
