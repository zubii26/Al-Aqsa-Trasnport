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
            return 999; // Others go to the end
        };

        vehicles.sort((a, b) => getSortIndex(a) - getSortIndex(b));

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
        const { name, image, passengers, luggage, features, price, hourlyRate, category, isActive, unavailableDates } = body;

        const vehicle = await vehicleService.createVehicle({
            name,
            image,
            passengers: parseInt(passengers),
            luggage: parseInt(luggage),
            features,
            price,
            hourlyRate,
            category,
            isActive,
            unavailableDates
        });

        // Audit Log
        await auditLogService.log({
            action: 'CREATE',
            entity: 'Vehicle',
            entityId: vehicle.id,
            details: `Added vehicle: ${name}`,
            user: user.name || 'Admin',
        });

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/fleet');
        revalidatePath('/admin/fleet');

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
        const { id, name, image, passengers, luggage, features, price, hourlyRate, category, isActive, unavailableDates } = body;

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
            isActive,
            unavailableDates
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

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/fleet');
        revalidatePath('/admin/fleet');

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

        const { revalidatePath } = await import('next/cache');
        revalidatePath('/fleet');
        revalidatePath('/admin/fleet');

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
