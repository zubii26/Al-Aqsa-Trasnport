import { NextResponse } from 'next/server';
import { getBookings, getFleet } from '@/lib/db';
import { getPricingData } from '@/lib/pricing-storage';
import { getLogs } from '@/lib/logger';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const [bookings, fleet, pricing, logs] = await Promise.all([
            getBookings(),
            getFleet(),
            getPricingData(),
            getLogs()
        ]);

        const totalBookings = bookings.length;
        const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
        // Calculate revenue (assuming price is stored or can be estimated, for now just count confirmed)
        // Since we don't store exact price in booking yet (it's calculated on frontend), we might need to update booking model later.
        // For now, let's just show counts.

        const stats = {
            totalBookings,
            pendingBookings: bookings.filter(b => b.status === 'pending').length,
            confirmedBookings: confirmedBookings.length,
            totalVehicles: fleet.length,
            totalRoutes: pricing.routes.length,
            recentActivity: logs.slice(0, 5)
        };

        return NextResponse.json(stats);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
    }
}
