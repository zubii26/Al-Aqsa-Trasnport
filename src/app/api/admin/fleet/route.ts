import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const vehicles = await prisma.vehicle.findMany({
            orderBy: { category: 'asc' }
        });
        return NextResponse.json(vehicles);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch vehicles' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { name, image, passengers, luggage, features, price, hourlyRate, category, isActive } = body;

        const vehicle = await prisma.vehicle.create({
            data: {
                name,
                image,
                passengers: parseInt(passengers),
                luggage: parseInt(luggage),
                features,
                price,
                hourlyRate,
                category,
                isActive
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'CREATE',
                entity: 'Vehicle',
                entityId: vehicle.id,
                details: `Added vehicle: ${name}`,
                user: 'Admin',
            }
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create vehicle' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { id, name, image, passengers, luggage, features, price, hourlyRate, category, isActive } = body;

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const vehicle = await prisma.vehicle.update({
            where: { id },
            data: {
                name,
                image,
                passengers: parseInt(passengers),
                luggage: parseInt(luggage),
                features,
                price,
                hourlyRate,
                category,
                isActive
            }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'UPDATE',
                entity: 'Vehicle',
                entityId: vehicle.id,
                details: `Updated vehicle: ${name}`,
                user: 'Admin',
            }
        });

        return NextResponse.json(vehicle);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        await prisma.vehicle.delete({
            where: { id }
        });

        // Audit Log
        await prisma.auditLog.create({
            data: {
                action: 'DELETE',
                entity: 'Vehicle',
                entityId: id,
                details: `Deleted vehicle ID: ${id}`,
                user: 'Admin',
            }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
