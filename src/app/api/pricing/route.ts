import { NextResponse } from 'next/server';
import { routeService } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';
import { ROUTES as DEFAULT_ROUTES, VEHICLES as DEFAULT_VEHICLES } from '@/lib/pricing';

export async function GET() {
    try {
        const [routes, vehicles] = await Promise.all([
            routeService.getActiveRoutes(),
            vehicleService.getActiveVehicles()
        ]);

        // Fallback to default data if database is empty
        if (routes.length === 0 && vehicles.length === 0) {
            return NextResponse.json({
                routes: DEFAULT_ROUTES,
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                vehicles: DEFAULT_VEHICLES.map(({ icon, ...rest }) => rest) // Remove icon component for JSON serialization
            });
        }

        const activeRoutes = routes;
        const activeVehicles = vehicles;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedRoutes = activeRoutes.map((route: any) => {
            // In Firestore, we store prices directly on the route object
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const customRates = (route.prices || []).reduce((acc: Record<string, number>, rp: any) => {
                acc[rp.vehicleId] = rp.price;
                return acc;
            }, {} as Record<string, number>);

            return {
                id: route.id,
                name: `${route.origin} → ${route.destination}`,
                distance: route.distance || '',
                time: route.duration || '',
                baseRate: 0, // Not used when customRates are present
                customRates
            };
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedVehicles = activeVehicles.map((vehicle: any) => ({
            id: vehicle.id,
            name: vehicle.name,
            capacity: `${vehicle.passengers} Seater`,
            multiplier: 1, // Not used
            features: vehicle.features,
            luggage: `${vehicle.luggage} Bags`,
            category: vehicle.category,
            isActive: vehicle.isActive
        }));

        // Enforce specific sort order
        // Enforce specific sort order with robust matching
        const getSortIndex = (v: any) => {
            const str = `${v.id} ${v.name}`.toLowerCase();
            if (str.includes('camry')) return 0;
            if (str.includes('gmc') || str.includes('yukon')) return 1;
            if (str.includes('staria')) return 2;
            if (str.includes('starex')) return 3;
            if (str.includes('hiace')) return 4;
            if (str.includes('coaster')) return 5;
            return 999;
        };

        formattedVehicles.sort((a, b) => getSortIndex(a) - getSortIndex(b));

        return NextResponse.json({
            routes: formattedRoutes,
            vehicles: formattedVehicles
        });
    } catch (error) {
        console.error('Failed to fetch pricing:', error);
        // Fallback on error as well
        return NextResponse.json({
            routes: DEFAULT_ROUTES,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            vehicles: DEFAULT_VEHICLES.map(({ icon, ...rest }) => rest) // Remove icon component for JSON serialization
        });
    }
}
