import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const [routes, vehicles, routePrices] = await Promise.all([
            prisma.route.findMany({ where: { isActive: true } }),
            prisma.vehicle.findMany({ where: { isActive: true } }),
            prisma.routePrice.findMany()
        ]);

        const formattedRoutes = routes.map((route: any) => {
            const prices = routePrices.filter((rp: any) => rp.routeId === route.id);
            const customRates = prices.reduce((acc: Record<string, number>, rp: any) => {
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

        const formattedVehicles = vehicles.map((vehicle: any) => ({
            id: vehicle.id,
            name: vehicle.name,
            capacity: `${vehicle.passengers} Seater`,
            multiplier: 1, // Not used
            features: vehicle.features,
            luggage: `${vehicle.luggage} Bags`,
            category: vehicle.category,
            isActive: vehicle.isActive
        }));

        return NextResponse.json({
            routes: formattedRoutes,
            vehicles: formattedVehicles
        });
    } catch (error) {
        console.error('Failed to fetch pricing:', error);
        return NextResponse.json({ error: 'Failed to fetch pricing data' }, { status: 500 });
    }
}
