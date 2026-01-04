import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function GET() {
    try {
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

        // Fetch bookings assigned to this driver
        // Sort by Date/Time (Ascending - earliest first)
        const bookings = await Booking.find({
            assignedDriverId: payload.userId,
            status: { $ne: 'cancelled' } // Exclude cancelled? Maybe show them. Let's keep them for history.
        })
            .sort({ date: 1, time: 1 }) // Earliest date first
            .lean();

        return NextResponse.json(bookings);

    } catch (error) {
        console.error('Error fetching driver jobs:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
