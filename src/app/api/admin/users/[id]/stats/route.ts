
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking, User } from '@/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        // Verify User exists and is a driver
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Fetch all bookings for this driver
        const bookings = await Booking.find({ assignedDriverId: id })
            .sort({ date: -1, time: -1 }) // Most recent first
            .lean();

        // Calculate Stats
        const completedBookings = bookings.filter(b => b.driverStatus === 'completed');
        const activeBookings = bookings.filter(b =>
            ['assigned', 'accepted', 'en_route', 'arrived'].includes(b.driverStatus || '') ||
            (b.driverStatus === 'pending' && b.status !== 'cancelled')
        );

        // Earnings Calculation (Assuming price is stored in booking)
        // Note: Booking schema might not have 'price' explicitly typed in all versions, 
        // so we cast to any or check existence.
        const totalEarnings = completedBookings.reduce((sum, booking: any) => {
            return sum + (Number(booking.price) || 0);
        }, 0);

        // Group History by Month (Optional, for simplified charts if needed)
        // For now, return raw lists

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt
            },
            stats: {
                totalEarnings,
                completedTrips: completedBookings.length,
                totalTrips: bookings.length,
                rating: 5.0 // Placeholder or calculate if Rating model exists and links to driver
            },
            activeAssignments: activeBookings.map(b => ({
                id: b._id,
                pickup: b.pickup,
                dropoff: b.dropoff,
                date: b.date,
                time: b.time,
                status: b.driverStatus || 'pending',
                price: (b as any).price
            })),
            history: completedBookings.slice(0, 50).map(b => ({ // Limit to 50 recent
                id: b._id,
                pickup: b.pickup,
                dropoff: b.dropoff,
                date: b.date,
                time: b.time,
                status: b.driverStatus,
                price: (b as any).price
            }))
        });

    } catch (error) {
        console.error('Error fetching driver stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch driver statistics' },
            { status: 500 }
        );
    }
}
