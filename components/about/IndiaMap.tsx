"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ComposableMap, Geographies, Geography, createCoordinates } from "@vnedyalk0v/react19-simple-maps";
import { ArrowRight, Building2, MapPin, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StateMapPoint } from "@/types";

// Real India state-boundary topojson (pinned commit — stable, won't change unexpectedly).
const GEO_URL = "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@ef25ebc/topojson/india.json";

const COVERED_FILL = "#F2921D"; // saffron — every FAIITA-covered state
const UNCOVERED_FILL = "#F1F5F9"; // near-white for anything not in our dataset (e.g. small UTs)
const BORDER_COLOR = "#0B2A4A"; // navy grid/border lines, per theme

// Different India geojson sources use different property keys for the state name —
// check the common ones so this keeps working regardless of which the CDN file uses.
function getGeoStateName(properties: Record<string, unknown>): string {
  const candidates = ["st_nm", "ST_NM", "NAME_1", "st_name", "State", "name"];
  for (const key of candidates) {
    const val = properties[key];
    if (typeof val === "string" && val.length > 0) return val;
  }
  return "";
}

function normalize(name: string) {
  return name.toLowerCase().replace(/[^a-z]/g, "");
}

export function IndiaMap({ states }: { states: StateMapPoint[] }) {
  const [active, setActive] = useState<StateMapPoint | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [region, setRegion] = useState<string>("All");
  const [view, setView] = useState<"map" | "list">("map");

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);
  const filtered = region === "All" ? states : states.filter((s) => s.region === region);
  const activeStateNames = useMemo(() => new Set(filtered.map((s) => normalize(s.stateName))), [filtered]);

  const findState = (geoName: string) =>
    states.find((s) => normalize(s.stateName) === normalize(geoName));

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
          <ComposableMap
            projection="geoMercator"
            projectionConfig={{ center: createCoordinates(83, 22.5), scale: 1000 }}
            width={700}
            height={720}
            className="h-full w-full min-h-[360px] sm:min-h-[480px]"
          >
            <Geographies geography={GEO_URL}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const geoName = getGeoStateName(geo.properties as Record<string, unknown>);
                  const match = findState(geoName);
                  const isCovered = activeStateNames.has(normalize(geoName));
                  const isHovered = hovered === geoName;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => setHovered(geoName)}
                      onMouseLeave={() => setHovered((h) => (h === geoName ? null : h))}
                      onClick={() => match && setActive(match)}
                      style={{
                        default: {
                          fill: isCovered ? COVERED_FILL : UNCOVERED_FILL,
                          stroke: BORDER_COLOR,
                          strokeWidth: 0.75,
                          outline: "none",
                          opacity: isCovered ? 0.85 : 1,
                          transition: "fill 0.15s ease, opacity 0.15s ease",
                        },
                        hover: {
                          fill: isCovered ? COVERED_FILL : "#E2E8F0",
                          stroke: BORDER_COLOR,
                          strokeWidth: 1,
                          outline: "none",
                          opacity: 1,
                          cursor: match ? "pointer" : "default",
                        },
                        pressed: {
                          fill: COVERED_FILL,
                          stroke: BORDER_COLOR,
                          strokeWidth: 1,
                          outline: "none",
                        },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>

          <AnimatePresence>
            {hovered && !active && findState(hovered) && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute bottom-5 left-5 rounded-xl border border-navy-700/10 bg-navy-800 px-4 py-2.5 text-white shadow-xl"
              >
                {(() => {
                  const s = findState(hovered)!;
                  return (
                    <>
                      <p className="text-sm font-semibold">{s.stateName}</p>
                      <p className="text-xs text-white/60">{s.memberCount.toLocaleString("en-IN")} members · Click for details</p>
                    </>
                  );
                })()}
              </motion.div>
            )}
          </AnimatePresence>

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
              Select a state on the map to view its association details, or browse the full list below.
            </div>
          )}

          <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-3xl border border-border p-3">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s)}
                onMouseEnter={() => setHovered(s.stateName)}
                onMouseLeave={() => setHovered((h) => (h === s.stateName ? null : h))}
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
    <motion.div
      key={state.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-3xl border border-border bg-card p-7"
    >
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        aria-label="Close details"
      >
        <X className="h-4 w-4" />
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
        <MapPin className="h-3.5 w-3.5" /> View full state profile <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </motion.div>
  );
}