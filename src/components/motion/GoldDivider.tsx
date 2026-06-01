"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function GoldDivider() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <div ref={ref} className="flex justify-center items-center py-12">
      <div className="flex items-center gap-4 w-full max-w-md">
        <motion.div
          className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#D4AF37]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ originX: 1 }}
        />
        <motion.div
          className="w-2 h-2 rotate-45 bg-[#D4AF37]"
          initial={{ scale: 0, rotate: 0 }}
          animate={isInView ? { scale: 1, rotate: 45 } : { scale: 0, rotate: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <motion.div
          className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#D4AF37]"
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ originX: 0 }}
        />
      </div>
    </div>
  );
}
