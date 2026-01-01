import { NextResponse } from 'next/server';
import { updateBookingStatus, deleteBooking } from '@/lib/db';
import { requireRole } from '@/lib/server-auth';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireRole(['ADMIN', 'MANAGER', 'OPERATIONAL_MANAGER'])) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { id } = await params;
    const body = await request.json();

    // Extract updateable fields to prevent overwriting critical immutable data if needed
    // For now, we trust admin input, but filtering is safer.
    const { status, assignedDriverId, driverStatus } = body;
    const updates: any = {};
    if (status) updates.status = status;
    if (assignedDriverId !== undefined) updates.assignedDriverId = assignedDriverId;
    if (driverStatus) updates.driverStatus = driverStatus;

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { updateBooking } = await import('@/lib/db');
    const updated = await updateBooking(id, updates);

    if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Send confirmation email if status changed to confirmed
    if (status === 'confirmed') {
        const { sendBookingConfirmationEmail } = await import('@/lib/email');
        const bookingData = {
            ...updated,
            id: updated._id.toString(),
            email: updated.email,
            name: updated.name,
        } as any;

        await sendBookingConfirmationEmail(bookingData);
    }

    return NextResponse.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    if (!await requireRole(['ADMIN', 'MANAGER'])) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
