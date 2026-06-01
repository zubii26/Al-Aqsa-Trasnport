"use client";
import { useScroll, useTransform, motion } from "framer-motion";
import { useRef } from "react";

export default function ParallaxHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  /* Background moves at 40% of scroll speed — creates depth */
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  /* Heading fades and lifts as user scrolls past */
  const textY = useTransform(scrollYProgress, [0, 0.5], ["0%", "-20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div
        style={{ 
          y: bgY, 
          backgroundImage: "url('/images/hero-makkah.jpg')"
        }}
        className="absolute inset-0 bg-cover bg-center scale-110"
      />
      <div className="absolute inset-0 bg-black/50" />
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4"
      >
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Premium Umrah Transport
        </h1>
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl">
          Trusted by pilgrims worldwide. Nusuk registered.
        </p>
      </motion.div>
    </section>
  );
}
