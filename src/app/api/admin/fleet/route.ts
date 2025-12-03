import { NextResponse } from 'next/server';
import { vehicleService } from '@/services/vehicleService';
import { auditLogService } from '@/services/auditLogService';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const vehicles = await vehicleService.getVehicles();
        // Sort by category asc
        vehicles.sort((a, b) => a.category.localeCompare(b.category));
        return NextResponse.json(vehicles);
    } catch {
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

        const vehicle = await vehicleService.createVehicle({
            name,
            image,
            passengers: parseInt(passengers),
            luggage: parseInt(luggage),
            features,
            price,
            hourlyRate,
            category,
            isActive
        });

        // Audit Log
        await auditLogService.log({
            action: 'CREATE',
            entity: 'Vehicle',
            entityId: vehicle.id,
            details: `Added vehicle: ${name}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json(vehicle);
    } catch {
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

        const vehicle = await vehicleService.updateVehicle(id, {
            name,
            image,
            passengers: parseInt(passengers),
            luggage: parseInt(luggage),
            features,
            price,
            hourlyRate,
            category,
            isActive
        });

        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }

        // Audit Log
        await auditLogService.log({
            action: 'UPDATE',
            entity: 'Vehicle',
            entityId: vehicle.id,
            details: `Updated vehicle: ${name}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json(vehicle);
    } catch {
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

        await vehicleService.deleteVehicle(id);

        // Audit Log
        await auditLogService.log({
            action: 'DELETE',
            entity: 'Vehicle',
            entityId: id,
            details: `Deleted vehicle ID: ${id}`,
            user: user.name || 'Admin',
        });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
