"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { HeroFrames, type HeroFrame } from "@/components/home/HeroFrames";

// Real FAIITA event photography. The federation's own rooms are better
// evidence than any stock image or abstract particle field — these rotate
// every 3s behind the copy.
const FRAMES: HeroFrame[] = [
  { src: "/hero-frames/faiita-agm-2020-ahmedabad-02.jpg", alt: "FAIITA AGM 2020, Ahmedabad" },
  { src: "/hero-frames/faiita-election-2022-chandigarh-01.jpeg", alt: "FAIITA Election 2022, Chandigarh" },
  { src: "/hero-frames/faiita-agm-2020-ahmedabad-05.jpg", alt: "FAIITA AGM 2020, Ahmedabad" },
  { src: "/hero-frames/faiita-computex-taipei-2023-01.jpg", alt: "FAIITA delegation at Computex Taipei 2023" },
  { src: "/hero-frames/faiita-agm-2020-ahmedabad-03.jpg", alt: "FAIITA AGM 2020, Ahmedabad" },
  { src: "/hero-frames/faiita-election-2022-chandigarh-02.jpeg", alt: "FAIITA Election 2022, Chandigarh" },
  { src: "/hero-frames/faiita-agm-2020-ahmedabad-06.jpg", alt: "FAIITA AGM 2020, Ahmedabad" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const } }),
};

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });

  // Background drifts slower than the foreground content as you scroll —
  // a classic depth-of-field parallax cue, done with GPU-only transforms.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "60%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex min-h-[92vh] items-center overflow-hidden bg-navy-900">
      {/* One background layer, not six. The animated mesh, particle canvas,
          aurora orbs and grain that used to stack here are gone — the
          photography is the background now. */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <HeroFrames frames={FRAMES} />
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-page relative z-10 py-32">
        <div className="max-w-3xl">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.15}
            className="mb-4 font-mono text-sm font-medium uppercase tracking-[0.2em] text-saffron-400 sm:text-base"
          >
            Uniting India&apos;s IT Fraternity Since 2014
          </motion.p>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.3}
            className="mb-6 text-balance font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
          >
            Federation of All India{" "}
            <span className="gradient-text-kinetic">Information Technology</span> Associations
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.45}
            className="mb-10 max-w-2xl text-balance text-lg leading-relaxed text-white/70"
          >
            Uniting 50,000+ IT entrepreneurs across 26 states — one federated
            voice driving growth in Retail, Distribution, Services &amp; Solutions.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0.6}
            className="flex flex-wrap items-center gap-4"
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
      </motion.div>

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
