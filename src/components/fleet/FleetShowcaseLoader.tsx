import React from 'react';
import { vehicleService } from '@/services/vehicleService';
import FleetShowcase, { Vehicle as ShowcaseVehicle } from '@/components/fleet/FleetShowcase';

export default async function FleetShowcaseLoader() {
    const vehicles = await vehicleService.getActiveVehicles();

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
