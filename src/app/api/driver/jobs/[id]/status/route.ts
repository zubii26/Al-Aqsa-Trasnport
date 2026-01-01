import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { sendBookingStatusEmail } from '@/lib/email';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'driver') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const { status } = await request.json();

        // Validate status transition
        const validStatuses = ['accepted', 'en_route', 'arrived', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        await dbConnect();

        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Optional: Verify assignment
        // if (booking.assignedDriverId !== user.id) ...

        // Update Driver Status
        booking.driverStatus = status;

        // Sync Main Status
        if (status === 'completed' || status === 'cancelled') {
            booking.status = status;
        } else if (status === 'accepted') {
            booking.status = 'confirmed';
        }

        await booking.save();

        // Send Notification
        try {
            // driverName fallback to "Your Driver" if user.name is missing
            await sendBookingStatusEmail({
                ...booking.toObject(),
                id: booking._id.toString(),
                // Ensure dates are strings as expected by email template, otherwise toObject might have Date objects
                date: booking.date,
                time: booking.time
            } as any, user.name || 'Your Driver');
        } catch (emailError) {
            console.error('Failed to send status email:', emailError);
            // Don't fail the request if email fails, just log it
        }

        return NextResponse.json({ success: true, booking });
    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
