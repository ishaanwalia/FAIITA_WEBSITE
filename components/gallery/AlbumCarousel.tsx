"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { cn } from "@/lib/utils";
import type { GalleryAlbum } from "@/lib/gallery-albums";

/** One scrollable card per album — swipe/scroll or use the arrows to move
 *  through the event's photos. Mixed aspect ratios are letterboxed on navy. */
export function AlbumCarousel({ album }: { album: GalleryAlbum }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const clamped = Math.max(0, Math.min(index, album.photos.length - 1));
    track.scrollTo({ left: clamped * track.clientWidth, behavior: "smooth" });
  }, [album.photos.length]);

  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setActive(Math.round(track.scrollLeft / track.clientWidth));
  }, []);

  return (
    <GlassCard variant="light" className="overflow-hidden !p-0">
      <div className="p-6 sm:p-8">
        <span className="text-xs font-semibold uppercase tracking-wide text-saffron-600">{album.eyebrow}</span>
        <h2 className="mt-1 font-display text-xl font-bold text-navy-800 sm:text-2xl">{album.title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{album.description}</p>
      </div>

      <div className="group relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth bg-navy-900 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {album.photos.map((photo, i) => (
            <figure key={photo.src} className="w-full shrink-0 snap-center">
              <div className="relative h-[320px] w-full sm:h-[440px]">
                <Image
                  src={photo.src}
                  alt={photo.caption}
                  fill
                  sizes="(min-width: 1024px) 960px, 100vw"
                  className="object-contain"
                  priority={i === 0}
                />
              </div>
              <figcaption className="border-t border-white/10 px-6 py-4 text-center text-xs text-white/70 sm:text-sm">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          aria-label="Previous photo"
          onClick={() => scrollTo(active - 1)}
          disabled={active === 0}
          className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy-800 shadow-md transition-opacity hover:bg-white disabled:opacity-30"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          aria-label="Next photo"
          onClick={() => scrollTo(active + 1)}
          disabled={active === album.photos.length - 1}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 text-navy-800 shadow-md transition-opacity hover:bg-white disabled:opacity-30"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute right-4 top-4 rounded-full bg-navy-900/70 px-3 py-1 font-mono text-xs text-white/90">
          {active + 1} / {album.photos.length}
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 bg-navy-900 pb-5">
        {album.photos.map((photo, i) => (
          <button
            key={photo.src}
            type="button"
            aria-label={`Go to photo ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === active ? "w-6 bg-saffron-400" : "w-2 bg-white/30 hover:bg-white/50"
            )}
          />
        ))}
      </div>
    </GlassCard>
  );
}
