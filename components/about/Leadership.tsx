"use client";

import { useState } from "react";
import { Mail, Phone } from "lucide-react";
import { TiltCard } from "@/components/common/TiltCard";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";

export type LeaderData = {
  id: string;
  name: string;
  role: string;
  associationName: string | null;
  stateName: string | null;
  email: string | null;
  phone: string | null;
  term: string;
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

export function Leadership({
  current,
  past,
}: {
  current: LeaderData[];
  past: LeaderData[];
}) {
  const [tab, setTab] = useState<"current" | "past">("current");
  const list = tab === "current" ? current : past;

  return (
    <div>
      <div className="mx-auto flex w-fit gap-1 rounded-full border border-border bg-secondary/60 p-1">
        {(["current", "past"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              tab === t ? "bg-navy-700 text-white" : "text-muted-foreground hover:text-navy-700"
            )}
          >
            {t === "current" ? `Current GB (${current[0]?.term ?? ""})` : `Past GB (${past[0]?.term ?? ""})`}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((l, i) => (
          <ScrollReveal key={l.id} direction="up" delay={i * 0.05}>
            <TiltCard maxTilt={6}>
              <GlassCard variant="light" className="text-center">
                <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-navy-700 font-display text-xl font-bold text-white">
                  {initials(l.name)}
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-800">{l.name}</h3>
                <p className="text-sm font-semibold text-saffron-600">{l.role}</p>
                {l.associationName && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    {l.associationName}
                    {l.stateName ? ` · ${l.stateName}` : ""}
                  </p>
                )}
                {tab === "current" && (l.email || l.phone) && (
                  <div className="mt-4 flex justify-center gap-3 border-t border-navy-700/10 pt-4">
                    {l.email && (
                      <a href={`mailto:${l.email}`} className="text-muted-foreground hover:text-navy-700" aria-label={`Email ${l.name}`}>
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                    {l.phone && (
                      <a href={`tel:${l.phone}`} className="text-muted-foreground hover:text-navy-700" aria-label={`Call ${l.name}`}>
                        <Phone className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </GlassCard>
            </TiltCard>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}
