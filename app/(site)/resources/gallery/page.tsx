import type { Metadata } from "next";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { AlbumGrid } from "@/components/gallery/AlbumGrid";
import { galleryAlbums } from "@/lib/gallery-albums";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Moments from FAIITA elections, summits, AGMs, and regional meets.",
  alternates: { canonical: "/resources/gallery" },
};

export const revalidate = 3600;

export default async function GalleryPage() {
  // Real albums render from code; the DB only holds future one-off photos.
  // isDemo rows are excluded so stale placeholder images never show.
  const items = await prisma.galleryItem.findMany({
    where: { isDemo: false },
    orderBy: { order: "asc" },
  });

  // The loose DB photos become one more album rather than a second layout —
  // one component means one set of interactions to get right.
  const albums = [
    ...galleryAlbums.map((a) => ({
      key: a.slug,
      eyebrow: a.eyebrow,
      title: a.title,
      description: a.description,
      photos: a.photos,
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
