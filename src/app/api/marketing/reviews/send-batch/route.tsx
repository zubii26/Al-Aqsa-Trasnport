import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking } from '@/models';
import { requireRole } from '@/lib/server-auth';
import { sendEmail } from '@/lib/email';
import { ReviewTemplate } from '@/components/emails/ReviewTemplate';
import { render } from '@react-email/render';

export async function POST() {
    try {
        const user = await requireRole(['admin', 'operational_manager']);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find eligible bookings: Completed, No email sent yet, Updated more than 2 hours ago (buffer time)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);

        const bookings = await Booking.find({
            status: 'completed',
            reviewEmailSent: { $ne: true },
            updatedAt: { $lt: twoHoursAgo }
        }).limit(20); // Process in batches of 20 to avoid timeouts

        const results = {
            processed: 0,
            succeeded: 0,
            failed: 0
        };

        for (const booking of bookings) {
            results.processed++;
            try {
                // Generate a review link (pointing to a review page or Google)
                // specific review page: /reviews/new?bookingId=...
                const reviewLink = `${process.env.NEXT_PUBLIC_APP_URL}/reviews/new?id=${booking._id}`;

                const html = await render(
                    <ReviewTemplate
                        customerName={booking.name}
                        bookingId={booking._id.toString()}
                        reviewLink={reviewLink}
                    />
                );

                await sendEmail({
                    to: booking.email,
                    subject: 'How was your trip with Al Aqsa Transport?',
                    html: html
                });

                // Mark as sent
                booking.reviewEmailSent = true;
                await booking.save();
                results.succeeded++;
            } catch (err) {
                console.error(`Failed to send review email to ${booking.email}`, err);
                results.failed++;
            }
        }

        return NextResponse.json({
            message: 'Batch processing complete',
            stats: results
        });

    } catch (error) {
        console.error('Review Batch Send Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
