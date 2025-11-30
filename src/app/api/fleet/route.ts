import { NextResponse } from 'next/server';
import { getFleet, addVehicle } from '@/lib/db';
import { VehicleSchema } from '@/lib/validations';
import { validateRequest } from '@/lib/server-auth';
import { logAction } from '@/lib/logger';

export async function GET() {
    const fleet = await getFleet();
    return NextResponse.json(fleet);
}

export async function POST(request: Request) {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const body = await request.json();

        // Validate input
        const validation = VehicleSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Invalid vehicle data', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const vehicle = await addVehicle({ ...validation.data, hourlyRate: null, category: validation.data.category || 'Standard', isActive: validation.data.isActive ?? true });
        await logAction('ADD_VEHICLE', `Added vehicle: ${vehicle.name}`, request.headers.get('x-forwarded-for') || 'unknown');

        return NextResponse.json(vehicle);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to add vehicle' }, { status: 500 });
    }
}
