import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { mergeNews } from "@/lib/code-news";
import { galleryAlbums } from "@/lib/gallery-albums";
import { memberAssociations } from "@/lib/member-associations";
import { extraCurrentLeaders } from "@/lib/leader-profiles";
import { withExtraStates } from "@/lib/extra-states";
import { excludeRemovedStates } from "@/lib/state-overrides";

export default async function AdminHome() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  // Nothing else in here is reachable until they've replaced the password we
  // generated for them.
  if (admin.mustChangePassword) redirect("/admin/password");

  const [news, events, gallery, newsletters, states, members, leaders] = await Promise.all([
    prisma.news.findMany({ select: { slug: true, publishedAt: true } }),
    prisma.event.count(),
    prisma.galleryItem.count({ where: { isDemo: false } }),
    prisma.newsletter.count(),
    prisma.stateAssociation.findMany({ select: { slug: true } }),
    prisma.memberAssociation.count(),
    prisma.leader.count({ where: { category: "national", isCurrent: true } }),
  ]);

  // Two numbers per row on purpose. `live` is what the site actually renders,
  // which for several of these is the database plus the lib/*.ts override
  // layer; `db` is what is in the database and therefore what a CMS screen
  // could edit. Where they differ, the content is still in code and is not yet
  // editable here. Migrating those (plan 5.1/5.2) is what makes every pair
  // below match — at which point this column stops being interesting and can
  // go.
  const rows = [
    { label: "News", live: mergeNews(news).length, db: news.length },
    { label: "Events", live: events, db: events },
    {
      label: "Gallery photos",
      live: galleryAlbums.reduce((n, a) => n + a.photos.length, 0) + gallery,
      db: gallery,
    },
    { label: "Newsletter issues", live: newsletters, db: newsletters },
    {
      label: "State associations",
      live: excludeRemovedStates(withExtraStates(states)).length,
      db: states.length,
    },
    { label: "Member associations", live: memberAssociations.length, db: members },
    { label: "Leaders (current GB)", live: leaders + extraCurrentLeaders.length, db: leaders },
  ];

  const drifted = rows.filter((r) => r.live !== r.db);

  return (
    <>
      <h1 className="font-display text-2xl font-bold">Welcome, {admin.name.split(" ")[0]}</h1>
      <p className="mt-2 text-sm text-white/50">
        Signed in as {admin.email}. The big number is what the site is serving; the line under it is
        how much of that is in the database.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="stat-figure text-2xl font-bold">{row.live}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-white/40">{row.label}</p>
            <p
              className={`mt-2 text-xs ${row.live === row.db ? "text-white/25" : "text-saffron-400"}`}
            >
              {row.live === row.db
                ? "all in the database"
                : `${row.db} in the database · ${row.live - row.db} still in code`}
            </p>
          </div>
        ))}
      </div>

      {drifted.length > 0 && (
        <p className="mt-4 rounded-2xl border border-saffron-500/25 bg-saffron-500/5 px-5 py-4 text-xs leading-relaxed text-saffron-200/80">
          <strong className="font-semibold">{drifted.length} sections are split across two
          sources.</strong>{" "}
          Those rows live in <code>lib/*.ts</code> rather than the database, because reseeds were
          blocked while the site was live. Anything still in code can only be changed by a code
          change and a deploy — it can&apos;t be edited here, and it can&apos;t update in real time.
          Migrating it in is plan item 5.1/5.2, after which every line above reads &ldquo;all in the
          database&rdquo;.
        </p>
      )}

      <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="font-display text-sm font-bold">Still to come</h2>
        <ul className="mt-3 space-y-1.5 text-sm text-white/50">
          <li>Create, edit and delete for each of the sections above</li>
          <li>Audit log — who changed what, and when</li>
          <li>Recently deleted, with restore</li>
          <li>Image upload with automatic WebP/AVIF conversion</li>
          <li>Saving an edit refreshes the live page in about a second, with no redeploy</li>
        </ul>
        <p className="mt-4 text-xs text-white/30">
          See <code>docs/BUILD-PLAN.md</code> for the order these land in.
        </p>
      </div>

      <Link href="/" className="mt-8 inline-block text-xs text-white/40 hover:text-white">
        ← Back to the site
      </Link>
    </>
  );
}
