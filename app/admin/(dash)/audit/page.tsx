import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fieldOf, RESOURCES } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export const metadata = { title: "Audit log — FAIITA admin" };

const ACTION_STYLE: Record<string, string> = {
  create: "text-federal-green",
  update: "text-saffron-400",
  delete: "text-red-400",
  restore: "text-federal-green",
  purge: "text-red-400",
};

/** Dates and long bodies both need shortening before they go in a table cell. */
function preview(value: unknown): string {
  if (value === null || value === undefined || value === "") return "empty";
  const text = String(value);
  return text.length > 70 ? `${text.slice(0, 67)}…` : text;
}

export default async function AuditPage() {
  await requireAdmin();
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 200 });

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Audit log</h1>
      <p className="mt-1 text-sm text-white/40">
        Every change made through this dashboard, newest first. Nothing here can be edited or
        removed.
      </p>

      {logs.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-white/40">
          No changes have been made yet.
        </p>
      ) : (
        <ul className="mt-8 space-y-3">
          {logs.map((log) => {
            const resource = RESOURCES.find((r) => r.model === log.model);
            const changes = (log.changes ?? null) as Record<string, { from: unknown; to: unknown }> | null;

            return (
              <li key={log.id} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                  <span className={`font-semibold capitalize ${ACTION_STYLE[log.action] ?? "text-white"}`}>
                    {log.action}
                  </span>
                  <span className="text-white/40">{resource?.singular ?? log.model}</span>
                  <strong className="font-medium text-white">{log.recordLabel}</strong>
                </div>

                <p className="mt-1 text-xs text-white/35">
                  {log.actorEmail} ·{" "}
                  {log.createdAt.toLocaleString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </p>

                {changes && (
                  <dl className="mt-3 space-y-1.5 border-t border-white/10 pt-3 text-xs">
                    {Object.entries(changes).map(([name, change]) => (
                      <div key={name} className="sm:flex sm:gap-3">
                        <dt className="shrink-0 text-white/40 sm:w-40">
                          {(resource && fieldOf(resource, name)?.label) ?? name}
                        </dt>
                        <dd className="text-white/60">
                          <span className="text-white/30 line-through">{preview(change.from)}</span>
                          <span className="mx-2 text-white/30">→</span>
                          <span>{preview(change.to)}</span>
                        </dd>
                      </div>
                    ))}
                  </dl>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Link href="/admin" className="mt-8 inline-block text-xs text-white/40 hover:text-white">
        ← Dashboard
      </Link>
    </>
  );
}
