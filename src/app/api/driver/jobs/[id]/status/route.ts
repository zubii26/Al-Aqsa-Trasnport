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
        const validStatuses = ['accepted', 'en_route', 'arrived', 'completed', 'cancelled', 'rejected'];
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
        } else if (status === 'rejected') {
            // If rejected, unassign driver and set back to pending for re-assignment
            // Or keep as 'pending' but notify admin. 
            // For MVP: Let's set main status to 'pending' and clear assignment so another driver can be assigned manually

            // Actually, better to keep record of who rejected. Let's JUST status update for now.
            // Admin will see 'rejected' and re-assign manually.
            booking.status = 'pending'; // Reset main status if it was anything else
            booking.assignedDriverId = undefined; // Unassign driver
            booking.driverStatus = 'pending'; // Reset driver status for next driver

            // Wait, if we reset everything, we lose the 'rejection' event.
            // Better approach: Set main status to 'pending' (ready for reassignment) but MAYBE log it?
            // To keep it simple and safe:
            // 1. Cancel the specific driver assignment (make finding it via ID tricky if we use ID for job)
            // 2. Actually, simplest MVP: Mark booking as 'cancelled' by driver (if policy allows) OR 'pending' + unassigned.

            // Let's go with: Unassign Driver.
            booking.assignedDriverId = null;
            booking.driverStatus = 'pending';
            // We return 'rejected' so UI knows, but DB state is reset.
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
