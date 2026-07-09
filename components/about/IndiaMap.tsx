"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, MapPin, Users } from "lucide-react";
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
  return m ? m[1].toUpperCase() : null;
}

export function IndiaMap({ states }: { states: StateMapPoint[] }) {
  const [active, setActive] = useState<StateMapPoint | null>(null);
  const [hovered, setHovered] = useState<{ name: string; x: number; y: number } | null>(null);
  const [region, setRegion] = useState<string>("All");
  const [view, setView] = useState<"map" | "list">("map");
  const [mapStatus, setMapStatus] = useState<"loading" | "ready" | "missing">("loading");
  const containerRef = useRef<HTMLDivElement>(null);

  const regions = useMemo(() => ["All", ...Array.from(new Set(states.map((s) => s.region)))], [states]);
  const filtered = region === "All" ? states : states.filter((s) => s.region === region);
  const findState = (shape: Element) => {
    const code = getShapeStateCode(shape);
    const byCode = code ? states.find((s) => s.stateCode.toUpperCase() === code) : undefined;
    return byCode ?? states.find((s) => normalize(s.stateName) === normalize(getShapeStateName(shape)));
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

    shapes.forEach((shape) => {
      const match = findState(shape);
      const isCovered = match && filtered.includes(match);

      shape.style.fill = isCovered ? COVERED_FILL : UNCOVERED_FILL;
      shape.style.stroke = BORDER_COLOR;
      shape.style.strokeWidth = "0.75";
      shape.style.transition = "fill 0.15s ease";
      shape.style.cursor = match ? "pointer" : "default";

      const onEnter = (e: Event) => {
        if (!match) return;
        shape.style.fill = COVERED_HOVER;
        const me = e as MouseEvent;
        setHovered({ name: match.stateName, x: me.clientX, y: me.clientY });
      };
      const onMove = (e: Event) => {
        if (!match) return;
        const me = e as MouseEvent;
        setHovered({ name: match.stateName, x: me.clientX, y: me.clientY });
      };
      const onLeave = () => {
        shape.style.fill = isCovered ? COVERED_FILL : UNCOVERED_FILL;
        setHovered(null);
      };
      const onClick = () => {
        if (match) setActive(match);
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
  }, [mapStatus, filtered]);

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
