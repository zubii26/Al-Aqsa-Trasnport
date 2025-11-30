import { NextResponse } from 'next/server';
import { getBookings, addBooking } from '@/lib/db';
import { sendEmail, getBookingConfirmationTemplate } from '@/lib/email';
import { BookingSchema } from '@/lib/validations';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bookings = await getBookings();
    return NextResponse.json(bookings);
}

export async function POST(request: Request) {

    try {
        const body = await request.json();

        // Validate input
        const validation = BookingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Invalid booking data', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const booking = await addBooking({ ...validation.data, userId: null } as any);

        // Send confirmation email
        if (booking && booking.email) {
            await sendEmail({
                to: booking.email,
                subject: 'Booking Confirmation - Al Aqsa Transport',
                html: getBookingConfirmationTemplate(booking),
            });
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
