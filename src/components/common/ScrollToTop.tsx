'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop — fires IMMEDIATELY on every route change via pathname.
 *
 * This component must be placed INSIDE SmoothScrollProvider so that
 * window.__lenis is available. It runs BEFORE PageTransition's
 * AnimatePresence, ensuring scroll is at 0 before any animation starts.
 *
 * Strategy:
 * 1. Reset Lenis (virtual scroller) to 0 immediately
 * 2. Reset native window scroll to 0 with behavior: 'instant'
 * 3. Handle popstate (back/forward) by skipping the reset
 */
export default function ScrollToTop() {
  const pathname = usePathname();
  const isFirstMount = useRef(true);
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
    // Skip on first mount — browser handles initial load
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }

    // Skip on browser back/forward — let the browser restore position naturally
    if (isPopstate.current) {
      isPopstate.current = false;
      return;
    }

    // ── Step A: Reset Lenis virtual scroll position ──────────────────────
    const lenis = (window as any).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    }

    // ── Step B: Reset native browser scroll immediately ──────────────────
    // MUST use behavior: 'instant' — 'smooth' animates from old position
    // creating the visible "scroll-to-footer" artifact
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0; // Safari fallback
    document.body.scrollTop = 0;            // Old WebKit fallback

  }, [pathname]); // Re-runs on every route change

  return null; // Renders nothing — pure side-effect
}
