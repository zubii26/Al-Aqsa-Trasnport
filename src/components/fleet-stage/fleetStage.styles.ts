import type { Breakpoint } from './useFleetBreakpoint';

export interface VehicleTransform {
  translateX: number;
  translateZ: number;
  rotateY: number;
  scale: number;
  opacity: number;
  filter: string;
  zIndex: number;
  display: 'block' | 'none';
}

export interface ShadowTransform {
  translateX: number;
  scale: number;
  opacity: number;
}

const CONFIG: Record<Breakpoint, {
  spacingX: number;
  depthStep: number;
  rotateStep: number;
  scaleStep: number;
  opacityStep: number;
  blurStep: number;
  visibleRange: number;
}> = {
  // Increased spacingX to prevent overlap and create a clean, professional gap between cars
  desktop: { spacingX: 380, depthStep: 300, rotateStep: 40, scaleStep: 0.30, opacityStep: 0.40, blurStep: 2.5, visibleRange: 2 },
  tablet:  { spacingX: 280, depthStep: 240, rotateStep: 32, scaleStep: 0.32, opacityStep: 0.50, blurStep: 1.5, visibleRange: 2 },
  mobile:  { spacingX: 200, depthStep: 120, rotateStep: 20, scaleStep: 0.35, opacityStep: 0.60, blurStep: 0, visibleRange: 1 },
};

export function getVehicleTransform(
  offset: number,
  breakpoint: Breakpoint,
  relativeScale: number,
): VehicleTransform {
  const cfg = CONFIG[breakpoint];
  const abs = Math.abs(offset);

  if (abs > cfg.visibleRange) {
    return { translateX: 0, translateZ: 0, rotateY: 0, scale: 0, opacity: 0, filter: 'blur(0px)', zIndex: 0, display: 'none' };
  }

  const scale = (1 - abs * cfg.scaleStep) * relativeScale;

  return {
    translateX: offset * cfg.spacingX,
    translateZ: -abs * cfg.depthStep,
    rotateY: -Math.sign(offset) * cfg.rotateStep * abs,
    scale,
    opacity: 1 - abs * cfg.opacityStep,
    filter: cfg.blurStep ? `blur(${abs * cfg.blurStep}px)` : 'blur(0px)',
    zIndex: 100 - abs,
    display: 'block',
  };
}

export function getShadowTransform(offset: number, breakpoint: Breakpoint, relativeScale: number): ShadowTransform {
  const cfg = CONFIG[breakpoint];
  const abs = Math.abs(offset);
  return {
    translateX: offset * cfg.spacingX,
    // shadows shrink/fade faster than the vehicle itself — distant shadows
    // read as "further away" more than distant objects do
    scale: (1 - abs * (cfg.scaleStep * 1.3)) * relativeScale,
    opacity: Math.max(0, 0.35 - abs * 0.15),
  };
}

export const STAGE_SPRING = { type: 'spring', stiffness: 220, damping: 28, mass: 1 } as const;
export const HOVER_TRANSITION = { duration: 0.2, ease: [0.22, 1, 0.36, 1] } as const;
