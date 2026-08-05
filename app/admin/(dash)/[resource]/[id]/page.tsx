import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { allRelationOptions, delegate } from "@/lib/admin/db";
import { initialValues } from "@/lib/admin/form";
import { getResource } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props) {
  const { resource: key, id } = await params;
  const resource = getResource(key);
  if (!resource) return { title: "FAIITA admin" };
  return { title: `${id === "new" ? "New" : "Edit"} ${resource.singular} — FAIITA admin` };
}

export default async function ResourceFormPage({ params, searchParams }: Props) {
  await requireAdmin();
  const { resource: key, id } = await params;
  const query = await searchParams;
  const resource = getResource(key);
  if (!resource) notFound();

  const creating = id === "new";
  const [row, relations] = await Promise.all([
    creating ? Promise.resolve(null) : delegate(resource.model).findUnique({ where: { id } }),
    allRelationOptions(resource),
  ]);
  if (!creating && !row) notFound();

  const values = initialValues(resource, row);

  // A child form opened from its parent's list keeps the parent selected and
  // returns there on save.
  const parentId = resource.parent ? query[resource.parent.foreignKey] : undefined;
  if (creating && resource.parent && typeof parentId === "string") {
    values[resource.parent.foreignKey] = parentId;
  }
  const filter =
    resource.parent && typeof parentId === "string" ? `${resource.parent.foreignKey}=${parentId}` : "";

  return (
    <>
      <Link
        href={`/admin/${resource.key}${filter ? `?${filter}` : ""}`}
        className="text-xs text-white/40 hover:text-white"
      >
        ← {resource.label}
      </Link>

      <h1 className="mt-3 font-display text-2xl font-bold">
        {creating ? `New ${resource.singular}` : String(row?.[resource.labelField] ?? `Edit ${resource.singular}`)}
      </h1>

      <ResourceForm
        resource={resource}
        id={creating ? "" : id}
        values={values}
        relations={relations}
        filter={filter}
      />
    </>
  );
}
