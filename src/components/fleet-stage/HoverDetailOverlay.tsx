'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { HOVER_TRANSITION } from './fleetStage.styles';
import type { Vehicle } from './types';
import Link from 'next/link';

interface Props {
  vehicle: Vehicle;
  visible: boolean;
  reducedMotion: boolean;
}

export function HoverDetailOverlay({ vehicle, visible, reducedMotion }: Props) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={HOVER_TRANSITION}
          className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[86%] p-4 rounded-2xl bg-background/80 dark:bg-slate-900/80 backdrop-blur-xl border-t-2 border-secondary shadow-2xl pointer-events-auto"
        >
          <p className="m-0 text-xs text-secondary font-semibold tracking-wider uppercase">
            {vehicle.category}
          </p>
          <h3 className="mt-1 mb-2 text-xl font-bold text-foreground">
            {vehicle.name}
          </h3>
          
          <div className="flex justify-between items-center mb-3">
            <div>
              <span className="text-xs text-muted-foreground">From </span>
              <span className="text-lg font-bold text-secondary">
                {vehicle.priceFrom !== null ? `${vehicle.currency} ${vehicle.priceFrom}` : 'Contact Us'}
              </span>
            </div>
            <div className="flex gap-3 text-xs text-muted-foreground font-medium">
              <span>{vehicle.passengers} pax</span>
              <span>{vehicle.bags} bags</span>
            </div>
          </div>
          
          <Link
            href={`/booking?vehicle=${vehicle.id}`}
            className="block w-full py-2.5 text-center rounded-xl bg-secondary text-primary font-bold text-sm hover:bg-secondary/90 hover:scale-[1.02] transition-all"
          >
            Book {vehicle.name}
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
