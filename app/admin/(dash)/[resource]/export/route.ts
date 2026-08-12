import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { delegate, type Row } from "@/lib/admin/db";
import { getResource } from "@/lib/admin/resources";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** RFC 4180 field escaping — quote whenever the value could be misread otherwise. */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text =
    value instanceof Date
      ? formatDate(value, { month: "short" })
      : typeof value === "boolean"
        ? value
          ? "Yes"
          : "No"
        : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

function toCsv(rows: Row[], columns: { name: string; label: string }[]): string {
  const header = columns.map((c) => csvCell(c.label)).join(",");
  const body = rows.map((row) => columns.map((c) => csvCell(row[c.name])).join(","));
  // Excel needs a UTF-8 BOM to render non-ASCII (names, etc.) correctly.
  return "﻿" + [header, ...body].join("\r\n");
}

export async function GET(_req: Request, { params }: { params: Promise<{ resource: string }> }) {
  await requireAdmin();
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  const rows = await delegate(resource.model).findMany({
    where: resource.softDelete ? { deletedAt: null } : undefined,
    orderBy: resource.orderBy,
  });

  const csv = toCsv(
    rows,
    resource.fields.map((f) => ({ name: f.name, label: f.label })),
  );

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${resource.key}-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
