'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { Vehicle } from './types';

export function ActiveVehicleInfo({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="text-center mt-4 min-h-[96px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={vehicle.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { delay: 0.15, duration: 0.25 } }}
          exit={{ opacity: 0, transition: { duration: 0.1 } }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between max-w-4xl mx-auto px-4 gap-6">
            <div className="text-center md:text-left">
              <h2 className="m-0 text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                {vehicle.name}
              </h2>
              <p className="mt-1.5 mb-0 text-sm md:text-base text-muted-foreground font-medium">
                {vehicle.passengers} passengers <span className="mx-2 opacity-50">•</span> {vehicle.bags} bags
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6">
              <div className="text-center sm:text-right">
                <p className="m-0 text-2xl md:text-3xl font-bold text-secondary">
                  {vehicle.priceFrom !== null ? `${vehicle.currency} ${vehicle.priceFrom}` : 'Contact Us'}
                  <span className="text-sm md:text-base font-medium text-muted-foreground ml-1.5">/ trip</span>
                </p>
              </div>
              
              <Link
                href={`/booking?vehicle=${vehicle.id}`}
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-secondary text-primary font-bold text-sm hover:bg-secondary/90 hover:scale-[1.02] transition-all shadow-lg shadow-secondary/20 whitespace-nowrap"
              >
                Book Now
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
