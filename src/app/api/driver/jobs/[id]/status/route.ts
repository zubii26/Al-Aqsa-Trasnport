import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { updateDriverBookingStatus, getBooking } from '@/lib/db';

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Params must be awaited in latest Next.js
) {
    try {
        const { id } = await params;
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { status } = await request.json();

        // 1. Verify access: Is this driver assigned to this job? (Or is admin)
        const booking = await getBooking(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (user.role !== 'admin' && booking.assignedDriverId !== user.id) {
            return NextResponse.json({ error: 'Access denied to this booking' }, { status: 403 });
        }

        // 2. Validate status
        const validStatuses = ['pending', 'accepted', 'en_route', 'arrived', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
        }

        // 3. Update
        const updatedBooking = await updateDriverBookingStatus(id, status);

        return NextResponse.json({ booking: updatedBooking });
    } catch (error: any) {
        console.error('Update Job Status Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
