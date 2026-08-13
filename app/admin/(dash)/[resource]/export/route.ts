import ExcelJS from "exceljs";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { delegate, type Row } from "@/lib/admin/db";
import { getResource, type Field } from "@/lib/admin/resources";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

/** Column width in characters — wide enough for the field's own content, not just its label. */
function columnWidth(field: Field): number {
  if (field.type === "textarea" || field.type === "lines") return 50;
  if (field.type === "boolean") return 10;
  if (field.type === "date") return 20;
  if (field.name.toLowerCase().includes("email")) return 28;
  return Math.min(Math.max(field.label.length + 4, 16), 32);
}

/** Every date on this site renders in IST (see lib/utils.ts) — a raw Excel
 *  date cell carries no timezone, so it would silently reformat to whatever
 *  zone the sheet is opened in. A pre-formatted IST string sidesteps that. */
function cellValue(field: Field, raw: unknown): string | number {
  if (raw === null || raw === undefined) return "";
  if (field.type === "date") return formatDateTime(raw instanceof Date ? raw : new Date(raw as string));
  if (field.type === "boolean") return raw ? "Yes" : "No";
  if (field.type === "number") return raw as number;
  if (field.type === "lines" && Array.isArray(raw)) {
    const [primaryKey, secondaryKey] = field.keys ?? ["text", "url"];
    return raw
      .map((item) => {
        const row = item as Row;
        const primary = row[primaryKey];
        const secondary = secondaryKey ? row[secondaryKey] : undefined;
        return secondary ? `${primary} — ${secondary}` : String(primary ?? "");
      })
      .join("\n");
  }
  return String(raw);
}

export async function GET(_req: Request, { params }: { params: Promise<{ resource: string }> }) {
  await requireAdmin();
  const resource = getResource((await params).resource);
  if (!resource) notFound();

  const rows = await delegate(resource.model).findMany({
    where: resource.softDelete ? { deletedAt: null } : undefined,
    orderBy: resource.orderBy,
  });

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(resource.label.slice(0, 31)); // Excel's own sheet-name limit

  sheet.columns = resource.fields.map((field) => ({
    header: field.label,
    key: field.name,
    width: columnWidth(field),
  }));

  const headerRow = sheet.getRow(1);
  headerRow.font = { name: "Arial", bold: true, color: { argb: "FFFFFFFF" } };
  headerRow.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF1F3864" } };
  headerRow.alignment = { vertical: "middle" };

  for (const row of rows) {
    const values: Record<string, string | number> = {};
    for (const field of resource.fields) values[field.name] = cellValue(field, row[field.name]);
    const added = sheet.addRow(values);
    added.font = { name: "Arial", size: 10 };
    added.alignment = { vertical: "top", wrapText: resource.fields.some((f) => f.type === "textarea" || f.type === "lines") };
  }

  sheet.views = [{ state: "frozen", ySplit: 1 }];
  if (rows.length > 0) sheet.autoFilter = { from: "A1", to: { row: 1, column: resource.fields.length } };

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="${resource.key}-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
