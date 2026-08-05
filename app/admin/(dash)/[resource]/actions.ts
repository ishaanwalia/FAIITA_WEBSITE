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
    if (path.includes("[")) revalidatePath(path, "page");
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
      const created = await delegate(resource.model).create({ data });
      await record(admin, "create", resource, String(created.id), String(data[resource.labelField] ?? created.id));
    }
  } catch (error) {
    return { error: friendly(error, resource) };
  }

  publish(resource);
  redirect(`/admin/${resource.key}${backTo(form)}`);
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
