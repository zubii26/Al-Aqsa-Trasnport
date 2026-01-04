import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> } // Standard Next.js 15+ async params
) {
    try {
        const { id } = await params;
        const { status } = await req.json();

        // Validate status transition
        const validStatuses = ['en_route', 'arrived', 'completed', 'passenger_onboard'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        const cookieStore = await cookies();
        const token = cookieStore.get('token');

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token.value);
        if (!payload || payload.role !== 'driver') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await dbConnect();

        // Find booking (ensure assigned to this driver)
        const booking = await Booking.findOne({ _id: id, assignedDriverId: payload.userId });
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found or not assigned to you' }, { status: 404 });
        }

        // Update Driver Status
        booking.driverStatus = status;

        // Sync with main booking status
        if (status === 'completed') {
            booking.status = 'completed';
            // If payment was cash, mark as paid? Let's leave payment separate for now or assume driver collected.
            // booking.paymentStatus = 'paid'; 
        } else if (status === 'en_route') {
            booking.status = 'confirmed'; // Ensure it stays confirmed/active
        }

        await booking.save();

        // Trigger Real-time Event (Admin/Agency)
        try {
            const { pusherServer } = await import('@/lib/pusher');
            // Notify Admin
            await pusherServer.trigger('admin-channel', 'booking-updated', {
                bookingId: booking._id,
                status: booking.status,
                driverStatus: status,
                message: `Driver updated status to ${status}`
            });

            // Notify Agency (if applicable)
            if (booking.userId) { // Assuming userId on booking is Agency/User ID
                await pusherServer.trigger(`agency-channel-${booking.userId}`, 'booking-updated', {
                    bookingId: booking._id,
                    status: booking.status,
                    driverStatus: status
                });
            }
        } catch (err) {
            console.error('Realtime trigger failed', err);
        }

        return NextResponse.json({ success: true, booking });

    } catch (error) {
        console.error('Error updating job status:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
