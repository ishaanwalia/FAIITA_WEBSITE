"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { ParticleBackground } from "@/components/home/ParticleBackground";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-800">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/90 via-navy-800/80 to-navy-800/95" />
      </div>

      <ParticleBackground />

      <div className="container-page relative z-10 py-32 text-center">
        <div className="mx-auto max-w-4xl">
          <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0} className="mx-auto mb-8 flex justify-center">
            <div className="relative h-20 w-64 sm:h-28 sm:w-80">
              {/* Assumes /public/logo.png — rename this src if your file uses a different name/extension. */}
              <Image src="/logo.png" alt="FAIITA Logo" fill priority className="object-contain" />
            </div>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.15}
            className="mb-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-saffron-400 sm:text-base"
          >
            Uniting India&apos;s IT Fraternity Since 1990
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="mb-6 text-balance font-display text-4xl font-bold leading-[1.1] text-white sm:text-5xl lg:text-6xl"
          >
            Federation of All India <span className="gradient-text">Information Technology</span> Associations
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.45}
            className="mx-auto mb-10 max-w-2xl text-balance text-lg leading-relaxed text-white/70"
          >
            Uniting 50,000+ IT entrepreneurs across 29 states — one federated
            voice driving growth in Retail, Distribution, Services & Solutions.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.6}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <MagneticButton asChild variant="accent" size="lg">
              <Link href="/about">
                Explore FAIITA <ArrowRight className="h-4 w-4" />
              </Link>
            </MagneticButton>
            <MagneticButton asChild variant="outline" size="lg">
              <Link href="/about/state-associations">Our State Associations</Link>
            </MagneticButton>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <ChevronDown className="h-6 w-6 animate-bounce text-white/40" />
      </motion.div>
    </section>
  );
}
