import React from 'react';
import FleetCarousel, { Vehicle as FleetVehicle } from '@/components/home/FleetCarousel';
import { PRICING_CATEGORIES } from '@/config/pricingRanges';

export default async function FleetSectionLoader() {
    // Read from the shared display pricing config so homepage and /services match exactly.
    const carouselVehicles: FleetVehicle[] = PRICING_CATEGORIES.map(category => ({
        id: category.id,
        name: category.label,
        image: category.image,
        passengers: category.capacityLabel.split(' ')[0] || category.capacityLabel, // Extract number from "4 Passengers"
        luggage: parseInt(category.bagsLabel.split('-')[0] || category.bagsLabel) || 2, // Extract number
        features: ['Comfort Cabin', 'Strong AC', 'Spacious'], // Generic fallbacks for the carousel format
        price: `SAR ${category.priceRangeSAR[0]} - ${category.priceRangeSAR[1]}`
    }));

    return (
        <div>
            <div className="mb-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                    * Prices vary by season, day, and route — <a href="/booking" className="text-secondary hover:underline">see your exact fare on the booking page</a>.
                </p>
            </div>
            <FleetCarousel vehicles={carouselVehicles} />
        </div>
    );
}
