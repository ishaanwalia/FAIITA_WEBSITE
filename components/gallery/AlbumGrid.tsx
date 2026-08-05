"use client";

import Image from "next/image";
import { useState } from "react";
import { Lightbox, type LightboxPhoto } from "@/components/gallery/Lightbox";

/**
 * One album: a short written intro, then its photographs at contact-sheet
 * density. Tapping any frame opens the reader.
 *
 * This replaced a per-album carousel that showed one photo at a time in a
 * card. Density is the point — a 6-photo album read as "six clicks" before,
 * and reads as one glance now.
 */
export function AlbumGrid({
  eyebrow,
  title,
  description,
  photos,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  photos: LightboxPhoto[];
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  return (
    <section className="border-t border-border pt-10 first:border-0 first:pt-0">
      <span className="section-eyebrow text-saffron-700">{eyebrow}</span>
      <h2 className="mt-2 max-w-3xl text-balance font-display text-2xl font-bold tracking-tight text-navy-800">
        {title}
      </h2>
      {description && (
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted-foreground">{description}</p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-1.5 sm:grid-cols-4 lg:grid-cols-6">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            onClick={() => setOpenAt(i)}
            aria-label={`Open photo ${i + 1} of ${photos.length}: ${photo.caption}`}
            className="group relative aspect-square overflow-hidden rounded-md bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 focus-visible:ring-offset-2"
          >
            <Image
              src={photo.src}
              alt={photo.caption}
              fill
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {/* Keyed on the opening index so the reader always mounts fresh at the
          photo that was tapped, with no open/closed state of its own. */}
      {openAt !== null && (
        <Lightbox key={openAt} photos={photos} startIndex={openAt} onClose={() => setOpenAt(null)} />
      )}
    </section>
  );
}
