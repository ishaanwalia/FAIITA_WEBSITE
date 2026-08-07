import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { AlbumGrid } from "@/components/gallery/AlbumGrid";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photographs from FAIITA elections, national summits, annual general meetings and regional gatherings — a record of the federation's work across India since 2020.",
  alternates: { canonical: "/resources/gallery" },
};

export const revalidate = 3600;

export default async function GalleryPage() {
  // Albums and their photographs come from the database (migrated out of
  // lib/gallery-albums.ts), so the CMS can edit them. isDemo rows are excluded
  // so stale placeholder images never show.
  const [dbAlbums, items] = await Promise.all([
    prisma.galleryAlbum.findMany({
      where: { deletedAt: null },
      orderBy: { order: "asc" },
      include: { photos: { where: { deletedAt: null }, orderBy: { order: "asc" } } },
    }),
    prisma.galleryItem.findMany({
      where: { isDemo: false, deletedAt: null },
      orderBy: { order: "asc" },
    }),
  ]);

  // The loose photos become one more album rather than a second layout —
  // one component means one set of interactions to get right.
  const albums = [
    ...dbAlbums.map((a) => ({
      key: a.slug,
      eyebrow: a.eyebrow,
      title: a.title,
      description: a.description,
      photos: a.photos.map((p) => ({ src: p.src, caption: p.caption })),
    })),
    ...(items.length > 0
      ? [
          {
            key: "more",
            eyebrow: "From across the federation",
            title: "More Moments",
            description: undefined,
            photos: items.map((it) => ({ src: it.imageUrl, caption: it.title })),
          },
        ]
      : []),
  ];

  return (
    <>
      <PageHero
        eyebrow="Resources / Gallery"
        title="Moments From Across the Federation"
        description="A look back at elections, summits, regional meets, and leadership gatherings. Tap any photograph to read it full-screen."
      />

      <section className="bg-background py-20">
        <div className="container-page space-y-12">
          {albums.map((album, i) => (
            <ScrollReveal key={album.key} direction="up" delay={Math.min(i, 3) * 0.06}>
              <AlbumGrid
                eyebrow={album.eyebrow}
                title={album.title}
                description={album.description}
                photos={album.photos}
              />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
