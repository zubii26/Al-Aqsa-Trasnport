'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop — fires on every route change via pathname.
 * 
 * Placed INSIDE SmoothScrollProvider but BEFORE PageTransition,
 * so it fires at the earliest possible moment when the URL changes.
 * 
 * This resets scroll BEFORE AnimatePresence even starts its exit animation,
 * ensuring the user never sees the old page at a wrong scroll position.
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);
  const isPopstate = useRef(false);

  // Detect browser back/forward navigation
  useEffect(() => {
    const handlePopstate = () => {
      isPopstate.current = true;
    };
    window.addEventListener('popstate', handlePopstate);
    return () => window.removeEventListener('popstate', handlePopstate);
  }, []);

  useEffect(() => {
    // Only fire when pathname actually changes
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;

    // Skip on browser back/forward — let the browser restore position naturally
    if (isPopstate.current) {
      isPopstate.current = false;
      return;
    }

    // ── Reset Lenis virtual scroll position ──────────────────────────────
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    // ── Reset native browser scroll immediately ──────────────────────────
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

  }, [pathname]);

  return null;
}
