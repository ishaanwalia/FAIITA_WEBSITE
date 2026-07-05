"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Users, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StateMapPoint } from "@/types";

// Low-poly silhouette of India — a deliberate faceted / crystalline style
// rather than a literal traced coastline, so it reads as "illustrated" and
// pairs with the network-node motif used across the site (loader, hero).
const OUTLINE = [
  [34, 3], [44, 6], [58, 10], [66, 14], [72, 12], [82, 17], [80, 24],
  [83, 30], [78, 35], [70, 33], [65, 30], [68, 38], [60, 45], [52, 55],
  [50, 65], [46, 75], [42, 88], [30, 80], [24, 65], [20, 55], [16, 45],
  [10, 38], [16, 30], [22, 22], [28, 14],
];
const CENTER: [number, number] = [45, 45];

const COVERED_COLOR = "#F2921D"; // saffron — every FAIITA-covered state
const GRID_COLOR = "#0B2A4A"; // navy grid lines, per theme

function outlinePath() {
  return `M ${OUTLINE.map(([x, y]) => `${x},${y}`).join(" L ")} Z`;
}

export function IndiaMap({ states }: { states: StateMapPoint[] }) {
  const [active, setActive] = useState<StateMapPoint | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [region, setRegion] = useState<string>("All");
  const [view, setView] = useState<"map" | "list">("map");

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);
  const filtered = region === "All" ? states : states.filter((s) => s.region === region);

  const maxMembers = Math.max(...states.map((s) => s.memberCount), 1);
  const radiusFor = (count: number) => 1.1 + (count / maxMembers) * 2;

  const facets = OUTLINE.map((point, i) => {
    const next = OUTLINE[(i + 1) % OUTLINE.length];
    return { a: point, b: next, id: i };
  });

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
            "relative overflow-hidden rounded-3xl border border-border bg-white p-4",
            view === "list" && "hidden lg:block"
          )}
        >
          <svg viewBox="-5 -5 110 110" className="h-full w-full min-h-[480px]" aria-hidden={false} role="img" aria-label="Interactive map of India showing FAIITA state associations">
            {/* faceted low-poly grid — white fill, navy grid lines */}
            {facets.map((f) => (
              <polygon
                key={f.id}
                points={`${CENTER[0]},${CENTER[1]} ${f.a[0]},${f.a[1]} ${f.b[0]},${f.b[1]}`}
                fill={f.id % 2 === 0 ? "#FFFFFF" : "#F7F9FC"}
                stroke={GRID_COLOR}
                strokeOpacity="0.25"
                strokeWidth="0.15"
              />
            ))}
            <path d={outlinePath()} fill="none" stroke={GRID_COLOR} strokeOpacity="0.55" strokeWidth="0.35" />

            {/* connective lines between nearby state nodes, echoing the federation-network signature */}
            {filtered.map((s, i) =>
              filtered.slice(i + 1, i + 3).map((t) => (
                <line
                  key={`${s.id}-${t.id}`}
                  x1={s.mapX}
                  y1={s.mapY}
                  x2={t.mapX}
                  y2={t.mapY}
                  stroke={COVERED_COLOR}
                  strokeWidth="0.1"
                  opacity="0.2"
                />
              ))
            )}

            {filtered.map((s) => {
              const r = radiusFor(s.memberCount);
              const isActive = active?.id === s.id;
              const isHovered = hovered === s.id;
              return (
                <g
                  key={s.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setHovered(s.id)}
                  onMouseLeave={() => setHovered((h) => (h === s.id ? null : h))}
                  onClick={() => setActive(s)}
                  tabIndex={0}
                  role="button"
                  aria-label={`${s.stateName} — ${s.associationName}`}
                  onKeyDown={(e) => e.key === "Enter" && setActive(s)}
                >
                  {(isHovered || isActive) && (
                    <circle cx={s.mapX} cy={s.mapY} r={r + 2} fill={COVERED_COLOR} opacity="0.25" className="animate-pulse-ring origin-center" />
                  )}
                  <circle
                    cx={s.mapX}
                    cy={s.mapY}
                    r={r}
                    fill={COVERED_COLOR}
                    stroke="#ffffff"
                    strokeWidth={isActive ? 0.5 : 0.25}
                    opacity={isHovered || isActive ? 1 : 0.85}
                  />
                </g>
              );
            })}
          </svg>

          <AnimatePresence>
            {hovered && !active && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute bottom-5 left-5 rounded-xl border border-navy-700/10 bg-navy-800 px-4 py-2.5 text-white shadow-xl"
              >
                {(() => {
                  const s = filtered.find((x) => x.id === hovered);
                  if (!s) return null;
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
            <span className="h-2 w-2 rounded-full" style={{ background: COVERED_COLOR }} />
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
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered((h) => (h === s.id ? null : h))}
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
