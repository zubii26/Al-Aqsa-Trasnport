
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models'; // Assuming Booking model exists and is exported
import { formatDistanceToNow } from 'date-fns';

export async function GET() {
    try {
        await dbConnect();

        // Fetch last 10 bookings
        const bookings = await Booking.find({})
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        const formattedBookings = bookings.map((booking: any) => {
            let firstName = "Guest";
            
            if (booking.name && typeof booking.name === 'string') {
                // Check if name looks like email or phone to prevent PII leak
                const isEmail = booking.name.includes('@');
                const isPhone = /[\d]{5,}/.test(booking.name);
                
                if (!isEmail && !isPhone) {
                    firstName = booking.name.split(' ')[0];
                    // Capitalize first letter
                    firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
                }
            }

            return {
                id: booking._id.toString(),
                name: firstName,
                city: booking.pickup || "Jeddah",
                country: "Saudi Arabia",
                vehicle: booking.vehicle || "VIP Transport",
                action: "Just booked",
                timestamp: booking.createdAt,
                time: formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true })
            };
        });

        // If no bookings, we might want to return mixed/static data to keep the site lively?
        // But user asked for "auto update when new booking is held".
        // So let's return what we have. API consumer can fallback if empty.

        return NextResponse.json({ bookings: formattedBookings });
    } catch (error) {
        console.error('Error fetching recent bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}
