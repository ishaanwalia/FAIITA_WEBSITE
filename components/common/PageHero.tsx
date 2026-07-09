"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SectionHeading } from "@/components/common/SectionHeading";
import { GradientMesh } from "@/components/common/GradientMesh";

export function PageHero({
  eyebrow,
  title,
  description,
  compact = false,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** Use when a SectionDivider immediately follows (less bottom padding). */
  compact?: boolean;
  children?: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <section ref={ref} className={`relative overflow-hidden bg-navy-800 ${compact ? "pb-8 pt-24" : "py-24"}`}>
      <motion.div style={{ y }} className="absolute inset-0">
        <GradientMesh />
        <div className="absolute inset-0 bg-network-grid opacity-10" />
        <div aria-hidden className="aurora-orb right-[8%] top-[10%] h-64 w-64 bg-saffron-500/10" />
      </motion.div>
      <div className="container-page relative">
        <SectionHeading eyebrow={eyebrow} title={title} description={description} light />
        {children}
      </div>
    </section>
  );
}
