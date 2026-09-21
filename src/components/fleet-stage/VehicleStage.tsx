'use client';

import { useCallback, useState } from 'react';
import { motion, useReducedMotion, type PanInfo } from 'framer-motion';
import Image from 'next/image';
import { GroundShadow } from './GroundShadow';
import { ActiveVehicleInfo } from './ActiveVehicleInfo';
import { useFleetBreakpoint } from './useFleetBreakpoint';
import { getVehicleTransform, getShadowTransform, STAGE_SPRING } from './fleetStage.styles';
import type { Vehicle } from './types';

export function VehicleStage({ vehicles }: { vehicles: Vehicle[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const breakpoint = useFleetBreakpoint();
  const reducedMotion = useReducedMotion() ?? false;
  const count = vehicles.length;

  const goTo = useCallback((delta: 1 | -1) => {
    setActiveIndex((prev) => (prev + delta + count) % count);
  }, [count]);

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    if (info.offset.x < -80 || info.velocity.x < -400) goTo(1);
    else if (info.offset.x > 80 || info.velocity.x > 400) goTo(-1);
  };

  // Increased base width for a more premium, larger presentation
  const baseWidth = breakpoint === 'mobile' ? 240 : breakpoint === 'tablet' ? 320 : 420;
  // Tighter stage height to eliminate excessive empty space
  const stageHeight = breakpoint === 'mobile' ? 280 : breakpoint === 'tablet' ? 320 : 360;

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto py-8">
      {/* Crawlable, screen-reader-accessible vehicle data */}
      <ul className="sr-only" aria-hidden="false">
        {vehicles.map((v) => (
          <li key={v.id} itemScope itemType="https://schema.org/Vehicle">
            <span itemProp="name">{v.name}</span> — <span itemProp="offers">
              {v.priceFrom !== null ? `${v.currency} ${v.priceFrom}` : 'Contact for pricing'}
            </span> — {v.passengers} passengers, {v.bags} bags
          </li>
        ))}
      </ul>

      <div
        role="region"
        aria-label="Vehicle fleet showcase"
        style={{
          position: 'relative',
          height: stageHeight,
          perspective: 1400,
          overflow: 'hidden',
          touchAction: 'pan-y',
          // Professional showroom gradient backdrop
          background: 'radial-gradient(ellipse at 50% 60%, rgba(212, 175, 55, 0.08) 0%, rgba(255,255,255,0) 60%)',
          borderRadius: '24px',
        }}
      >
        <div aria-live="polite" className="sr-only">
          {vehicles[activeIndex].name} — {vehicles[activeIndex].currency} {vehicles[activeIndex].priceFrom ?? 'contact for pricing'}
        </div>

        <div style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d' }}>
          {vehicles.map((vehicle, index) => {
            let offset = index - activeIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const isActive = offset === 0;
            const t = getVehicleTransform(offset, breakpoint, vehicle.relativeScale);
            const shadow = getShadowTransform(offset, breakpoint, vehicle.relativeScale);
            const width = baseWidth * vehicle.relativeScale;

            if (t.display === 'none') return null;

            return (
              <motion.div
                key={vehicle.id}
                onClick={() => {
                  if (!isActive) goTo(offset > 0 ? 1 : -1);
                }}
                drag={isActive ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={isActive ? handleDragEnd : undefined}
                initial={false}
                animate={
                  reducedMotion
                    ? { x: t.translateX, opacity: t.opacity, scale: t.scale }
                    : {
                        x: t.translateX,
                        z: t.translateZ,
                        rotateY: t.rotateY,
                        scale: t.scale,
                        opacity: t.opacity,
                        filter: t.filter,
                      }
                }
                transition={STAGE_SPRING}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 24,
                  width,
                  marginLeft: -width / 2,
                  zIndex: t.zIndex,
                  cursor: isActive ? 'grab' : 'pointer',
                  transformStyle: 'preserve-3d',
                }}
                tabIndex={0}
                aria-label={`Select ${vehicle.name}`}
              >
                <GroundShadow transform={shadow} width={width} />
                <Image
                  src={vehicle.imageSrc}
                  alt={vehicle.imageAlt}
                  width={width * 2} // 2x resolution for crisp retina display
                  height={width * 1.3} // width * 0.65 * 2
                  quality={95} // Premium compression quality
                  priority={isActive}
                  loading={isActive ? undefined : 'lazy'}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </motion.div>
            );
          })}
        </div>

      {/* Arrows (desktop/tablet only) */}
      {breakpoint !== 'mobile' && vehicles.length > 1 && (
        <>
          <NavButton direction="prev" onClick={() => goTo(-1)} />
          <NavButton direction="next" onClick={() => goTo(1)} />
        </>
      )}
    </div>

      <ActiveVehicleInfo vehicle={vehicles[activeIndex]} />

      <div className="flex justify-center items-center gap-3 mt-4 h-6">
        {vehicles.map((v, i) => (
          <button
            key={v.id}
            type="button"
            aria-label={`Show ${v.name}`}
            aria-current={i === activeIndex}
            onClick={() => setActiveIndex(i)}
            className="group p-2 -m-2"
          >
            <div className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-secondary' : 'w-2 bg-slate-300 dark:bg-slate-600 group-hover:bg-slate-400 dark:group-hover:bg-slate-500'}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  return (
    <button
      type="button"
      aria-label={direction === 'prev' ? 'Previous vehicle' : 'Next vehicle'}
      onClick={onClick}
      className={`absolute top-1/2 -translate-y-1/2 ${direction === 'prev' ? 'left-4' : 'right-4'} w-12 h-12 rounded-full border border-secondary/50 text-secondary text-3xl flex items-center justify-center cursor-pointer z-50 hover:border-secondary hover:bg-secondary/10 transition-all font-light`}
    >
      <span className="mb-1 leading-none">{direction === 'prev' ? '\u2039' : '\u203A'}</span>
    </button>
  );
}
