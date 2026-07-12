"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, Mail, MapPin, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StateMapPoint } from "@/types";

const COVERED_FILL = "#F2921D";
const COVERED_HOVER = "#D97A0E";
const UNCOVERED_FILL = "#F1F5F9";
const BORDER_COLOR = "#0B2A4A";

// Public-domain SVG maps often carry dated or variant state names — fold
// them into the names used in the database before comparing.
const NAME_ALIASES: Record<string, string> = {
  orissa: "odisha",
  uttaranchal: "uttarakhand",
  pondicherry: "puducherry",
  // The SVG draws Ladakh as its own shape; FAIITA data treats the whole
  // northern region as Jammu & Kashmir, so both shapes select together.
  ladakh: "jammuandkashmir",
  // NECTA (HQ Guwahati) covers the entire North-East — Sikkim and the seven
  // sister states select together as one unit on the map.
  assam: "northeast",
  sikkim: "northeast",
  arunachalpradesh: "northeast",
  nagaland: "northeast",
  manipur: "northeast",
  mizoram: "northeast",
  tripura: "northeast",
  meghalaya: "northeast",
};

// Same idea for ISO shape codes (id="INLA" → belongs with "JK").
const CODE_ALIASES: Record<string, string> = {
  LA: "JK",
  // North-East shapes all belong to NECTA, stored under Assam's "AS" code.
  SK: "AS",
  AR: "AS",
  NL: "AS",
  MN: "AS",
  MZ: "AS",
  TR: "AS",
  ML: "AS",
};

function normalize(name: string) {
  const n = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z]/g, "");
  return NAME_ALIASES[n] ?? n;
}

// Real-world SVG maps identify each state through different attributes
// depending on the source — check the common ones so this keeps working
// regardless of which free SVG map you drop in.
function getShapeStateName(el: Element): string {
  const attr =
    el.getAttribute("name") ||
    el.getAttribute("data-name") ||
    el.getAttribute("aria-label") ||
    el.querySelector("title")?.textContent ||
    el.getAttribute("id") ||
    "";
  return attr.replace(/^IN[-_]?/i, "").replace(/[-_]/g, " ").trim();
}

// ISO 3166-2 shape ids like "INJK" carry the same two-letter code stored as
// stateCode in the database — the most reliable way to link shape and data.
function getShapeStateCode(el: Element): string | null {
  const m = /^IN[-_]?([A-Z]{2})$/i.exec(el.getAttribute("id") || "");
  if (!m) return null;
  const code = m[1].toUpperCase();
  return CODE_ALIASES[code] ?? code;
}

/** All associations of one state — several states have more than one. */
type StateGroup = {
  stateName: string;
  stateCode: string;
  region: string;
  associations: StateMapPoint[];
};

export function IndiaMap({ states }: { states: StateMapPoint[] }) {
  const [active, setActive] = useState<StateGroup | null>(null);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [region, setRegion] = useState<string>("All");
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing">("loading");
  const containerRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  // On small screens the detail card sits below the map, so a tap on the map
  // must bring it into view — otherwise the selection appears to do nothing.
  const selectGroup = (group: StateGroup | null) => {
    setActive(group);
    if (group && typeof window !== "undefined" && window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);
  const filtered = region === "All" ? states : states.filter((s) => s.region === region);

  const groups = useMemo(() => {
    const map = new Map<string, StateGroup>();
    for (const s of filtered) {
      const g = map.get(s.stateCode) ?? {
        stateName: s.stateName,
        stateCode: s.stateCode,
        region: s.region,
        associations: [],
      };
      g.associations.push(s);
      map.set(s.stateCode, g);
    }
    return map;
  }, [filtered]);

  const findGroup = (shape: Element): StateGroup | undefined => {
    const code = getShapeStateCode(shape);
    if (code && groups.has(code)) return groups.get(code);
    const name = normalize(getShapeStateName(shape));
    for (const g of groups.values()) {
      if (normalize(g.stateName) === name) return g;
    }
    return undefined;
  };

  useEffect(() => {
    let cancelled = false;
    fetch("/india-map.svg")
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.text();
      })
      .then((svgText) => {
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svgText;
        const svg = containerRef.current.querySelector("svg");
        if (svg) {
          svg.setAttribute("width", "100%");
          svg.setAttribute("height", "100%");
          svg.removeAttribute("style");
        }
        setMapStatus("ready");
      })
      .catch(() => {
        if (!cancelled) setMapStatus("missing");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (mapStatus !== "ready" || !containerRef.current) return;
    const shapes = containerRef.current.querySelectorAll<SVGElement>("path, polygon");
    const cleanups: (() => void)[] = [];

    // Shapes that belong to the same state (e.g. the separately drawn J&K and
    // Ladakh paths) must hover/highlight together as one region.
    const shapesByCode = new Map<string, SVGElement[]>();
    shapes.forEach((shape) => {
      const g = findGroup(shape);
      if (!g) return;
      shapesByCode.set(g.stateCode, [...(shapesByCode.get(g.stateCode) ?? []), shape]);
    });
    const setGroupFill = (code: string, fill: string) =>
      shapesByCode.get(code)?.forEach((s) => (s.style.fill = fill));

    shapes.forEach((shape) => {
      const match = findGroup(shape);
      const isCovered = Boolean(match);

      shape.style.fill = isCovered ? COVERED_FILL : UNCOVERED_FILL;
      shape.style.stroke = BORDER_COLOR;
      shape.style.strokeWidth = "0.75";
      shape.style.transition = "fill 0.15s ease";
      shape.style.cursor = match ? "pointer" : "default";

      const onEnter = (e: Event) => {
        if (!match) return;
        setGroupFill(match.stateCode, COVERED_HOVER);
        const me = e as MouseEvent;
        setHovered({ name: match.stateName, x: me.clientX, y: me.clientY });
      };
      const onMove = (e: Event) => {
        if (!match) return;
        const me = e as MouseEvent;
        setHovered({ name: match.stateName, x: me.clientX, y: me.clientY });
      };
      const onLeave = () => {
        if (match) setGroupFill(match.stateCode, COVERED_FILL);
        else shape.style.fill = UNCOVERED_FILL;
        setHovered(null);
      };
      const onClick = () => {
        if (match) selectGroup(match);
      };

      shape.addEventListener("mouseenter", onEnter);
      shape.addEventListener("mousemove", onMove);
      shape.addEventListener("mouseleave", onLeave);
      shape.addEventListener("click", onClick);

      cleanups.push(() => {
        shape.removeEventListener("mouseenter", onEnter);
        shape.removeEventListener("mousemove", onMove);
        shape.removeEventListener("mouseleave", onLeave);
        shape.removeEventListener("click", onClick);
      });
    });

    return () => cleanups.forEach((fn) => fn());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapStatus, groups]);

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
      </div>

      {/* Mobile stacks map → detail → list so a tap always has a visible result;
          desktop keeps the two-column layout. */}
      <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-white p-2 sm:p-4">
          <div ref={containerRef} className="min-h-[360px] sm:min-h-[480px] [&_svg]:h-auto [&_svg]:w-full" />

          {mapStatus === "missing" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white p-8 text-center">
              <MapPin className="h-6 w-6 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Map graphic coming soon.</p>
            </div>
          )}
          {mapStatus === "loading" && (
            <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
              Loading map…
            </div>
          )}

          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{ position: "fixed", left: hovered.x + 14, top: hovered.y + 14 }}
                className="pointer-events-none z-50 rounded-lg bg-navy-800 px-3 py-1.5 text-xs font-semibold text-white shadow-xl"
              >
                {hovered.name}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute right-5 top-5 flex items-center gap-2 rounded-xl border border-border bg-white/90 px-3 py-2 shadow-sm">
            <span className="h-2 w-2 rounded-full" style={{ background: COVERED_FILL }} />
            <span className="text-[10px] font-medium uppercase tracking-wide text-navy-700/70">FAIITA Covered State</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* scroll-mt clears the fixed navbar when the mobile auto-scroll lands here */}
          <div ref={detailRef} className="scroll-mt-24">
            {active ? (
              <StateDetailCard group={active} onClose={() => setActive(null)} />
            ) : (
              <div className="rounded-3xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Select a state on the map, or from the list below, to view its association details.
              </div>
            )}
          </div>

          <div className="max-h-[360px] space-y-2 overflow-y-auto rounded-3xl border border-border p-3">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => selectGroup(groups.get(s.stateCode) ?? null)}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left transition-colors",
                  active?.stateCode === s.stateCode ? "bg-navy-700 text-white" : "hover:bg-secondary"
                )}
              >
                <span>
                  <span className="block text-sm font-semibold">{s.stateName}</span>
                  <span className={cn("text-xs", active?.stateCode === s.stateCode ? "text-white/60" : "text-muted-foreground")}>
                    {s.associationName}
                  </span>
                </span>
                {s.memberCount > 0 && (
                  <span className="shrink-0 font-mono text-xs">{s.memberCount.toLocaleString("en-IN")}</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StateDetailCard({ group, onClose }: { group: StateGroup; onClose: () => void }) {
  const totalMembers = group.associations.reduce((sum, a) => sum + a.memberCount, 0);

  return (
    <div className="relative max-h-[480px] overflow-y-auto rounded-3xl border border-border bg-card p-7">
      <button
        onClick={onClose}
        className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary"
        aria-label="Close details"
      >
        ×
      </button>
      <span className="inline-flex items-center gap-1.5 rounded-full bg-saffron-500 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-navy-900">
        {group.region} Zone
      </span>
      <h3 className="mt-4 font-display text-2xl font-bold text-navy-800">{group.stateName}</h3>
      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Building2 className="h-3.5 w-3.5" />
        {group.associations.length}{" "}
        {group.associations.length === 1 ? "affiliated association" : "affiliated associations"}
        {totalMembers > 0 && <> · {totalMembers.toLocaleString("en-IN")} members</>}
      </p>

      <div className="mt-5 space-y-3">
        {group.associations.map((a) => (
          <div key={a.id} className="rounded-2xl bg-secondary p-4">
            <p className="text-sm font-semibold text-navy-800">{a.associationName}</p>
            {/* President names and phone numbers are intentionally not shown —
                office bearers rotate per association; see the state detail page. */}
            <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
              {a.memberCount > 0 && (
                <p className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 shrink-0 text-navy-700" />
                  {a.memberCount.toLocaleString("en-IN")} members
                  {a.foundedYear && <> · since {a.foundedYear}</>}
                </p>
              )}
              {a.contactEmail && (
                <a href={`mailto:${a.contactEmail}`} className="flex items-center gap-1.5 hover:text-navy-700">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-navy-700" /> {a.contactEmail}
                </a>
              )}
            </div>
            <Link
              href={`/about/state-associations/${a.slug}`}
              className="link-underline mt-3 flex w-fit items-center gap-1.5 text-xs font-semibold text-navy-700"
            >
              <ArrowRight className="h-3 w-3" /> View full profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
