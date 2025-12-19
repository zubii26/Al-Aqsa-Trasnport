import { Suspense } from 'react';
import QuickBookingForm from './QuickBookingForm';
import { routeService } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';

interface BookingFormWrapperProps {
    className?: string;
    title?: string;
    subtitle?: string;
}

async function BookingFormFetcher({ className, title, subtitle }: BookingFormWrapperProps) {
    const [vehicles, routes] = await Promise.all([
        vehicleService.getVehicles(),
        routeService.getRoutes()
    ]);

    const activeRoutes = routes.filter(r => r.isActive);

    // Format for QuickBookingForm
    const pricingRoutes = activeRoutes.map(route => ({
        id: route.id,
        name: `${route.origin} → ${route.destination}`,
        distance: route.distance || '',
        time: route.duration || '',
        baseRate: 0,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        customRates: (route.prices || []).reduce((acc: Record<string, number>, rp: any) => {
            acc[rp.vehicleId] = rp.price;
            return acc;
        }, {} as Record<string, number>)
    }));

    // Map to QuickBookingForm format
    const pricingVehicles = vehicles.filter(v => v.isActive).map(v => ({
        id: v.id,
        name: v.name,
        capacity: `${v.passengers} Seater`,
        luggage: `${v.luggage} Bags`,
        multiplier: 1,
        features: v.features,
        category: (v.category as 'Standard' | 'Premium' | 'VIP') || 'Standard',
        isActive: v.isActive
    }));

    return <QuickBookingForm
        initialRoutes={pricingRoutes}
        initialVehicles={pricingVehicles}
        title={title}
        subtitle={subtitle}
        className={className}
    />;
}

export default function BookingFormWrapper(props: BookingFormWrapperProps) {
    return (
        <div className="hidden md:block w-full relative z-10 px-4 md:px-0">
            <Suspense fallback={<div className="w-full h-[400px] bg-white/10 backdrop-blur-md rounded-2xl animate-pulse" />}>
                <BookingFormFetcher {...props} />
            </Suspense>
        </div>
    );
}
