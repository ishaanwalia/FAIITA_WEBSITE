import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  // Nothing else in here is reachable until they've replaced the password we
  // generated for them.
  if (admin.mustChangePassword) redirect("/admin/password");

  const [news, events, gallery, newsletters, states, members, leaders] = await Promise.all([
    prisma.news.count(),
    prisma.event.count(),
    prisma.galleryItem.count(),
    prisma.newsletter.count(),
    prisma.stateAssociation.count(),
    prisma.memberAssociation.count(),
    prisma.leader.count(),
  ]);

  const rows = [
    { label: "News", count: news },
    { label: "Events", count: events },
    { label: "Gallery items", count: gallery },
    { label: "Newsletter issues", count: newsletters },
    { label: "State associations", count: states },
    { label: "Member associations", count: members },
    { label: "Leaders", count: leaders },
  ];

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Welcome, {admin.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-white/50">
        Signed in as {admin.email}. Editing screens are being built — what&apos;s below is what the
        site is currently serving.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="stat-figure text-2xl font-bold">{row.count}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{row.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-sm font-bold">Still to come</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-white/50">
          <li>Create, edit and delete for each of the sections above</li>
          <li>Audit log — who changed what, and when</li>
          <li>Recently deleted, with restore</li>
          <li>Image upload with automatic WebP/AVIF conversion</li>
          <li>Publishing an edit refreshes the live page without a redeploy</li>
        </ul>
        <p className="mt-4 text-xs text-white/30">
          Content today lives in the database and in <code>lib/*.ts</code>; those files get migrated in
          as each screen lands. See <code>docs/BUILD-PLAN.md</code>.
        </p>
      </div>

      <Link href="/" className="mt-8 inline-block text-xs text-white/40 hover:text-white">
        ← Back to the site
      </Link>
    </>
  );
}
