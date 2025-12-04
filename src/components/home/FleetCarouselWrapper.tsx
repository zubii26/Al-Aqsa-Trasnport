import { Suspense } from 'react';
import FleetCarousel from './FleetCarousel';
import { vehicleService } from '@/services/vehicleService';
import { Vehicle as FleetVehicle } from './FleetCarousel';

import { getSettings } from '@/lib/settings-storage';

async function FleetCarouselFetcher() {
    const vehicles = await vehicleService.getVehicles();
    const settings = await getSettings();

    // Map to FleetCarousel format
    const carouselVehicles: FleetVehicle[] = vehicles
        .filter(v => v.isActive)
        .slice(0, 6)
        .map(v => ({
            id: v.id,
            name: v.name,
            image: v.image,
            passengers: v.passengers,
            luggage: v.luggage,
            features: v.features,
            price: v.price
        }));

    return <FleetCarousel vehicles={carouselVehicles} discount={settings.discount} />;
}

export default function FleetCarouselWrapper() {
    return (
        <Suspense fallback={<div className="h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />}>
            <FleetCarouselFetcher />
        </Suspense>
    );
}
