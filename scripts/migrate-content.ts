/**
 * Migrates the lib/*.ts content layer into the database. Plan item 5.2.
 *
 *   npm run content:plan     read-only, prints exactly what it would change
 *   npm run content:migrate  applies it
 *
 * Two design decisions worth understanding before changing this:
 *
 * 1. It writes what the *merge functions* produce, not what the lib files
 *    contain. For every existing row it computes `applyStateOverrides(row)` /
 *    `withLeaderProfile(row)` — the very functions the pages call today — and
 *    persists the difference. So "the site renders identically afterwards"
 *    isn't a hope, it's arithmetic: the database ends up holding the value the
 *    page was already rendering.
 *
 * 2. Every write is an upsert keyed on a stable slug (or name, for
 *    testimonials), and deletions are soft. Nothing is truncated and nothing is
 *    reseeded. That matters because the whole reason this content ended up in
 *    code is that destructive reseeds against the live database were unsafe —
 *    ISR would cache an empty page mid-reseed. An idempotent upsert has no such
 *    window, and can be run repeatedly without harm.
 */

import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { codeNews } from "../lib/code-news";
import { codeTestimonials } from "../lib/code-testimonials";
import { extraStates } from "../lib/extra-states";
import { galleryAlbums } from "../lib/gallery-albums";
import { memberAssociations } from "../lib/member-associations";
import { extraCurrentLeaders, withLeaderProfile } from "../lib/leader-profiles";
import { applyStateOverrides, isRemovedStateSlug } from "../lib/state-overrides";

const APPLY = process.argv.includes("--apply");

type Change = { kind: "create" | "update" | "soft-delete"; label: string; detail?: string };
const planned: Record<string, Change[]> = {};

function note(domain: string, change: Change) {
  (planned[domain] ??= []).push(change);
}

/**
 * Prisma refuses a literal `null` for a nullable Json column — clearing one
 * needs the DbNull sentinel instead, or the update is a type error and, worse,
 * a silent no-op if it's cast away.
 */
function jsonSafe<T extends Record<string, unknown>>(data: T) {
  const out: Record<string, unknown> = { ...data };
  for (const key of ["journey", "companies"]) {
    if (key in out && out[key] === null) out[key] = Prisma.DbNull;
  }
  return out as never;
}

/** Fields that differ between what's stored and what the site renders. */
function diff<T extends Record<string, unknown>>(current: T, desired: Partial<T>) {
  const out: Partial<T> = {};
  for (const [key, value] of Object.entries(desired) as [keyof T, T[keyof T]][]) {
    if (value === undefined) continue;
    const before = current[key];
    const same =
      before instanceof Date && value instanceof Date
        ? before.getTime() === value.getTime()
        : JSON.stringify(before) === JSON.stringify(value);
    if (!same) out[key] = value;
  }
  return out;
}

// --------------------------------------------------------------- states

async function migrateStates() {
  const rows = await prisma.stateAssociation.findMany();

  for (const row of rows) {
    // Rows the site filters out. Soft-deleted rather than removed: the CMS's
    // recently-deleted screen is where they should be reviewable, and their
    // member associations cascade off them.
    if (isRemovedStateSlug(row.slug)) {
      if (!row.deletedAt) {
        note("States", { kind: "soft-delete", label: row.stateName, detail: "filtered out on the site" });
        if (APPLY) {
          await prisma.stateAssociation.update({ where: { id: row.id }, data: { deletedAt: new Date() } });
        }
      }
      continue;
    }

    const patch = diff(row, applyStateOverrides(row));
    if (Object.keys(patch).length > 0) {
      note("States", { kind: "update", label: row.stateName, detail: Object.keys(patch).join(", ") });
      if (APPLY) await prisma.stateAssociation.update({ where: { id: row.id }, data: patch });
    }
  }

  const present = new Set(rows.map((r) => r.slug));
  for (const extra of extraStates) {
    if (present.has(extra.slug)) continue;
    note("States", { kind: "create", label: extra.stateName });
    if (APPLY) {
      const { id: _id, ...data } = extra;
      await prisma.stateAssociation.upsert({ where: { slug: extra.slug }, update: data, create: data });
    }
  }
}

// -------------------------------------------------------------- leaders

async function migrateLeaders() {
  // Scoped to exactly what app/(site)/about/leadership/page.tsx renders.
  // withLeaderProfile keys on name alone, and several people appear twice in
  // this table — once on the current GB and once on a past one. Applying the
  // overlay to every row would stamp today's role, bio and contact details
  // onto the historical record of a term they served years ago.
  const rows = await prisma.leader.findMany({ where: { category: "national", isCurrent: true } });

  for (const row of rows) {
    // The same two corrections the leadership page makes inline. Persisting
    // them here is what lets the page stop making them.
    const corrected = {
      ...row,
      role:
        row.name === "Devesh Rastogi"
          ? "Chairman"
          : row.role === "Advisor, IPP"
            ? "Advisor, PP"
            : row.role,
    };
    const merged = withLeaderProfile(corrected);
    const patch = diff(row, {
      ...merged,
      journey: (merged.journey ?? null) as never,
      companies: (merged.companies ?? null) as never,
      location: merged.location ?? null,
      website: merged.website ?? null,
    });
    delete (patch as Record<string, unknown>).id;

    if (Object.keys(patch).length > 0) {
      note("Leaders", { kind: "update", label: row.name, detail: Object.keys(patch).join(", ") });
      if (APPLY) await prisma.leader.update({ where: { id: row.id }, data: jsonSafe(patch) });
    }
  }

  const present = new Set(rows.map((r) => `${r.name}|${r.term}`));
  for (const extra of extraCurrentLeaders) {
    if (present.has(`${extra.name}|${extra.term}`)) continue;
    note("Leaders", { kind: "create", label: `${extra.name} — ${extra.role}` });
    if (APPLY) {
      const { id: _id, journey, companies, location, website, ...rest } = extra;
      await prisma.leader.create({
        data: {
          ...rest,
          category: "national",
          isCurrent: true,
          journey: (journey ?? Prisma.DbNull) as never,
          companies: (companies ?? Prisma.DbNull) as never,
          location: location ?? null,
          website: website ?? null,
        },
      });
    }
  }
}

// ----------------------------------------------------------------- news

async function migrateNews() {
  for (const item of codeNews) {
    const { id: _id, relatedState, ...rest } = item;
    const data = {
      ...rest,
      relatedStateSlug: relatedState?.slug ?? null,
      relatedStateLabel: relatedState?.label ?? null,
    };
    const existing = await prisma.news.findUnique({ where: { slug: item.slug } });
    const patch = existing ? diff(existing, data) : null;

    if (!existing) {
      note("News", { kind: "create", label: item.title });
    } else if (patch && Object.keys(patch).length > 0) {
      note("News", { kind: "update", label: item.title, detail: Object.keys(patch).join(", ") });
    } else {
      continue;
    }
    if (APPLY) await prisma.news.upsert({ where: { slug: item.slug }, update: data, create: data });
  }
}

// --------------------------------------------------------- testimonials

async function migrateTestimonials() {
  const rows = await prisma.testimonial.findMany();
  const byName = new Map(rows.map((r) => [r.name, r]));
  // mergeTestimonials appended code entries after the database rows, so they
  // showed last. Created rows default to order 0, which would silently
  // reshuffle the carousel — give them orders that continue the existing run
  // instead, and the sequence a visitor sees doesn't move.
  let nextOrder = rows.reduce((max, r) => Math.max(max, r.order), -1) + 1;

  for (const item of codeTestimonials) {
    const { id: _id, order: _o, ...fields } = item as typeof item & { id?: string; order?: number };
    const existing = byName.get(item.name);
    const data = existing ? fields : { ...fields, order: nextOrder++ };
    const patch = existing ? diff(existing, data) : null;

    if (!existing) {
      note("Testimonials", { kind: "create", label: item.name });
      if (APPLY) await prisma.testimonial.create({ data });
    } else if (patch && Object.keys(patch).length > 0) {
      note("Testimonials", { kind: "update", label: item.name, detail: Object.keys(patch).join(", ") });
      if (APPLY) await prisma.testimonial.update({ where: { id: existing.id }, data: patch });
    }
  }
}

// -------------------------------------------------- member associations

async function migrateMembers() {
  const states = await prisma.stateAssociation.findMany({ select: { id: true, slug: true } });
  const stateId = new Map(states.map((s) => [s.slug, s.id]));

  for (const item of memberAssociations) {
    // Demo placeholders exist only so the page isn't empty; they carry a Demo
    // badge and were never seeded. Migrating them would make a placeholder
    // editable content, which is the opposite of what should happen to it.
    if (item.isDemo) {
      note("Member associations", { kind: "update", label: item.name, detail: "skipped — demo placeholder" });
      continue;
    }

    const parent = stateId.get(item.stateSlug);
    if (!parent) {
      // Loud rather than silent: a member association with no state row would
      // simply vanish from the site, which is the failure mode this whole
      // migration exists to avoid.
      note("Member associations", {
        kind: "update",
        label: item.name,
        detail: `SKIPPED — no state row for "${item.stateSlug}"`,
      });
      continue;
    }

    const { stateSlug: _s, stateName: _n, ...rest } = item;
    const data = { ...rest, stateId: parent };
    const existing = await prisma.memberAssociation.findUnique({ where: { slug: item.slug } });
    const patch = existing ? diff(existing, data) : null;

    if (!existing) {
      note("Member associations", { kind: "create", label: item.name });
    } else if (patch && Object.keys(patch).length > 0) {
      note("Member associations", { kind: "update", label: item.name, detail: Object.keys(patch).join(", ") });
    } else {
      continue;
    }
    if (APPLY) {
      await prisma.memberAssociation.upsert({ where: { slug: item.slug }, update: data, create: data });
    }
  }
}

// -------------------------------------------------------------- gallery

async function migrateGallery() {
  for (const [index, album] of galleryAlbums.entries()) {
    const { photos, ...rest } = album;
    const data = { ...rest, order: index };
    const existing = await prisma.galleryAlbum.findUnique({
      where: { slug: album.slug },
      include: { photos: true },
    });

    if (!existing) {
      note("Gallery", { kind: "create", label: `${album.title} (${photos.length} photos)` });
    } else {
      const patch = diff(existing, data);
      const newPhotos = photos.filter((p) => !existing.photos.some((e) => e.src === p.src));
      if (Object.keys(patch).length === 0 && newPhotos.length === 0) continue;
      note("Gallery", {
        kind: "update",
        label: album.title,
        detail: [Object.keys(patch).join(", "), newPhotos.length ? `${newPhotos.length} new photos` : ""]
          .filter(Boolean)
          .join(" · "),
      });
    }

    if (APPLY) {
      const saved = await prisma.galleryAlbum.upsert({
        where: { slug: album.slug },
        update: data,
        create: data,
      });
      // Photos are upserted individually on (albumId, src) so re-running never
      // duplicates them and never drops a caption edited in the CMS.
      for (const [order, photo] of photos.entries()) {
        await prisma.galleryPhoto.upsert({
          where: { albumId_src: { albumId: saved.id, src: photo.src } },
          update: { caption: photo.caption, order },
          create: { albumId: saved.id, src: photo.src, caption: photo.caption, order },
        });
      }
    }
  }
}

// ----------------------------------------------------------------- main

async function main() {
  await migrateStates();
  await migrateLeaders();
  await migrateNews();
  await migrateTestimonials();
  await migrateMembers();
  await migrateGallery();

  const domains = Object.keys(planned);
  if (domains.length === 0) {
    console.log("\n  Nothing to do — the database already matches what the site renders.\n");
    return;
  }

  console.log(APPLY ? "\n  APPLIED:\n" : "\n  DRY RUN — nothing was written. Re-run with --apply.\n");
  let total = 0;
  for (const domain of domains) {
    console.log(`  ${domain}`);
    for (const c of planned[domain]) {
      total += 1;
      console.log(`    ${c.kind.padEnd(12)} ${c.label}${c.detail ? `  (${c.detail})` : ""}`);
    }
    console.log("");
  }
  console.log(`  ${total} change${total === 1 ? "" : "s"}${APPLY ? " written" : " pending"}.\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
