import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { User, IUser } from '@/models';

export async function GET() {
    try {
        const user = await requireRole(['admin', 'manager', 'operational_manager']);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
        }

        await dbConnect();

        // Fetch drivers who have location data
        // Filter by isOnline: true OR updated recently (e.g. last 24h)
        const drivers = await User.find({
            role: 'driver',
            location: { $exists: true }
        }).select('name email isOnline location phone').lean();

        // Cast to unknown first if needed, but lean() returns POJOs
        // We ensure we return a clean structure
        const formattedDrivers = drivers.map((d: any) => ({
            id: d._id.toString(),
            name: d.name,
            email: d.email,
            phone: d.phone,
            isOnline: d.isOnline,
            location: d.location
        }));

        return NextResponse.json(formattedDrivers);
    } catch (error) {
        console.error('Tracking API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
