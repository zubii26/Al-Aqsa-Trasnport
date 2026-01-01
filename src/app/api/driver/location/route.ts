import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'driver') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { lat, lng, heading } = body;

        if (typeof lat !== 'number' || typeof lng !== 'number') {
            return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
        }

        await dbConnect();

        // Update driver location
        await User.findByIdAndUpdate(user.id, {
            location: {
                lat,
                lng,
                heading: heading || 0,
                lastUpdated: new Date()
            },
            isOnline: true // Auto-set online if sending location updates
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Location update error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
