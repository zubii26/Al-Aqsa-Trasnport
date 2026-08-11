"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "@studio-freight/lenis";

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  // Never run Lenis inside the admin panel — it intercepts all wheel events
  // globally on the document, which prevents child elements (sidebar nav,
  // data tables, modals) from receiving native scroll events.
  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    // Destroy any existing Lenis instance when entering admin routes
    if (isAdmin) {
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
        delete (window as any).__lenis;
      }
      return; // Do not initialise Lenis on admin pages
    }

    // ── Public pages: initialise Lenis smooth scroll ──────────────────────
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.5,
      smoothWheel: true,
      orientation: "vertical",
      gestureOrientation: "vertical",
      infinite: false,
    });

    lenisRef.current = lenis;
    (window as any).__lenis = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    const rafId = requestAnimationFrame(raf);

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        e.preventDefault();
        const target = document.querySelector(
          (anchor as HTMLAnchorElement).getAttribute("href")!
        );
        if (target) lenis.scrollTo(target as HTMLElement, { offset: -80 });
      });
    });

    const handleScrollToTop = () => {
      lenis.scrollTo(0, { immediate: true });
    };
    window.addEventListener("lenis-scroll-to-top", handleScrollToTop);

    return () => {
      window.removeEventListener("lenis-scroll-to-top", handleScrollToTop);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete (window as any).__lenis;
    };
  }, [isAdmin]);

  return <>{children}</>;
}
