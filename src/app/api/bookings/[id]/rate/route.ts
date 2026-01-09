import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { rating, review } = body;

        // Basic validation
        if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
            return NextResponse.json({ error: 'Invalid rating' }, { status: 400 });
        }

        await dbConnect();

        // 1. Verify Booking exists
        const booking = await Booking.findById(id);
        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // 2. Ideally check status is 'completed'. Disabled for testing flexibility if needed.
        if (booking.status !== 'completed') {
            // Optional: Enforce only completed trips can be rated
            // return NextResponse.json({ error: 'Trip not completed yet' }, { status: 400 });
        }

        // 3. Update Booking
        booking.rating = rating;
        booking.review = review;
        await booking.save();

        return NextResponse.json({ success: true, message: 'Rating submitted successfully' });
    } catch (error) {
        console.error('Rating API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
