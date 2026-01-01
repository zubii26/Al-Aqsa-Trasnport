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

        return NextResponse.json({ bookings });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
