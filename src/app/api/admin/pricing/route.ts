import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    try {
        const prices = await prisma.routePrice.findMany();
        return NextResponse.json(prices);
    } catch (error) {
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

        const routePrice = await prisma.routePrice.upsert({
            where: {
                routeId_vehicleId: {
                    routeId,
                    vehicleId
                }
            },
            update: { price: parseFloat(price) },
            create: {
                routeId,
                vehicleId,
                price: parseFloat(price)
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'RoutePrice',
                entityId: routePrice.id,
                details: `Updated price for Route ${routeId} / Vehicle ${vehicleId} to ${price}`,
                user: 'Admin',
            }
        });

        return NextResponse.json(routePrice);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
    }
}
