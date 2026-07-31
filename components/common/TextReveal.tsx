"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045 } },
};

const word: Variants = {
  hidden: { opacity: 0.15, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export function TextReveal({
  text,
  as: Tag = "h2",
  className,
}: {
  text: string;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const words = text.split(" ");
  // motion is a Proxy over every intrinsic element — motion[Tag] resolves to
  // the motion-wrapped version of whatever tag was requested at runtime.
  // @ts-expect-error — dynamic tag typing
  const MotionTag = motion[Tag];

  return (
    <MotionTag
      className={cn("flex flex-wrap", className)}
      initial={prefersReduced ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={container}
    >
      {words.map((w, i) => (
        <motion.span key={i} variants={word} className="mr-[0.3em] inline-block">
          {w}
        </motion.span>
      ))}
    </MotionTag>
  );
}
