'use client';
import { useEffect, useState } from 'react';

export function useHoverCapability(): boolean {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const update = () => setCanHover(mq.matches);
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return canHover;
}

/**
 * Desktop: overlay shows on mouseenter, hides on mouseleave.
 * Touch: first tap on the active vehicle toggles the overlay open;
 * a second tap (or the CTA) proceeds; auto-dismisses after 4s.
 */
export function useVehicleDetailReveal(canHover: boolean) {
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  const onHoverStart = (index: number) => canHover && setRevealedIndex(index);
  const onHoverEnd = () => canHover && setRevealedIndex(null);

  const onTap = (index: number, isActive: boolean) => {
    if (canHover) return; // hover handles it on capable devices
    if (!isActive) return; // tapping a side vehicle should navigate, not reveal — handled by parent onClick
    setRevealedIndex((prev) => (prev === index ? null : index));
  };

  useEffect(() => {
    if (canHover || revealedIndex === null) return;
    const timer = setTimeout(() => setRevealedIndex(null), 4000);
    return () => clearTimeout(timer);
  }, [revealedIndex, canHover]);

  return { revealedIndex, onHoverStart, onHoverEnd, onTap, setRevealedIndex };
}
