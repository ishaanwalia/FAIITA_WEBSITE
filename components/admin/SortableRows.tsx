"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { reorderResource } from "@/app/admin/(dash)/[resource]/actions";

/**
 * The list body for a resource whose position is set by dragging.
 *
 * Native HTML5 drag and drop — draggable + dragover + drop — rather than a
 * drag library. There is nothing here a dependency would do better: the rows
 * are a flat list, the drop target is a sibling, and the whole interaction is
 * about twenty lines.
 *
 * HTML5 dragging is mouse-only, so the up/down buttons are not a nicety: they
 * are how this works with a keyboard, a screen reader, and on a tablet. Both
 * paths call the same move().
 *
 * Cells are formatted on the server and arrive as strings — this component
 * knows about order, not about content.
 */

export type SortableRow = {
  id: string;
  cells: string[];
  editHref: string;
  childHref?: string;
  childLabel?: string;
};

export function SortableRows({
  resourceKey,
  rows,
  scope,
  deleteAction,
  moveAction,
}: {
  resourceKey: string;
  rows: SortableRow[];
  /** Parent id when this is a filtered child list, e.g. the album for photos. */
  scope: string;
  deleteAction: (form: FormData) => void;
  moveAction: (form: FormData) => void;
}) {
  const [dragging, setDragging] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const [saving, startSaving] = useTransition();

  /**
   * No optimistic copy of the order.
   *
   * The action renumbers and revalidates, so the server re-renders this list
   * in its new order — holding a second copy here only creates a state that
   * can disagree with the database, and these lists are tens of rows, not
   * thousands. The dimmed pending state covers the round trip.
   */
  function move(from: number, to: number) {
    if (to < 0 || to >= rows.length || from === to) return;
    const next = rows.map((r) => r.id);
    next.splice(to, 0, next.splice(from, 1)[0]);

    setAnnouncement(`${rows[from].cells[0] || "Row"} moved to position ${to + 1} of ${rows.length}.`);
    startSaving(() => {
      void reorderResource(resourceKey, next);
    });
  }

  return (
    <tbody className={saving ? "opacity-60 transition-opacity" : "transition-opacity"}>
        {rows.map((row, i) => (
          <tr
            key={row.id}
            draggable
            onDragStart={(e) => {
              setDragging(row.id);
              e.dataTransfer.effectAllowed = "move";
              // Firefox refuses to start a drag without data on the transfer.
              e.dataTransfer.setData("text/plain", row.id);
            }}
            onDragEnd={() => {
              setDragging(null);
              setOver(null);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
              if (row.id !== over) setOver(row.id);
            }}
            onDrop={(e) => {
              e.preventDefault();
              const fromId = e.dataTransfer.getData("text/plain") || dragging;
              const from = rows.findIndex((r) => r.id === fromId);
              if (from !== -1) move(from, i);
              setDragging(null);
              setOver(null);
            }}
            className={[
              "border-t border-white/10 align-middle",
              dragging === row.id ? "opacity-40" : "",
              over === row.id && dragging !== row.id ? "bg-saffron-500/10" : "",
            ].join(" ")}
          >
            <td className="w-10 pl-4 text-white/25">
              <span
                aria-hidden
                className="inline-flex cursor-grab active:cursor-grabbing"
                title="Drag to reorder"
              >
                <GripVertical className="h-4 w-4" />
              </span>
            </td>

            {row.cells.map((cell, c) => (
              <td key={c} className={`px-4 py-3 ${c === 0 ? "text-white" : "text-white/50"}`}>
                {c === 0 ? (
                  <Link href={row.editHref} className="font-medium hover:text-saffron-400">
                    {cell}
                  </Link>
                ) : (
                  cell
                )}
              </td>
            ))}

            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-3 text-xs">
                {/* Plain form submits, not click handlers: the arrows are the
                    keyboard, touch and no-JavaScript path, so they must work
                    before React has hydrated. Dragging is the enhancement. */}
                <span className="flex items-center">
                  {(["up", "down"] as const).map((direction) => {
                    const atEdge = direction === "up" ? i === 0 : i === rows.length - 1;
                    const Icon = direction === "up" ? ChevronUp : ChevronDown;
                    return (
                      <form key={direction} action={moveAction}>
                        <input type="hidden" name="__resource" value={resourceKey} />
                        <input type="hidden" name="__id" value={row.id} />
                        <input type="hidden" name="__direction" value={direction} />
                        <input type="hidden" name="__scope" value={scope} />
                        <button
                          type="submit"
                          disabled={atEdge}
                          aria-label={`Move ${row.cells[0] || "row"} ${direction}`}
                          className="rounded p-1 text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40"
                        >
                          <Icon className="h-4 w-4" />
                        </button>
                      </form>
                    );
                  })}
                </span>

                {row.childHref && (
                  <Link href={row.childHref} className="text-white/40 hover:text-white">
                    {row.childLabel}
                  </Link>
                )}

                <form action={deleteAction}>
                  <input type="hidden" name="__resource" value={resourceKey} />
                  <input type="hidden" name="__id" value={row.id} />
                  <button type="submit" className="text-white/40 hover:text-red-400">
                    Delete
                  </button>
                </form>
              </div>
            </td>
          </tr>
        ))}

        {/* Dragging is silent to a screen reader, so say what happened. Lives
            in a row rather than a loose <p>: only table content is valid
            inside <table>, and a stray <p> gets hoisted out of it entirely. */}
        <tr>
          <td colSpan={rows[0] ? rows[0].cells.length + 2 : 2} aria-live="polite" className="sr-only">
            {announcement}
          </td>
        </tr>
      </tbody>
  );
}
