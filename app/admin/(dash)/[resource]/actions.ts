"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, type AdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { delegate } from "@/lib/admin/db";
import { diff, parseForm, type Changes, type Row } from "@/lib/admin/form";
import { getResource, type Resource } from "@/lib/admin/resources";

export type FormState = { error?: string };

async function record(
  admin: AdminSession,
  action: "create" | "update" | "delete" | "restore" | "purge",
  resource: Resource,
  recordId: string,
  recordLabel: string,
  changes: Changes | null = null,
): Promise<void> {
  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      actorEmail: admin.email,
      action,
      model: resource.model,
      recordId,
      recordLabel,
      changes: changes ?? undefined,
    },
  });
}

/**
 * 5.10 — every write purges the pages that render it, so an edit is live on
 * the next request rather than at the next deploy. Paths with a [slug] segment
 * revalidate every page built from that route.
 */
function publish(resource: Resource): void {
  for (const path of resource.revalidate) {
    // Dynamic pages live under the `(site)` route group. revalidatePath's
    // pattern matching works against the file structure, not the URL, so the
    // group segment must be included here or the purge silently matches
    // nothing — see node_modules/next/dist/docs/.../revalidatePath.md.
    if (path.includes("[")) revalidatePath(`/(site)${path}`, "page");
    else revalidatePath(path);
  }
}

function friendly(error: unknown, resource: Resource): string {
  const message = error instanceof Error ? error.message : String(error);
  if (message.includes("Unique constraint")) {
    return `Another ${resource.singular} already uses that URL slug. Change it and save again.`;
  }
  return message;
}

/**
 * The last position currently in use. Scoped to the parent where there is one
 * — photo 12 of one album has nothing to do with photo 12 of another.
 */
async function highestOrder(resource: Resource, data: Row): Promise<number> {
  const where: Row = {};
  if (resource.softDelete) where.deletedAt = null;
  if (resource.parent) where[resource.parent.foreignKey] = data[resource.parent.foreignKey];

  const rows = await delegate(resource.model).findMany({
    where,
    orderBy: { order: "desc" },
    take: 1,
  });
  const top = rows[0]?.order;
  return typeof top === "number" ? top : 0;
}

/** Preserve the ?albumId=… filter when returning to a child list. */
function backTo(form: FormData): string {
  const filter = String(form.get("__filter") ?? "");
  return filter ? `?${filter}` : "";
}

export async function saveResource(_prev: FormState, form: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const resource = getResource(String(form.get("__resource") ?? ""));
  if (!resource) return { error: "Unknown section." };

  const id = String(form.get("__id") ?? "");

  let data: Row;
  try {
    data = parseForm(resource, form);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "That didn't save." };
  }

  try {
    if (id) {
      const before = await delegate(resource.model).findUnique({ where: { id } });
      if (!before) return { error: "That record no longer exists." };
      const changes = diff(before, data);
      // Nothing changed — no write, and no audit entry saying so.
      if (changes) {
        await delegate(resource.model).update({ where: { id }, data });
        await record(admin, "update", resource, id, String(data[resource.labelField] ?? id), changes);
      }
    } else {
      // A sortable record joins at the end of the list, where it can't collide
      // with an existing position. `order` defaults to 0 in the schema, so
      // without this every new album, photo, leader and testimonial would land
      // on top of whatever already held 0 and the tie would break arbitrarily.
      // Dragging is how it gets moved from there.
      if (resource.sortable) data.order = (await highestOrder(resource, data)) + 1;

      const created = await delegate(resource.model).create({ data });
      await record(admin, "create", resource, String(created.id), String(data[resource.labelField] ?? created.id));
    }
  } catch (error) {
    return { error: friendly(error, resource) };
  }

  publish(resource);
  redirect(`/admin/${resource.key}${backTo(form)}`);
}

/**
 * Rewrite positions to match the order the ids arrive in.
 *
 * Every visible row is renumbered 1..n rather than only the one that moved, so
 * the column can never develop gaps, duplicates or a 0 that silently ties with
 * something else. One transaction, so a half-applied reorder isn't possible.
 *
 * One audit entry for the whole drag, not n — a reorder is one editorial act.
 */
export async function reorderResource(resourceKey: string, ids: string[]): Promise<void> {
  const admin = await requireAdmin();
  const resource = getResource(resourceKey);
  if (!resource?.sortable || ids.length === 0) return;

  const rows = await delegate(resource.model).findMany({ where: { id: { in: ids } } });
  if (rows.length !== ids.length) return; // an id we don't own, or a stale page

  await renumber(admin, resource, ids, rows);
}

/**
 * The keyboard, touch and no-JavaScript path: nudge one row one place.
 *
 * A plain form submit rather than a click handler, so the arrows work before
 * React has hydrated and on a browser where it never does. It re-reads the
 * list server-side rather than trusting a position sent from the page, so two
 * people nudging at once can't interleave into nonsense.
 */
export async function moveResource(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const resource = getResource(String(form.get("__resource") ?? ""));
  const id = String(form.get("__id") ?? "");
  const delta = form.get("__direction") === "up" ? -1 : 1;
  if (!resource?.sortable || !id) return;

  const where: Row = {};
  if (resource.softDelete) where.deletedAt = null;
  const scope = String(form.get("__scope") ?? "");
  if (resource.parent && scope) where[resource.parent.foreignKey] = scope;

  const rows = await delegate(resource.model).findMany({ where, orderBy: resource.orderBy });
  const from = rows.findIndex((r) => String(r.id) === id);
  const to = from + delta;
  if (from === -1 || to < 0 || to >= rows.length) return;

  const ids = rows.map((r) => String(r.id));
  ids.splice(to, 0, ids.splice(from, 1)[0]);
  await renumber(admin, resource, ids, rows);
}

/**
 * Rewrite positions to match the order the ids arrive in.
 *
 * Every row is renumbered 1..n rather than only the one that moved, so the
 * column can never develop gaps, duplicates, or a 0 that silently ties with
 * something else. One transaction, so a half-applied reorder isn't possible.
 * One audit entry for the whole move — a reorder is one editorial act, not n.
 */
async function renumber(admin: AdminSession, resource: Resource, ids: string[], rows: Row[]): Promise<void> {
  const was = new Map(rows.map((r) => [String(r.id), r.order as number]));
  const moved = ids.filter((id, i) => was.get(id) !== i + 1);
  if (moved.length === 0) return;

  // The array form, not $transaction(async tx => …). An interactive
  // transaction holds one connection open across several awaits, which does
  // not survive Neon's pooler — it answered P2028 "Transaction not found" every
  // time. The array form is one batched round trip and is still atomic.
  type Batch = Parameters<typeof prisma.$transaction>[0] & unknown[];
  const model = (prisma as unknown as Record<string, { update(args: unknown): Batch[number] }>)[resource.model];
  const updates = ids
    .map((id, i) => (was.get(id) === i + 1 ? null : model.update({ where: { id }, data: { order: i + 1 } })))
    .filter((u): u is Batch[number] => u !== null) as Batch;

  await prisma.$transaction(updates);

  const first = rows.find((r) => String(r.id) === moved[0]);
  await record(admin, "update", resource, moved[0], String(first?.[resource.labelField] ?? moved[0]), {
    order: { from: `${moved.length} rows out of position`, to: `reordered, now 1–${ids.length}` },
  });
  publish(resource);
}

export async function deleteResource(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const resource = getResource(String(form.get("__resource") ?? ""));
  const id = String(form.get("__id") ?? "");
  if (!resource || !id) return;

  const row = await delegate(resource.model).findUnique({ where: { id } });
  if (!row) return;
  const label = String(row[resource.labelField] ?? id);

  if (resource.softDelete) {
    await delegate(resource.model).update({ where: { id }, data: { deletedAt: new Date() } });
    await record(admin, "delete", resource, id, label);
  } else {
    // No deletedAt column on this model, so there is nothing to restore from.
    await delegate(resource.model).delete({ where: { id } });
    await record(admin, "purge", resource, id, label);
  }
  publish(resource);
}

export async function restoreResource(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const resource = getResource(String(form.get("__resource") ?? ""));
  const id = String(form.get("__id") ?? "");
  if (!resource || !id) return;

  const row = await delegate(resource.model).update({ where: { id }, data: { deletedAt: null } });
  await record(admin, "restore", resource, id, String(row[resource.labelField] ?? id));
  publish(resource);
}

export async function purgeResource(form: FormData): Promise<void> {
  const admin = await requireAdmin();
  const resource = getResource(String(form.get("__resource") ?? ""));
  const id = String(form.get("__id") ?? "");
  if (!resource || !id) return;

  const row = await delegate(resource.model).findUnique({ where: { id } });
  if (!row) return;
  await delegate(resource.model).delete({ where: { id } });
  await record(admin, "purge", resource, id, String(row[resource.labelField] ?? id));
}
