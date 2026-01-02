
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth'; // Or just generic auth check
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';

export async function GET() {
    try {
        // Authenticate - allow 'user', 'driver', 'admin' etc.
        // We really just need the current user ID.
        // `requireRole` usually returns the User object from DB.

        // Since we allow any role, we can pass all, or better:
        // create a generic `requireAuth` helper.
        // For now, let's reuse requireRole with 'user' which is our target.
        const user = await requireRole(['user', 'admin', 'manager', 'driver']);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch bookings where userId matches
        const bookings = await Booking.find({ userId: user._id })
            .sort({ createdAt: -1 })
            .limit(50); // Limit to 50 for now

        return NextResponse.json({ success: true, bookings });

    } catch (error) {
        console.error('Fetch My Bookings Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
