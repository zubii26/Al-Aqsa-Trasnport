import React from 'react';
import { vehicleService } from '@/services/vehicleService';
import FleetCarousel, { Vehicle as FleetVehicle } from '@/components/home/FleetCarousel';

export default async function FleetSectionLoader() {
    const vehicles = await vehicleService.getActiveVehicles();
    const carouselVehicles: FleetVehicle[] = vehicles.slice(0, 6).map(v => ({
        id: v.id || '',
        name: v.name,
        image: v.image,
        passengers: v.passengers,
        luggage: v.luggage,
        features: v.features,
        price: v.price
    }));

    return <FleetCarousel vehicles={carouselVehicles} />;
}
