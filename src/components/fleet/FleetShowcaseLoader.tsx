import React from 'react';
import { getFleet } from '@/lib/db';
import FleetShowcase, { Vehicle as ShowcaseVehicle } from '@/components/fleet/FleetShowcase';

export default async function FleetShowcaseLoader() {
    const vehicles = await getFleet();
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
