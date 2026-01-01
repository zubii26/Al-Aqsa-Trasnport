import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { getDriverBookings } from '@/lib/db';

export async function GET() {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'driver' && user.role !== 'admin') {
            return NextResponse.json({ error: 'Access denied' }, { status: 403 });
        }

        const bookings = await getDriverBookings(user.id!);

        const completedBookings = bookings.filter(b => b.driverStatus === 'completed');

        // Calculate total earnings
        const totalEarnings = completedBookings.reduce((acc, curr) => {
            const price = curr.finalPrice || parseFloat(curr.price?.replace(/[^0-9.]/g, '') || '0') || 0;
            return acc + price;
        }, 0);

        // Stats for cards
        const stats = {
            totalEarnings,
            totalTrips: completedBookings.length,
            completedTrips: completedBookings.map(b => ({
                id: b.id,
                date: `${b.date} ${b.time}`,
                route: `${b.pickup} -> ${b.dropoff}`,
                amount: b.finalPrice || parseFloat(b.price?.replace(/[^0-9.]/g, '') || '0') || 0,
                type: 'credit'
            }))
        };

        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
