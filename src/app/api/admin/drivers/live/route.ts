
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        // Fetch users with role 'driver' and who have reported a location recently?
        // For now, just all drivers.
        const drivers = await User.find({
            role: 'driver'
        }).select('name email phone location isOnline isActive');

        // Transform to match standardized interface if needed, or return raw
        return NextResponse.json(drivers);
    } catch (error) {
        console.error('Error fetching live drivers:', error);
        return NextResponse.json(
            { error: 'Failed to fetch live drivers' },
            { status: 500 }
        );
    }
}
