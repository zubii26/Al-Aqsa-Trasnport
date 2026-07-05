
import { NextResponse } from 'next/server';
import { getBookings } from '@/lib/db';
import { Booking } from '@/models';

export async function POST(request: Request) {
    try {
        const { reference, email } = await request.json();

        if (!reference || !email) {
            return NextResponse.json(
                { success: false, message: 'Booking reference and email are required' },
                { status: 400 }
            );
        }

        // Find booking matching BOTH ID and Email for security
        // Using Mongoose model directly for findOne if getBookings is too generic
        // Assuming Booking model is available via models index

        let booking = null;
        try {
            const isObjectId = /^[0-9a-fA-F]{24}$/.test(reference);
            const query: any = { email: { $regex: new RegExp(`^${email}$`, 'i') } };
            
            if (isObjectId) {
                query.$or = [{ _id: reference }, { bookingReference: reference }];
            } else {
                query.bookingReference = reference;
            }
            
            booking = await Booking.findOne(query);
        } catch (err) {
            // Likely invalid ObjectId format or db error
            return NextResponse.json(
                { success: false, message: 'Invalid booking reference format' },
                { status: 400 }
            );
        }

        if (!booking) {
            return NextResponse.json(
                { success: false, message: 'Booking not found. Please check your reference and email.' },
                { status: 404 }
            );
        }

        // Return only safe, relevant information
        return NextResponse.json({
            success: true,
            booking: {
                id: booking.bookingReference || booking._id,
                status: booking.status,
                createdAt: booking.createdAt,
                date: booking.date,
                time: booking.time,
                pickup: booking.pickup,
                dropoff: booking.dropoff,
                vehicle: booking.vehicle,
                passengers: booking.passengers
            }
        });

    } catch (error) {
        console.error('Track booking error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
