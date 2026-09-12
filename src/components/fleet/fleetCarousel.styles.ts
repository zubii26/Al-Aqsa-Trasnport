import type { Breakpoint } from './useFleetBreakpoint';

export interface CardTransform {
  x: number;
  scale: number;
  opacity: number;
  filter: string;
  zIndex: number;
  display: 'block' | 'none';
}

const CONFIG_BY_BREAKPOINT: Record<Breakpoint, {
  spacing: number;
  scaleStep: number;
  opacityStep: number;
  blurStep: number;
  visibleRange: number;
}> = {
  desktop: { spacing: 200, scaleStep: 0.18, opacityStep: 0.35, blurStep: 2, visibleRange: 2 },
  tablet:  { spacing: 160, scaleStep: 0.22, opacityStep: 0.45, blurStep: 2, visibleRange: 1 },
  // Mobile: no blur (GPU cost on mid-range Android), tighter range, bigger active card
  mobile:  { spacing: 140, scaleStep: 0.30, opacityStep: 0.55, blurStep: 0, visibleRange: 1 },
};

export function getCardTransform(offset: number, breakpoint: Breakpoint): CardTransform {
  const cfg = CONFIG_BY_BREAKPOINT[breakpoint];
  const abs = Math.abs(offset);

  if (abs > cfg.visibleRange) {
    return { x: 0, scale: 0, opacity: 0, filter: 'blur(0px)', zIndex: 0, display: 'none' };
  }

  return {
    x: offset * cfg.spacing,
    scale: 1 - abs * cfg.scaleStep,
    opacity: 1 - abs * cfg.opacityStep,
    filter: cfg.blurStep ? `blur(${abs * cfg.blurStep}px)` : 'blur(0px)',
    zIndex: 10 - abs,
    display: 'block',
  };
}

export const RING_SPRING = { type: 'spring', stiffness: 300, damping: 32, mass: 0.9 } as const;
export const RING_EASE = [0.22, 1, 0.36, 1] as const; // ease-out-back feel for non-drag transitions
