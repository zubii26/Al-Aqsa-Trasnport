import { NextResponse } from 'next/server';
import { routeService } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';
import { ROUTES as DEFAULT_ROUTES, VEHICLES as DEFAULT_VEHICLES } from '@/lib/pricing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    try {
        const [routes, vehicles] = await Promise.all([
            routeService.getActiveRoutes(),
            vehicleService.getActiveVehicles()
        ]);

        let activeRoutes = routes;
        let activeVehicles = vehicles;

        // Fallback to default data if database is empty
        if (activeRoutes.length === 0) {
            activeRoutes = DEFAULT_ROUTES;
        }
        if (activeVehicles.length === 0) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            activeVehicles = DEFAULT_VEHICLES.map(({ icon, ...rest }) => rest) as any;
        }
        // Sort routes alphabetically by Origin -> Destination
        activeRoutes.sort((a: any, b: any) => {
            const nameA = `${a.origin} ${a.destination}`.toLowerCase();
            const nameB = `${b.origin} ${b.destination}`.toLowerCase();
            return nameA.localeCompare(nameB);
        });



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
                origin: route.origin,
                destination: route.destination,
                // Infer category if missing for better filtering
                category: route.category || (
                    route.destination.toLowerCase().includes('airport') ? 'Airport Departure' :
                        route.origin.toLowerCase().includes('airport') ? 'Airport Arrival' :
                            route.destination.toLowerCase().includes('train station') ? 'Train Station Departure' :
                                route.origin.toLowerCase().includes('train station') ? 'Train Station Arrival' :
                                    (route.name.toLowerCase().includes('ziarat') || route.name.toLowerCase().includes('ziyarat')) ? 'Ziarat' :
                                        'Intercity'
                ),
                distance: route.distance || '',
                time: route.duration || '',
                baseRate: customRates && Object.values(customRates).length > 0
                    ? Math.min(...(Object.values(customRates) as number[]))
                    : 0,
                customRates,
                stopovers: route.stopovers || []
            };
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedVehicles = activeVehicles.map((vehicle: any) => {
            const defaultVehicle = DEFAULT_VEHICLES.find(dv => dv.id === vehicle.id || dv.name.toLowerCase() === vehicle.name.toLowerCase());
            const multiplier = defaultVehicle?.multiplier ?? 1;
            
            return {
                id: vehicle.id,
                name: vehicle.name,
                image: vehicle.image || '',
                capacity: vehicle.capacity || `${vehicle.passengers} Seater`,
                passengers: vehicle.passengers,
                multiplier,
                features: vehicle.features,
                luggage: `${vehicle.luggage} Bags`,
                category: vehicle.category,
                isActive: vehicle.isActive
            };
        });

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
        }, {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
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
