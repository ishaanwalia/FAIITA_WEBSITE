"use client";

import Image from "next/image";
import { Carousel } from "@ark-ui/react/carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import type { GalleryAlbum } from "@/lib/gallery-albums";

/**
 * Compact album card sized for a 3-per-row grid. Slide 1 is the album's info
 * card (what the photos are about); the remaining slides are the photos,
 * letterboxed with object-contain so mixed aspect ratios are never cropped.
 * Built on @ark-ui/react/carousel (see components/ui/carousel-1.tsx).
 */
export function AlbumCarousel({ album }: { album: GalleryAlbum }) {
  return (
    <GlassCard variant="light" className="h-full overflow-hidden !p-0">
      <Carousel.Root defaultPage={0} slideCount={album.photos.length + 1} className="flex h-full w-full max-w-full flex-col">
        <Carousel.ItemGroup className="w-full max-w-full flex-1 overflow-hidden">
          <Carousel.Item index={0} className="w-full max-w-full">
            <div className="flex h-[300px] w-full max-w-full flex-col justify-center overflow-y-auto p-6">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-saffron-600">{album.eyebrow}</span>
              <h2 className="mt-1 font-display text-base font-bold leading-snug text-navy-800">{album.title}</h2>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{album.description}</p>
            </div>
          </Carousel.Item>
          {album.photos.map((photo, i) => (
            <Carousel.Item key={photo.src} index={i + 1} className="w-full max-w-full">
              <figure className="flex h-[300px] w-full max-w-full flex-col bg-navy-900">
                <div className="relative min-h-0 w-full flex-1">
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(min-width: 1024px) 400px, 100vw"
                    className="object-contain"
                  />
                </div>
                <figcaption className="border-t border-white/10 px-4 py-2.5 text-center text-[11px] leading-snug text-white/70">
                  {photo.caption}
                </figcaption>
              </figure>
            </Carousel.Item>
          ))}
        </Carousel.ItemGroup>

        <Carousel.Control className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
          <Carousel.PrevTrigger
            aria-label="Previous"
            className="rounded-full border border-border p-1.5 text-navy-700 transition-colors hover:bg-navy-700/5 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </Carousel.PrevTrigger>

          <Carousel.IndicatorGroup className="flex items-center gap-1.5">
            {Array.from({ length: album.photos.length + 1 }).map((_, i) => (
              <Carousel.Indicator
                key={i}
                index={i}
                aria-label={i === 0 ? "About this album" : `Photo ${i}`}
                className="h-1.5 w-1.5 cursor-pointer rounded-full bg-navy-700/20 transition-all data-[current]:w-4 data-[current]:bg-saffron-500"
              />
            ))}
          </Carousel.IndicatorGroup>

          <Carousel.NextTrigger
            aria-label="Next"
            className="rounded-full border border-border p-1.5 text-navy-700 transition-colors hover:bg-navy-700/5 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </Carousel.NextTrigger>
        </Carousel.Control>
      </Carousel.Root>
    </GlassCard>
  );
}
