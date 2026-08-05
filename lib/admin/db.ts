import "server-only";

import { prisma } from "@/lib/prisma";
import { getResource, type Resource } from "./resources";

/**
 * The generic screens address Prisma by model name, which the generated client
 * has no type for. This is the one place that cast lives: everything above it
 * works against Row and Delegate rather than `any`.
 */
export type { Row } from "./form";

type Row = Record<string, unknown>;

type Delegate = {
  findUnique(args: unknown): Promise<Row | null>;
  findMany(args?: unknown): Promise<Row[]>;
  create(args: unknown): Promise<Row>;
  update(args: unknown): Promise<Row>;
  delete(args: unknown): Promise<Row>;
  deleteMany(args: unknown): Promise<{ count: number }>;
  count(args?: unknown): Promise<number>;
};

export function delegate(model: string): Delegate {
  const d = (prisma as unknown as Record<string, Delegate | undefined>)[model];
  if (!d) throw new Error(`No Prisma model named ${model}`);
  return d;
}

/** How long a soft-deleted row stays restorable. */
export const PURGE_AFTER_DAYS = 30;

/**
 * Permanently remove rows deleted more than PURGE_AFTER_DAYS ago.
 *
 * ponytail: runs when someone opens Recently deleted rather than on a
 * schedule — no cron, no vercel.json, and the only cost of nobody opening it
 * is that old rows sit in the table a while longer. Move it to a cron job if
 * that ever matters.
 */
export async function purgeExpired(resource: Resource): Promise<void> {
  if (!resource.softDelete) return;
  const cutoff = new Date(Date.now() - PURGE_AFTER_DAYS * 24 * 60 * 60 * 1000);
  await delegate(resource.model).deleteMany({ where: { deletedAt: { lt: cutoff } } });
}

/**
 * { id: label } for every row a relation field can point at. Used by the edit
 * form's dropdown and by the list screen, so a foreign key never renders as a
 * cuid.
 */
export async function relationOptions(resourceKey: string): Promise<Map<string, string>> {
  const target = getResource(resourceKey);
  if (!target) return new Map();

  const rows = await delegate(target.model).findMany({
    where: target.softDelete ? { deletedAt: null } : undefined,
    orderBy: target.orderBy,
  });
  return new Map(rows.map((r) => [String(r.id), String(r[target.labelField] ?? r.id)]));
}

/** Every relation field on a resource, resolved in one pass. */
export async function allRelationOptions(
  resource: Resource,
): Promise<Record<string, [string, string][]>> {
  const relations = resource.fields.filter((f) => f.type === "relation" && f.relationTo);
  const entries = await Promise.all(
    relations.map(async (f) => [f.name, [...(await relationOptions(f.relationTo!))]]),
  );
  return Object.fromEntries(entries);
}
