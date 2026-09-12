'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { FleetCard } from './FleetCard';
import { useFleetBreakpoint } from './useFleetBreakpoint';
import { getCardTransform, RING_SPRING } from './fleetCarousel.styles';
import type { Vehicle } from './types';
import { useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FleetCarouselProps {
  vehicles: Vehicle[];
}

export default function FleetCarousel({ vehicles }: FleetCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const breakpoint = useFleetBreakpoint();
  const prefersReducedMotion = useReducedMotion();
  const count = vehicles.length;

  const goTo = useCallback(
    (delta: 1 | -1) => {
      setActiveIndex((prev) => (prev + delta + count) % count);
    },
    [count],
  );

  // Auto-advance
  useEffect(() => {
    if (prefersReducedMotion || breakpoint === 'mobile') return;
    
    const interval = setInterval(() => {
      goTo(1);
    }, 6000);
    
    return () => clearInterval(interval);
  }, [goTo, prefersReducedMotion, breakpoint]);

  const handleDragEnd = (_: PointerEvent, info: PanInfo) => {
    const threshold = 80;
    const velocityThreshold = 400;
    if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) goTo(1);
    else if (info.offset.x > threshold || info.velocity.x > velocityThreshold) goTo(-1);
  };

  const cardWidth = breakpoint === 'mobile' ? 280 : breakpoint === 'tablet' ? 300 : 340;
  const stageHeight = breakpoint === 'mobile' ? 560 : 540;

  if (!vehicles || vehicles.length === 0) return null;

  return (
    <div
      role="region"
      aria-label="Vehicle fleet carousel"
      style={{
        position: 'relative',
        height: stageHeight,
        overflow: 'hidden',
        touchAction: 'pan-y', 
        width: '100%',
        marginTop: '2rem',
        marginBottom: '2rem'
      }}
    >
      <div aria-live="polite" className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0">
        {vehicles[activeIndex].name} — starting from{' '}
        {vehicles[activeIndex].price}
      </div>

      <div className="relative w-full h-full max-w-7xl mx-auto">
          {vehicles.map((vehicle, index) => {
            let offset = index - activeIndex;
            if (offset > count / 2) offset -= count;
            if (offset < -count / 2) offset += count;

            const transform = prefersReducedMotion 
              ? { ...getCardTransform(offset, breakpoint), x: 0, scale: offset === 0 ? 1 : 0, opacity: offset === 0 ? 1 : 0, filter: 'none' } 
              : getCardTransform(offset, breakpoint);
            const isActive = offset === 0;

            return (
              <motion.div
                key={vehicle.id}
                drag={isActive && !prefersReducedMotion ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={breakpoint === 'mobile' ? 0.1 : 0.2}
                onDragEnd={isActive ? handleDragEnd : undefined}
                animate={transform}
                transition={prefersReducedMotion ? { duration: 0.3 } : RING_SPRING}
                style={{
                  position: 'absolute',
                  left: '50%',
                  top: 20,
                  width: cardWidth,
                  marginLeft: -cardWidth / 2,
                  cursor: isActive ? 'grab' : transform.display === 'none' ? 'default' : 'pointer',
                  pointerEvents: transform.display === 'none' ? 'none' : 'auto',
                  willChange: 'transform, opacity, filter',
                  height: isActive ? '460px' : '400px', // slightly taller active card
                }}
                whileTap={isActive && !prefersReducedMotion ? { cursor: 'grabbing' } : undefined}
                onClick={() => {
                  if (isActive) return;
                  goTo(offset > 0 ? 1 : -1);
                }}
              >
                <FleetCard vehicle={vehicle} isActive={isActive} priority={isActive} />
              </motion.div>
            );
          })}

          <NavButton direction="prev" onClick={() => goTo(-1)} />
          <NavButton direction="next" onClick={() => goTo(1)} />

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {vehicles.map((v, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={v.id}
                  type="button"
                  aria-label={`Show ${v.name}`}
                  aria-current={isActive}
                  onClick={() => setActiveIndex(i)}
                  className={`rounded-full transition-all duration-300 ${
                    isActive 
                      ? 'w-6 h-2 bg-secondary' 
                      : 'w-2 h-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                />
              );
            })}
          </div>
      </div>
    </div>
  );
}

function NavButton({ direction, onClick }: { direction: 'prev' | 'next'; onClick: () => void }) {
  const isPrev = direction === 'prev';
  return (
    <button
      type="button"
      aria-label={isPrev ? 'Previous vehicle' : 'Next vehicle'}
      onClick={onClick}
      className={`
        absolute top-1/2 -translate-y-1/2 z-30
        w-12 h-12 flex items-center justify-center rounded-full
        bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm
        border border-slate-200 dark:border-slate-800
        text-slate-600 dark:text-slate-400
        hover:border-secondary hover:text-secondary dark:hover:border-secondary dark:hover:text-secondary
        transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
        ${isPrev ? 'left-2 md:left-8' : 'right-2 md:right-8'}
      `}
    >
      {isPrev ? <ChevronLeft size={24} strokeWidth={2.5} /> : <ChevronRight size={24} strokeWidth={2.5} />}
    </button>
  );
}
