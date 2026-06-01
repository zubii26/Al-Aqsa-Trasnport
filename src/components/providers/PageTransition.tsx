"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect } from "react";

// Safe useLayoutEffect for Server-Side Rendering
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * InnerScrollReset mounts EXACTLY when the new page mounts, after the old page exits.
 * useLayoutEffect runs synchronously before the browser paints the new frame,
 * completely eliminating scroll-jumping or footer-landing.
 */
function InnerScrollReset() {
  useIsomorphicLayoutEffect(() => {
    // Delay by a couple frames to ensure Next.js has finished its own scroll restoration
    // and DOM calculations before we forcefully reset it.
    let frameId: number;
    frameId = requestAnimationFrame(() => {
      frameId = requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        window.dispatchEvent(new Event('lenis-scroll-to-top'));
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, []);

  return null;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.main
        key={path}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <InnerScrollReset />
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
