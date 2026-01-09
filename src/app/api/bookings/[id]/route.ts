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
    const { status, paymentStatus } = body;
    const updates: any = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    if (Object.keys(updates).length === 0) {
        return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { updateBooking } = await import('@/lib/db');

    // Store old booking to check against
    const { Booking } = await import('@/models');
    const oldBooking = await Booking.findById(id).lean();

    const updated = await updateBooking(id, updates);

    // Trigger Notification: If admin confirms booking (Notify user? Not implemented yet as we lack user accounts for customers)

    if (!updated) return NextResponse.json({ error: 'Booking not found' }, { status: 404 });

    // Send confirmation email if status changed to confirmed
    // Send confirmation email if status changed to confirmed
    if (status === 'confirmed') {
        const { sendBookingConfirmationEmail } = await import('@/lib/email');
        const bookingData = {
            ...updated,
            id: updated._id.toString(),
            email: updated.email,
            name: updated.name,
        } as any;

        try {
            await sendBookingConfirmationEmail(bookingData);
        } catch (e) {
            console.error('Failed to send confirmation email', e);
        }
    }

    // Realtime Updates
    try {
        const { pusherServer } = await import('@/lib/pusher');
        // Notify Admins
        await pusherServer.trigger('admin-channel', 'booking-updated', {
            id: updated._id,
            status: updated.status,
            updatedBy: 'admin' // or generic
        });

        // Notify User
        if (updated.userId) {
            await pusherServer.trigger(`user-channel-${updated.userId}`, 'booking-updated', {
                id: updated._id,
                paymentStatus: updated.paymentStatus,
            });
        }

        // Notify Guest Tracker
        await pusherServer.trigger(`booking-channel-${updated._id}`, 'status-updated', {
            id: updated._id,
            status: updated.status,
            // Trigger client refresh
        });
    } catch (realtimeErr) {
        console.error('Realtime update failed:', realtimeErr);
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
