import { NextResponse } from 'next/server';
import { routeService } from '@/services/routeService';
import { auditLogService } from '@/services/auditLogService';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        // In Firestore, prices are embedded in routes.
        // We need to extract them to match the expected API response format if the frontend expects a flat list of prices.
        // Or we can just return the routes and let the frontend handle it, but to minimize frontend changes, let's flatten.
        const routes = await routeService.getRoutes();
        const prices = routes.flatMap(route =>
            (route.prices || []).map((p: { vehicleId: string; price: number }) => ({
                id: `${route.id}_${p.vehicleId}`, // Synthetic ID
                routeId: route.id,
                vehicleId: p.vehicleId,
                price: p.price
            }))
        );
        return NextResponse.json(prices);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch prices' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { routeId, vehicleId, price } = body;

        const updatedPrice = await routeService.updateRoutePrice(routeId, vehicleId, parseFloat(price));

        if (!updatedPrice) {
            return NextResponse.json({ error: 'Route not found' }, { status: 404 });
        }

        // Audit Log
        await auditLogService.log({
            action: 'UPDATE',
            entity: 'RoutePrice',
            entityId: `${routeId}_${vehicleId}`,
            details: `Updated price for Route ${routeId} / Vehicle ${vehicleId} to ${price}`,
            user: user.name || 'Admin', // Use actual user name
        });

        return NextResponse.json(updatedPrice);
    } catch {
        return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
    }
}
