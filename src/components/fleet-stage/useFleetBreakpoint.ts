'use client';
import { useEffect, useState } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export function useFleetBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('desktop');

  useEffect(() => {
    const mqMobile = window.matchMedia('(max-width: 640px)');
    const mqTablet = window.matchMedia('(max-width: 1024px)');

    const update = () => {
      if (mqMobile.matches) setBp('mobile');
      else if (mqTablet.matches) setBp('tablet');
      else setBp('desktop');
    };

    update();
    mqMobile.addEventListener('change', update);
    mqTablet.addEventListener('change', update);
    return () => {
      mqMobile.removeEventListener('change', update);
      mqTablet.removeEventListener('change', update);
    };
  }, []);

  return bp;
}
