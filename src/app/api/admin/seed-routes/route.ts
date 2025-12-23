import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { routeService } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';

// This endpoint is for internal/admin use to seed the DB with the specific routes from the Pricing Grids
export async function GET() {
    try {
        // 1. Get Vehicles to find IDs
        const vehicles = await vehicleService.getActiveVehicles();
        const gmc = vehicles.find((v: any) => v.name.toLowerCase().includes('gmc') || v.id.includes('gmc'));
        const camry = vehicles.find((v: any) => v.name.toLowerCase().includes('camry'));

        if (!gmc || !camry) {
            return NextResponse.json({ error: 'Vehicles not found. Ensure GMC and Camry exist.' }, { status: 400 });
        }

        const gmcId = gmc.id.toString();
        const camryId = camry.id.toString();

        // 2. Define Routes Data (Merged from GMC and Camry Grids)
        // Prices: [GMC_Price, Camry_Price]
        const routesToSeed = [
            {
                key: 'jed-mak',
                origin: 'Jeddah Airport',
                destination: 'Makkah Hotel',
                distance: '100 km',
                duration: '1 hr 30 min',
                category: 'Airport Arrival',
                prices: { [gmcId]: 550, [camryId]: 250 }
            },
            {
                key: 'mak-jed',
                origin: 'Makkah Hotel',
                destination: 'Jeddah Airport',
                distance: '100 km',
                duration: '1 hr 30 min',
                category: 'Airport Departure',
                prices: { [gmcId]: 500, [camryId]: 200 }
            },
            {
                key: 'mad-ziarat',
                origin: 'Madinah',
                destination: 'Ziarat (Half Day)',
                distance: '40 km',
                duration: '3-4 hrs',
                category: 'Ziarat',
                prices: { [gmcId]: 600, [camryId]: 300 }
            },
            {
                key: 'mad-mak',
                origin: 'Madinah Hotel',
                destination: 'Makkah Hotel',
                distance: '450 km',
                duration: '4 hrs 30 min',
                category: 'Intercity',
                prices: { [gmcId]: 1400, [camryId]: 500 }
            },
            {
                key: 'mak-mad',
                origin: 'Makkah Hotel',
                destination: 'Madinah Hotel',
                distance: '450 km',
                duration: '4 hrs 30 min',
                category: 'Intercity',
                prices: { [gmcId]: 1400, [camryId]: 500 }
            },
            {
                key: 'hourly',
                origin: 'Hourly Rental',
                destination: 'Per Hour',
                distance: '-',
                duration: '1 hr',
                category: 'Intercity',
                prices: { [gmcId]: 150, [camryId]: 80 }
            },
            {
                key: 'mak-taif',
                origin: 'Makkah',
                destination: 'Taif (Return)',
                distance: '180 km',
                duration: '8-10 hrs',
                category: 'Intercity',
                prices: { [gmcId]: 1300, [camryId]: 500 }
            },
            {
                key: 'jed-taif',
                origin: 'Jeddah',
                destination: 'Taif (Return)',
                distance: '350 km',
                duration: '10-12 hrs',
                category: 'Intercity',
                prices: { [gmcId]: 800, [camryId]: 700 }
            },
            {
                key: 'mad-ziarat-taxi',
                origin: 'Madinah',
                destination: 'Ziyarat Taxi (Standard)',
                distance: '40 km',
                duration: '3 hrs',
                category: 'Ziarat',
                prices: { [gmcId]: 500, [camryId]: 250 }
            },
            {
                key: 'mak-ziarat',
                origin: 'Makkah',
                destination: 'Ziyarat (Half Day)',
                distance: '40 km',
                duration: '3-4 hrs',
                category: 'Ziarat',
                prices: { [gmcId]: 600, [camryId]: 250 }
            },
            {
                key: 'mad-air-mad-hot',
                origin: 'Madinah Airport',
                destination: 'Madinah Hotel',
                distance: '20 km',
                duration: '25 min',
                category: 'Airport Arrival',
                prices: { [gmcId]: 200, [camryId]: 120 }
            },
            {
                key: 'mad-hot-mad-air',
                origin: 'Madinah Hotel',
                destination: 'Madinah Airport',
                distance: '20 km',
                duration: '25 min',
                category: 'Airport Departure',
                prices: { [gmcId]: 200, [camryId]: 150 }
            },
            {
                key: 'jed-air-mad-hot',
                origin: 'Jeddah Airport',
                destination: 'Madinah Hotel',
                distance: '400 km',
                duration: '4 hrs',
                category: 'Airport Arrival',
                prices: { [gmcId]: 1350, [camryId]: 600 }
            },
            {
                key: 'jed-air-jed-hot',
                origin: 'Jeddah Airport',
                destination: 'Jeddah Hotel',
                distance: '40 km',
                duration: '45 min',
                category: 'Airport Arrival',
                prices: { [gmcId]: 250, [camryId]: 150 }
            },
            {
                key: 'jed-hot-jed-air',
                origin: 'Jeddah Hotel',
                destination: 'Jeddah Airport',
                distance: '40 km',
                duration: '45 min',
                category: 'Airport Departure',
                prices: { [gmcId]: 250, [camryId]: 200 }
            }
        ];

        const results = [];
        const existingRoutes = await routeService.getRoutes();

        for (const r of routesToSeed) {
            // Check if route exists
            let route = existingRoutes.find(er =>
                er.origin.toLowerCase() === r.origin.toLowerCase() &&
                er.destination.toLowerCase() === r.destination.toLowerCase()
            );

            // Create if not exists
            if (!route) {
                route = await routeService.createRoute({
                    origin: r.origin,
                    destination: r.destination,
                    distance: r.distance,
                    duration: r.duration,
                    category: r.category,
                }) as any;
            } else {
                // Update category for existing routes
                await routeService.updateRoute(route.id, {
                    category: r.category,
                    distance: r.distance,
                    duration: r.duration
                });
            }

            // Update Prices
            if (route && route.id) {
                for (const [vId, price] of Object.entries(r.prices)) {
                    await routeService.updateRoutePrice(route.id, vId, price);
                }

                results.push({
                    key: r.key,
                    id: route.id,
                    origin: r.origin,
                    destination: r.destination,
                    category: r.category
                });
            }
        }

        // 3. Invalidate Cache
        // TODO: revalidateTag expects 2 arguments in this version? checks needed.
        // revalidateTag('routes');

        return NextResponse.json({
            success: true,
            vehicleIds: { gmc: gmcId, camry: camryId },
            mappings: results
        });

    } catch (error) {
        console.error('Seed Error:', error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
