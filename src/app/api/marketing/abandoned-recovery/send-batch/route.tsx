
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Booking, DraftBooking } from '@/models';
import { sendEmail } from '@/lib/email';
import { render } from '@react-email/render';
import AbandonedCartTemplate from '@/components/emails/AbandonedCartTemplate';

export async function POST(req: Request) {
    try {
        const user = await requireRole(['admin', 'manager', 'operational_manager']);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 1. Find stale drafts (inactive for > 15 mins, < 24 hours) that haven't been recovered
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const staleDrafts = await DraftBooking.find({
            recoveryEmailSent: false,
            lastActive: { $lt: fifteenMinutesAgo, $gt: twentyFourHoursAgo },
            email: { $exists: true, $ne: '' } // Must have email
        }).limit(50); // Batch size limit

        let results = {
            processed: 0,
            succeeded: 0,
            failed: 0,
            skipped: 0 // If they actually completed a booking later
        };

        for (const draft of staleDrafts) {
            results.processed++;

            // 2. Check if they actually completed a booking AFTER this draft started
            // using email and phone fuzziness
            const completedBooking = await Booking.findOne({
                $or: [{ email: draft.email }, { phone: draft.phone }],
                createdAt: { $gt: draft.createdAt } // Created AFTER the draft
            });

            if (completedBooking) {
                // They converted! No need to email.
                // Mark as sent to ignore in future
                draft.recoveryEmailSent = true;
                await draft.save();
                results.skipped++;
                continue;
            }

            // 3. Send Recovery Email
            try {
                const recoveryLink = `${process.env.NEXT_PUBLIC_APP_URL}/booking?draftId=${draft._id}&step=${draft.step}`;

                // Extract vehicle name safely
                let vehicleName = 'Vehicle';
                if (draft.data?.selectedVehicles?.length > 0) {
                    // We might not have vehicle names in data if we only stored IDs, 
                    // but usually selectedVehicles in state has ID. 
                    // For now, let's just say "Premium Vehicle" or try to look it up if we had vehicles in DB context.
                    // Simpler: "Your Vehicle"
                    vehicleName = "Premium Vehicle";
                }

                const emailHtml = await render(
                    <AbandonedCartTemplate
                        customerName={draft.name || 'Valued Guest'}
                        pickup={draft.data?.pickup || 'Pickup Location'}
                        dropoff={draft.data?.dropoff || 'Destination'}
                        vehicleName={vehicleName}
                        recoveryLink={recoveryLink}
                    />
                );

                await sendEmail({
                    to: draft.email!,
                    subject: `Complete your booking to ${draft.data?.dropoff || 'Makkah'} - Al Aqsa Transport`,
                    html: emailHtml,
                });

                draft.recoveryEmailSent = true;
                await draft.save();
                results.succeeded++;

            } catch (err) {
                console.error(`Failed to email draft ${draft._id}:`, err);
                results.failed++;
            }
        }

        return NextResponse.json({ success: true, results });

    } catch (error) {
        console.error('Batch Recovery Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
