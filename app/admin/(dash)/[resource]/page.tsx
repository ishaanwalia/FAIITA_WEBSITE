import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { allRelationOptions, delegate, purgeExpired, PURGE_AFTER_DAYS, type Row } from "@/lib/admin/db";
import { fieldOf, getResource, type Resource } from "@/lib/admin/resources";
import { deleteResource, purgeResource, restoreResource } from "./actions";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ resource: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const resource = getResource((await params).resource);
  return { title: resource ? `${resource.label} — FAIITA admin` : "FAIITA admin" };
}

function formatCell(
  resource: Resource,
  name: string,
  value: unknown,
  relations: Record<string, [string, string][]>,
): string {
  if (value === null || value === undefined || value === "") return "—";

  const field = fieldOf(resource, name);
  if (field?.type === "relation") {
    return new Map(relations[name] ?? []).get(String(value)) ?? "—";
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value instanceof Date) {
    return value.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  }

  const text = String(value);
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export default async function ResourceListPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { resource: key } = await params;
  const query = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();

  const showingDeleted = query.deleted === "1";

  // Anything past its restore window goes for good the moment somebody looks
  // at the bin. See purgeExpired().
  if (showingDeleted) await purgeExpired(resource);

  // A child list is normally reached filtered by its parent — /admin/gallery-photos?albumId=…
  const parentId = resource.parent ? query[resource.parent.foreignKey] : undefined;
  const filter = resource.parent && typeof parentId === "string" ? `${resource.parent.foreignKey}=${parentId}` : "";

  const where: Row = {};
  if (resource.softDelete) where.deletedAt = showingDeleted ? { not: null } : null;
  if (filter && resource.parent) where[resource.parent.foreignKey] = parentId;

  const [rows, relations] = await Promise.all([
    delegate(resource.model).findMany({ where, orderBy: resource.orderBy }),
    allRelationOptions(resource),
  ]);

  const parentLabel =
    resource.parent && typeof parentId === "string"
      ? new Map(relations[resource.parent.foreignKey] ?? []).get(parentId)
      : undefined;

  const newHref = `/admin/${resource.key}/new${filter ? `?${filter}` : ""}`;

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold">
            {showingDeleted ? `Deleted ${resource.label.toLowerCase()}` : resource.label}
          </h1>
          <p className="mt-1 text-sm text-white/40">
            {parentLabel ? (
              <>
                In <strong className="text-white/70">{parentLabel}</strong> ·{" "}
              </>
            ) : null}
            {rows.length}{" "}
            {rows.length === 1 ? resource.singular : (resource.plural ?? `${resource.singular}s`)}
            {showingDeleted ? ` · removed for good after ${PURGE_AFTER_DAYS} days` : ""}
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          {resource.softDelete && (
            <Link
              href={`/admin/${resource.key}${showingDeleted ? "" : "?deleted=1"}`}
              className="rounded-full border border-white/15 px-4 py-2 text-white/60 hover:text-white"
            >
              {showingDeleted ? "← Back to the list" : "Recently deleted"}
            </Link>
          )}
          {!showingDeleted && (
            <Link
              href={newHref}
              className="rounded-full bg-saffron-500 px-4 py-2 font-semibold text-navy-900 hover:bg-saffron-400"
            >
              Add {resource.singular}
            </Link>
          )}
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/40">
          {showingDeleted
            ? "Nothing has been deleted recently."
            : `No ${resource.plural ?? `${resource.singular}s`} yet. Use “Add ${resource.singular}” to create the first one.`}
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full min-w-[40rem] text-left text-sm">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-white/40">
              <tr>
                {resource.listFields.map((name) => (
                  <th key={name} scope="col" className="px-4 py-3 font-medium">
                    {fieldOf(resource, name)?.label ?? name}
                  </th>
                ))}
                <th scope="col" className="px-4 py-3 text-right font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const id = String(row.id);
                return (
                  <tr key={id} className="border-t border-white/10 align-middle">
                    {resource.listFields.map((name, i) => (
                      <td key={name} className={`px-4 py-3 ${i === 0 ? "text-white" : "text-white/50"}`}>
                        {i === 0 && !showingDeleted ? (
                          <Link
                            href={`/admin/${resource.key}/${id}${filter ? `?${filter}` : ""}`}
                            className="font-medium hover:text-saffron-400"
                          >
                            {formatCell(resource, name, row[name], relations)}
                          </Link>
                        ) : (
                          formatCell(resource, name, row[name], relations)
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3 text-xs">
                        {!showingDeleted && resource.children && (
                          <Link
                            href={`/admin/${resource.children.resource}?${resource.children.foreignKey}=${id}`}
                            className="text-white/40 hover:text-white"
                          >
                            {resource.children.label}
                          </Link>
                        )}
                        <form action={showingDeleted ? restoreResource : deleteResource}>
                          <input type="hidden" name="__resource" value={resource.key} />
                          <input type="hidden" name="__id" value={id} />
                          <button
                            type="submit"
                            className={showingDeleted ? "text-federal-green hover:underline" : "text-white/40 hover:text-red-400"}
                          >
                            {showingDeleted ? "Restore" : "Delete"}
                          </button>
                        </form>
                        {showingDeleted && (
                          <form action={purgeResource}>
                            <input type="hidden" name="__resource" value={resource.key} />
                            <input type="hidden" name="__id" value={id} />
                            <button type="submit" className="text-white/30 hover:text-red-400">
                              Delete for good
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Link href="/admin" className="mt-8 inline-block text-xs text-white/40 hover:text-white">
        ← Dashboard
      </Link>
    </>
  );
}
