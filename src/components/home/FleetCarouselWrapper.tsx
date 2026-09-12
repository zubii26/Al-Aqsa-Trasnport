import { Suspense } from 'react';
import FleetCarousel from '@/components/fleet/FleetCarousel';
import { vehicleService } from '@/services/vehicleService';
import type { Vehicle as FleetVehicle } from '@/components/fleet/types';

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
            passengers: v.name.toLowerCase().includes('hiace') ? "10/11" : v.passengers,
            luggage: v.luggage,
            features: v.features,
            price: v.price
        }));

    return (
        <section aria-label="Vehicle fleet">
            <noscript>
                <ul>
                    {carouselVehicles.map((v) => (
                        <li key={v.id}>
                            {v.name} — {v.price} / trip ({v.passengers} passengers, {v.luggage} bags)
                        </li>
                    ))}
                </ul>
            </noscript>
            <FleetCarousel vehicles={carouselVehicles} />
        </section>
    );
}

export default function FleetCarouselWrapper() {
    return (
        <Suspense fallback={<div className="h-[400px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl" />}>
            <FleetCarouselFetcher />
        </Suspense>
    );
}
