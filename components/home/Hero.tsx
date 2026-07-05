"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } }),
};

const HEADLINE = "Federation of All India Information Technology Associations";

export function Hero() {
  return (
    <section className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-800">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80"
          alt=""
          fill
          priority
          className="object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-900/80 via-navy-800/85 to-navy-800" />
        <div className="absolute inset-0 bg-network-grid opacity-20" />
      </div>

      {/* decorative floating nodes echoing the federation-network motif */}
      <div className="pointer-events-none absolute inset-0 hidden md:block" aria-hidden>
        {[
          { top: "18%", left: "12%", delay: "0s" },
          { top: "30%", left: "82%", delay: "1.2s" },
          { top: "68%", left: "8%", delay: "0.6s" },
          { top: "74%", left: "88%", delay: "1.8s" },
          { top: "12%", left: "60%", delay: "0.9s" },
        ].map((p, i) => (
          <span
            key={i}
            className="absolute h-2 w-2 animate-float-slow rounded-full bg-saffron-400/70"
            style={{ top: p.top, left: p.left, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="container-page relative z-10 py-32">
        <div className="max-w-3xl">
          <motion.span
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border border-saffron-400/30 bg-saffron-500/10 px-4 py-1.5 font-mono text-xs font-medium uppercase tracking-[0.18em] text-saffron-400"
          >
            Uniting India&apos;s IT Fraternity · Since 2014
          </motion.span>

          <h1 className="mt-6 flex flex-wrap text-balance font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            {HEADLINE.split(" ").map((word, i) => (
              <motion.span
                key={i}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                custom={0.12 + i * 0.035}
                className="mr-[0.28em] inline-block"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.55}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-white/70"
          >
            Uniting 50,000+ IT entrepreneurs across 29 states — one federated
            voice driving growth in Retail, Distribution, Services & Solutions.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.68}
            className="mt-10 flex flex-wrap items-center gap-4"
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
