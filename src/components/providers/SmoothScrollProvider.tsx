"use client";
import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Disable native browser scroll restoration to prevent jumping to footer
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    const lenis = new Lenis({
      lerp: 0.08,             // Linear interpolation (lerp) is much smoother than duration/easing
      wheelMultiplier: 1.0,   // Natural wheel speed
      touchMultiplier: 1.5,   // Good mobile feel
      smoothWheel: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
      infinite: false,
    });

    lenisRef.current = lenis;

    // ── CRITICAL: expose globally for ScrollToTop component ──────────────
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    /* Make anchor links (#section) work with Lenis */
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(
          (anchor as HTMLAnchorElement).getAttribute("href")!
        );
        if (target) lenis.scrollTo(target as HTMLElement, { offset: -80 });
      });
    });

    /* Handle custom scroll to top from Page Transitions */
    const handleScrollToTop = () => {
      lenis.scrollTo(0, { immediate: true });
    };
    window.addEventListener('lenis-scroll-to-top', handleScrollToTop);

    return () => {
      window.removeEventListener('lenis-scroll-to-top', handleScrollToTop);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as any).__lenis;
    };
  }, []);

  return <>{children}</>;
}

