import { Suspense } from 'react';
import { vehicleService } from '@/services/vehicleService';
import { VehicleStage } from './VehicleStage';
import type { Vehicle } from './types';
import { getSettings } from '@/lib/settings-storage';

async function FleetStageFetcher() {
  const vehiclesData = await vehicleService.getVehicles();
  const settings = await getSettings(); // Could be used for default currency etc if needed

  const stageVehicles: Vehicle[] = vehiclesData
    .filter(v => v.isActive)
    .filter(v => {
      const name = (v.name || '').toLowerCase();
      // User explicitly asked to remove mercedes, mitsubishi, xpander, and bus
      if (
        name.includes('mercedes') || 
        name.includes('mitsubishi') || 
        name.includes('xpander') || 
        name.includes('bus') || 
        name.includes('coaster')
      ) {
        return false;
      }
      return true;
    })
    .slice(0, 10)
    .map(v => {
      // Parse price logic from "From SAR X" if necessary, or just use as-is
      let priceFrom: number | null = null;
      if (v.price) {
        const match = v.price.match(/\d+/);
        if (match) {
          priceFrom = parseInt(match[0], 10);
        }
      }

      // Determine relative scale based on category/name
      let relativeScale = 1; // Sedan
      const nameLower = (v.name || '').toLowerCase();
      if (nameLower.includes('coaster') || nameLower.includes('bus')) {
        relativeScale = 1.4;
      } else if (nameLower.includes('hiace') || nameLower.includes('staria') || nameLower.includes('starex')) {
        relativeScale = 1.15;
      } else if (nameLower.includes('yukon') || nameLower.includes('suv')) {
        relativeScale = 1.1;
      }

      return {
        id: v.id || 'unknown',
        slug: v.slug || '',
        name: v.name || 'Vehicle',
        category: v.category || 'Standard',
        priceFrom,
        currency: 'SAR',
        passengers: nameLower.includes('hiace') ? 10 : (v.passengers || 4),
        bags: v.luggage || 2,
        amenities: v.features || [],
        imageSrc: v.image || '/placeholder-vehicle.png',
        imageAlt: v.name || 'Umrah Taxi',
        relativeScale,
      };
    });

  return (
    <section aria-label="Vehicle fleet showcase">
      <VehicleStage vehicles={stageVehicles} />
    </section>
  );
}

export default function FleetStageWrapper() {
  return (
    <Suspense fallback={<div className="h-[500px] w-full max-w-7xl mx-auto bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl my-8" />}>
      <FleetStageFetcher />
    </Suspense>
  );
}
