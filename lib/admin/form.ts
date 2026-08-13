/**
 * Turning a form into a database row, and back again.
 *
 * Deliberately free of Next and Prisma imports so it can be exercised without
 * a server — see scripts/check-admin-forms.ts.
 */

import { slugify, type Field, type Resource } from "./resources";

export type Row = Record<string, unknown>;

/** Just enough of FormData for this module to be testable with a plain Map. */
export type FormLike = { get(name: string): FormDataEntryValue | null };

/** One form value → the shape Prisma stores. Throws a human sentence on bad input. */
export function parseField(field: Field, form: FormLike): unknown {
  // An unchecked checkbox submits nothing at all, which is the only way to
  // tell "off" from "not on this form".
  if (field.type === "boolean") return form.get(field.name) !== null;

  // Browsers submit textareas with CRLF line endings — the HTML spec mandates
  // it. Stored raw, the news page's `content.split(/\n{2,}/)` never matches, so
  // every paragraph break an editor typed collapses into one wall of text.
  const raw = String(form.get(field.name) ?? "")
    .replace(/\r\n/g, "\n")
    .trim();

  if (raw === "") {
    if (field.required) throw new Error(`${field.label} is required.`);
    return null;
  }

  switch (field.type) {
    case "number": {
      const n = Number(raw);
      if (!Number.isFinite(n)) throw new Error(`${field.label} must be a number.`);
      return n;
    }
    case "date": {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw new Error(`${field.label} is not a valid date.`);
      return d;
    }
    case "lines":
      return parseLines(field, raw);
    default:
      return raw;
  }
}

/** "Milestone | https://link" per line → [{ text, url }]. The link half is optional. */
function parseLines(field: Field, raw: string): Row[] | null {
  const [left, right] = field.keys ?? ["text", "url"];
  const items = raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const bar = line.indexOf("|");
      if (bar === -1) return { [left]: line };
      const url = line.slice(bar + 1).trim();
      const text = line.slice(0, bar).trim();
      return url ? { [left]: text, [right]: url } : { [left]: text };
    });
  return items.length > 0 ? items : null;
}

export function parseForm(resource: Resource, form: FormLike): Row {
  const data: Row = {};
  for (const field of resource.fields) {
    // A hidden field isn't on the form, so reading it would parse as blank and
    // overwrite the stored value with null — which for `order` would drop the
    // record to the top of the list every time somebody edited its caption.
    if (field.hidden) continue;
    data[field.name] = parseField(field, form);
  }

  // An empty slug box is the normal case — nobody should have to invent one.
  if (resource.slugFrom && !data.slug) {
    const source = data[resource.slugFrom];
    if (typeof source === "string") data.slug = slugify(source);
  }
  return data;
}

/** A stored value → the string its input should show. */
export function toInput(field: Field, value: unknown): string | boolean {
  if (field.type === "boolean") return value === true;
  if (value === null || value === undefined) return "";

  if (field.type === "date") {
    const d = value instanceof Date ? value : new Date(String(value));
    return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
  }
  if (field.type === "lines") {
    if (!Array.isArray(value)) return "";
    const [left, right] = field.keys ?? ["text", "url"];
    return value
      .map((item) => {
        const row = item as Row;
        const text = String(row[left] ?? "");
        const url = row[right] ? String(row[right]) : "";
        return url ? `${text} | ${url}` : text;
      })
      .join("\n");
  }
  return String(value);
}

export function initialValues(resource: Resource, row: Row | null): Record<string, string | boolean> {
  const values: Record<string, string | boolean> = {};
  for (const field of resource.fields) values[field.name] = toInput(field, row ? row[field.name] : null);
  return values;
}

/**
 * Flatten a column value to something both comparable with === and storable in
 * the audit log's JSON column — Dates and JSON arrays are otherwise never
 * equal to themselves, which would log a change on every save.
 */
function comparable(value: unknown): Scalar {
  if (value instanceof Date) return value.toISOString();
  if (value && typeof value === "object") return JSON.stringify(value);
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return value;
  return null;
}

type Scalar = string | number | boolean | null;
export type Changes = Record<string, { from: Scalar; to: Scalar }>;

/** { field: { from, to } } for the fields a save actually changed — the audit diff. */
export function diff(before: Row, after: Row): Changes | null {
  const changes: Changes = {};
  for (const key of Object.keys(after)) {
    const from = comparable(before[key]);
    const to = comparable(after[key]);
    if (from !== to) changes[key] = { from, to };
  }
  return Object.keys(changes).length > 0 ? changes : null;
}
