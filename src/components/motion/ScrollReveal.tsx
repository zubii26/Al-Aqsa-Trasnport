"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;       // stagger children by passing 0, 0.1, 0.2…
  direction?: "up" | "left" | "right" | "fade";
  className?: string;
}

const variants = {
  up:    { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left:  { hidden: { x: -20, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 20, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  fade:  { hidden: { opacity: 0 }, visible: { opacity: 1 } },
};

export default function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1], /* custom spring — used by Apple */
      }}
      style={{ willChange: "transform, opacity" }}
    >
      {children}
    </motion.div>
  );
}
