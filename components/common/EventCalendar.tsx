"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type CalendarEvent = {
  id: string;
  slug: string;
  title: string;
  category: string;
  city: string;
  state: string;
  startDate: Date;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function EventCalendar({ events }: { events: CalendarEvent[] }) {
  const initialMonth = events[0]?.startDate ?? new Date();
  const [cursor, setCursor] = useState(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1));
  const [selected, setSelected] = useState<string | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) {
      const key = e.startDate.toDateString();
      map.set(key, [...(map.get(key) ?? []), e]);
    }
    return map;
  }, [events]);

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  const days = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstDay = new Date(year, month, 1);
    const startOffset = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: (Date | null)[] = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [cursor]);

  const selectedEvents = selected ? eventsByDay.get(selected) ?? [] : [];

  return (
    <div className="grid gap-6 rounded-3xl border border-border bg-card p-6 lg:grid-cols-[1.2fr_1fr] lg:p-8">
      <div>
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-navy-800">{monthLabel}</h3>
          <div className="flex gap-1">
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-700 hover:bg-secondary"
              aria-label="Previous month"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-navy-700 hover:bg-secondary"
              aria-label="Next month"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {WEEKDAYS.map((w) => (
            <div key={w} className="pb-2 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              {w}
            </div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            const key = day.toDateString();
            const hasEvents = eventsByDay.has(key);
            const isSelected = selected === key;
            const isToday = key === new Date().toDateString();
            return (
              <button
                key={key}
                onClick={() => setSelected(hasEvents ? key : null)}
                className={cn(
                  "relative flex h-10 flex-col items-center justify-center rounded-lg text-sm transition-colors",
                  isSelected ? "bg-navy-700 text-white" : hasEvents ? "bg-saffron-500/10 font-semibold text-navy-800 hover:bg-saffron-500/20" : "text-navy-800/70 hover:bg-secondary",
                  isToday && !isSelected && "ring-1 ring-navy-700/30"
                )}
              >
                {day.getDate()}
                {hasEvents && (
                  <span className={cn("absolute bottom-1 h-1 w-1 rounded-full", isSelected ? "bg-saffron-400" : "bg-saffron-500")} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-secondary/60 p-5">
        <h4 className="font-display text-sm font-bold text-navy-800">
          {selected ? new Date(selected).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Select a highlighted date"}
        </h4>
        <div className="mt-4 space-y-3">
          {selectedEvents.length === 0 && (
            <p className="text-sm text-muted-foreground">
              {selected ? "No events on this day." : "Days with events are marked with a dot — click one to see details."}
            </p>
          )}
          {selectedEvents.map((e) => (
            <Link
              key={e.id}
              href={`/resources/events/${e.slug}`}
              className="block rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-md"
            >
              <span className="text-[10px] font-semibold uppercase tracking-wide text-saffron-600">{e.category}</span>
              <p className="mt-1 text-sm font-semibold text-navy-800">{e.title}</p>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> {e.city}, {e.state}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
