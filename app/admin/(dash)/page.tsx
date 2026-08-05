import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { delegate } from "@/lib/admin/db";
import { NAV_RESOURCES } from "@/lib/admin/resources";

export const dynamic = "force-dynamic";

export default async function AdminHome() {
  const admin = await requireAdmin();

  const [counts, recentChanges] = await Promise.all([
    Promise.all(
      NAV_RESOURCES.map((resource) =>
        delegate(resource.model).count({
          where: resource.softDelete ? { deletedAt: null } : undefined,
        }),
      ),
    ),
    prisma.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Welcome, {admin.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-white/50">
        Signed in as {admin.email}. Everything below is live content — a change you save here is on
        the public site within about a second.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {NAV_RESOURCES.map((resource, i) => (
          <Link
            key={resource.key}
            href={`/admin/${resource.key}`}
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-saffron-500/40 hover:bg-white/10"
          >
            <p className="stat-figure text-2xl font-bold">{counts[i]}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{resource.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="font-display text-sm font-bold">Recent changes</h2>
          <Link href="/admin/audit" className="text-xs text-white/40 hover:text-white">
            Full audit log →
          </Link>
        </div>

        {recentChanges.length === 0 ? (
          <p className="mt-3 text-sm text-white/40">Nothing has been changed yet.</p>
        ) : (
          <ul className="mt-3 space-y-1.5 text-sm text-white/50">
            {recentChanges.map((log) => (
              <li key={log.id}>
                <span className="capitalize text-white/70">{log.action}</span> {log.recordLabel}{" "}
                <span className="text-white/25">
                  · {log.actorEmail.split("@")[0]} ·{" "}
                  {log.createdAt.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Link href="/" className="mt-8 inline-block text-xs text-white/40 hover:text-white">
        ← Back to the site
      </Link>
    </>
  );
}
