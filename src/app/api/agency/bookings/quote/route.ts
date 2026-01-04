import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { RoutePrice } from '@/models';

export async function POST(req: Request) {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'agency') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { routeId, vehicles } = body;

        if (!routeId || !vehicles || !Array.isArray(vehicles)) {
            return NextResponse.json({ error: 'Missing route or vehicles' }, { status: 400 });
        }

        await dbConnect();

        let totalCost = 0;
        const details = [];

        // Pre-fetch all vehicles to create a Name -> ID map for fallback
        // This handles cases where frontend state might be stale (sending only name)
        const { Vehicle } = await import('@/models');
        const allVehicles = await Vehicle.find({}).lean();
        const vehicleMap = new Map(allVehicles.map((v: any) => [v.name, v._id.toString()]));

        for (const item of vehicles) {
            let searchId = item.vehicleId;

            // Fallback: If no ID, try to find it via Name map
            if (!searchId && item.type) {
                searchId = vehicleMap.get(item.type);
            }

            // If still no ID, we can't really find the price effectively if DB uses IDs
            // But good news: existing logic falls back to using 'type' as the key.
            // However, since we KNOW DB uses IDs, we must rely on searchId.

            const query = searchId ? { route: routeId, vehicle: searchId } : { route: routeId, vehicle: item.type };
            const priceDoc = await RoutePrice.findOne(query);
            const unitPrice = priceDoc ? priceDoc.price : 0;

            if (unitPrice === 0) {
                // Return a descriptive error if price is missing for any vehicle
                return NextResponse.json({
                    error: `Pricing not found for ${item.type} on this route.`,
                    missingVehicle: item.type
                }, { status: 400 });
            }

            const itemTotal = unitPrice * item.count;
            totalCost += itemTotal;
            details.push({
                type: item.type,
                count: item.count,
                unitPrice,
                total: itemTotal
            });
        }

        return NextResponse.json({
            totalCost,
            details,
            currency: 'SAR'
        });

    } catch (error: any) {
        console.error('Quote API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
