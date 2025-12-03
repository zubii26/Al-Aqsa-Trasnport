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

    // Check booking status first
    const { getBooking } = await import('@/lib/db');
    const booking = await getBooking(id);

    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    if (booking.status !== 'completed' && booking.status !== 'cancelled') {
        return NextResponse.json(
            { error: 'Only completed or cancelled bookings can be deleted' },
            { status: 400 }
        );
    }

    const success = await deleteBooking(id);
    if (!success) return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 });

    return NextResponse.json({ success: true });
}
