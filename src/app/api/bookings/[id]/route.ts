import { NextResponse } from 'next/server';
import { updateBookingStatus, deleteBooking } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { status } = await request.json();
    const updated = await updateBookingStatus(id, status);
    if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const success = await deleteBooking(id);
    if (!success) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    return NextResponse.json({ success: true });
}
