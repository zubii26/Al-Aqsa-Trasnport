import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Booking } from '@/models';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        await dbConnect();

        // 1. Fetch all agencies
        const agencies = await User.find({ role: 'agency' }).lean();

        // 2. Fetch all bookings for these agencies to calculate stats
        // We do this individually or via aggregation. Aggregation is better for performance but let's keep it simple for now or use Promise.all

        const agencyStats = await Promise.all(agencies.map(async (agency) => {
            const bookings = await Booking.find({ userId: agency._id });

            const totalBookings = bookings.length;
            const outstanding = bookings
                .filter(b => b.paymentStatus !== 'paid' && b.status !== 'cancelled')
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            const paid = bookings
                .filter(b => b.paymentStatus === 'paid')
                .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

            return {
                id: agency._id.toString(),
                name: agency.name,
                email: agency.email,
                phone: agency.phone, // Assuming phone exists on User model if added
                creditLimit: agency.creditLimit || 0,
                activeContracts: agency.activeContracts || 0,
                totalBookings,
                outstanding,
                totalPaid: paid,
                balance: outstanding // Currently just outstanding
            };
        }));

        return NextResponse.json(agencyStats);
    } catch (error) {
        console.error('Agency stats error:', error);
        return NextResponse.json({ error: 'Failed to fetch agency stats' }, { status: 500 });
    }
}
