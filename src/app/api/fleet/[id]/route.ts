import { NextResponse } from 'next/server';
import { updateVehicle, deleteVehicle } from '@/lib/db';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const vehicle = await updateVehicle(id, body);
        if (!vehicle) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }
        return NextResponse.json(vehicle);
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to update vehicle' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const success = await deleteVehicle(id);
        if (!success) {
            return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true });
    } catch (_error) {
        return NextResponse.json({ error: 'Failed to delete vehicle' }, { status: 500 });
    }
}
