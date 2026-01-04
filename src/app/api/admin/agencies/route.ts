import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { User, AgencyWallet, Booking } from '@/models';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // 1. Auth Check
        const admin = await validateRequest();
        if (!admin || !['admin', 'manager'].includes(admin.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Fetch all Agencies
        const agencies = await User.find({ role: 'agency' }).lean();

        // 3. Fetch all Wallets
        const agencyIds = agencies.map(a => a._id);
        const wallets = await AgencyWallet.find({ agencyId: { $in: agencyIds } }).lean();

        // 4. Fetch Booking Counts
        const bookingCounts = await Booking.aggregate([
            { $match: { userId: { $in: agencyIds.map(id => id.toString()) } } },
            { $group: { _id: '$userId', count: { $sum: 1 } } }
        ]);

        const bookingCountMap = new Map();
        bookingCounts.forEach((item: any) => {
            bookingCountMap.set(item._id, item.count);
        });

        const walletMap = new Map();
        wallets.forEach((w: any) => {
            walletMap.set(w.agencyId.toString(), w);
        });

        // 5. Merge Data
        const result = agencies.map((agency: any) => {
            const wallet = walletMap.get(agency._id.toString()) || { balance: 0, creditLimit: agency.creditLimit || 0 };
            const count = bookingCountMap.get(agency._id.toString()) || 0;

            // Calculate Outstanding (Debt)
            // Balance is negative when owing money.
            const outstanding = wallet.balance < 0 ? Math.abs(wallet.balance) : 0;

            return {
                id: agency._id,
                name: agency.name,
                email: agency.email,
                phone: agency.phone,
                outstanding: outstanding,
                creditLimit: wallet.creditLimit,
                balance: wallet.balance,
                totalBookings: count
            };
        });

        return NextResponse.json(result);

    } catch (error) {
        console.error('Admin Agencies API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
