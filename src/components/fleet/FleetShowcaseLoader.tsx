import React from 'react';
import { getFleet } from '@/lib/db';
import FleetShowcase, { Vehicle as ShowcaseVehicle } from '@/components/fleet/FleetShowcase';

export default async function FleetShowcaseLoader() {
    const vehicles = await getFleet();

    // Enforce specific sort order
    const sortOrder = ['camry', 'gmc', 'staria', 'starex', 'hiace', 'coaster'];
    vehicles.sort((a, b) => {
        const idA = (a.id || '').toLowerCase();
        const idB = (b.id || '').toLowerCase();

        const indexA = sortOrder.indexOf(idA);
        const indexB = sortOrder.indexOf(idB);

        // If both are in the list, sort by index
        if (indexA !== -1 && indexB !== -1) return indexA - indexB;

        // If only A is in the list, it comes first
        if (indexA !== -1) return -1;

        // If only B is in the list, it comes first
        if (indexB !== -1) return 1;

        // If neither is in the list, keep original order
        return 0;
    });

    const showcaseVehicles: ShowcaseVehicle[] = vehicles.map(v => ({
        id: v.id || '',
        name: v.name,
        price: v.price,
        passengers: v.passengers,
        luggage: v.luggage,
        features: v.features,
        image: v.image
    }));

    return <FleetShowcase vehicles={showcaseVehicles} />;
}
