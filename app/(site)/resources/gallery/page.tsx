import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/common/PageHero";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { AlbumCarousel } from "@/components/gallery/AlbumCarousel";
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

  return (
    <>
      <PageHero
        eyebrow="Resources / Gallery"
        title="Moments From Across the Federation"
        description="A look back at elections, summits, regional meets, and leadership gatherings."
      />

      <section className="bg-background py-20">
        <div className="container-page grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryAlbums.map((album, i) => (
            <ScrollReveal key={album.slug} direction="up" delay={(i % 3) * 0.08} className="h-full">
              <AlbumCarousel album={album} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {items.length > 0 && (
        <section className="bg-background pb-20">
          <div className="container-page columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
            {items.map((item, i) => (
              <ScrollReveal key={item.id} direction="scale" delay={(i % 3) * 0.06} className="break-inside-avoid">
                <TiltCard maxTilt={8}>
                  <figure className="group relative overflow-hidden rounded-2xl">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      width={600}
                      height={450}
                      className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/90 to-transparent p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-saffron-400">{item.category}</span>
                      <p className="text-sm font-medium text-white">{item.title}</p>
                    </figcaption>
                  </figure>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
