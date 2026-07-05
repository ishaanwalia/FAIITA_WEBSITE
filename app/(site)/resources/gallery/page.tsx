import type { Metadata } from "next";
import Image from "next/image";
import { SectionHeading } from "@/components/common/SectionHeading";
import { SectionDivider } from "@/components/common/SectionDivider";
import { ScrollReveal } from "@/components/common/ScrollReveal";
import { TiltCard } from "@/components/common/TiltCard";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Moments from FAIITA summits, AGMs, and regional meets.",
};

export const revalidate = 3600;

export default async function GalleryPage() {
  const items = await prisma.galleryItem.findMany({ orderBy: { order: "asc" } });

  return (
    <>
      <section className="bg-navy-800 pb-8 pt-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Resources / Gallery"
            title="Moments From Across the Federation"
            description="A look back at summits, regional meets, and leadership gatherings."
            light
          />
        </div>
      </section>
      <SectionDivider type="wave" className="bg-navy-800" />

      <section className="bg-background pb-20 pt-4">
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
    </>
  );
}
