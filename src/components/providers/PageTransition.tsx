"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useEffect, useRef, useState } from "react";

// Safe useLayoutEffect for Server-Side Rendering
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * InnerScrollReset mounts EXACTLY when the new page mounts.
 * useLayoutEffect runs synchronously before the browser paints the new frame.
 */
function InnerScrollReset() {
  useIsomorphicLayoutEffect(() => {
    // Reset Lenis virtual scroll immediately (before paint)
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    // Reset native scroll immediately (before paint)
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  return null;
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const prevPath = useRef(path);

  // CRITICAL FIX: Track whether this is the initial mount.
  // On initial mount (SSR → hydration), we use initial={false} so that
  // the server-rendered HTML is NOT wrapped in opacity:0. This prevents
  // the blank white/dark screen if JS hydration is slow or fails.
  // On subsequent client-side navigations, we enable the fade animation.
  const isInitialMount = useRef(true);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    // After first hydration, mark as mounted so future navigations animate
    isInitialMount.current = false;
    setHasMounted(true);
  }, []);

  // Reset scroll IMMEDIATELY when pathname changes — before AnimatePresence
  // even starts its exit animation. This is critical because mode="wait"
  // delays the new page mount, leaving the user staring at old content
  // at position 0 during the exit fade, which feels correct.
  useIsomorphicLayoutEffect(() => {
    if (prevPath.current !== path) {
      prevPath.current = path;

      // Reset Lenis
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }

      // Reset native scroll
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [path]);

  return (
    <AnimatePresence mode="wait" onExitComplete={() => {
      // Safety net: reset again after exit animation completes,
      // right before the new page mounts
      const lenis = (window as any).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }}>
      <motion.div
        key={path}
        initial={hasMounted ? { opacity: 0 } : { opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <InnerScrollReset />
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
