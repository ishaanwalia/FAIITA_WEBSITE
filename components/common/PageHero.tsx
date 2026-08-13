"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GradientMesh, MESH_VARIANTS, type MeshVariant } from "@/components/common/GradientMesh";

// Sharper accent orb paired with each mesh spread, placed where that
// variant leaves negative space so the glow never stacks in one corner.
const ACCENT_ORB: Record<MeshVariant, string> = {
  aurora: "right-[8%] top-[10%] h-64 w-64 bg-saffron-500/10",
  dawn: "right-[30%] top-[15%] h-48 w-48 bg-saffron-400/10",
  tide: "left-[12%] bottom-[10%] h-56 w-56 bg-navy-400/[0.12]",
  ember: "left-[6%] bottom-[18%] h-52 w-52 bg-federal-green/10",
  meadow: "left-[35%] top-[12%] h-48 w-48 bg-saffron-400/10",
  zenith: "right-[18%] top-[35%] h-56 w-56 bg-navy-400/[0.12]",
};

// Deterministic pick: the page title seeds which gradient spread it gets,
// so every page hero has its own look without per-page wiring.
function meshFor(seed: string): MeshVariant {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 9973;
  return MESH_VARIANTS[h % MESH_VARIANTS.length];
}

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const variant = meshFor(`${eyebrow}${title}`);

  return (
    <section ref={ref} className="relative overflow-hidden bg-navy-800 py-24">
      <motion.div style={{ y }} className="absolute inset-0">
        <div aria-hidden className="animated-gradient absolute inset-0" />
        {/* GradientMesh's three orbs and the aurora orb below are each a
            continuously CSS-animated 60-100px blur — cheap one at a time, but
            stacked and running for as long as the visitor is on the page,
            they're a real compositor cost that mobile GPUs measurably drop
            frames on, which is what made the fixed header above visibly lag
            behind fast scrolling on every page carrying a PageHero (i.e.
            every page except home, which uses its own lighter Hero). Hidden
            below md rather than throttled — this content is decorative
            (aria-hidden) so there's nothing to preserve. */}
        <div className="hidden md:block">
          <GradientMesh variant={variant} />
        </div>
        <div className="absolute inset-0 bg-network-grid opacity-10" />
        <div aria-hidden className={`hidden md:block aurora-orb ${ACCENT_ORB[variant]}`} />
        <div aria-hidden className="grain absolute inset-0" />
      </motion.div>
      <div className="container-page relative">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} light as="h1" />
        {children}
      </div>
    </section>
  );
}
