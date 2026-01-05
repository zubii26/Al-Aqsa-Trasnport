
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Notification } from '@/models'; // Assuming Notification model exists

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await dbConnect();

        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const now = new Date();

        // Find drivers with expiring documents in the next 30 days
        // We check licenseExpiry, iqamaExpiry, etc.
        const expiringDrivers = await User.find({
            role: 'driver',
            $or: [
                { licenseExpiry: { $lt: thirtyDaysFromNow, $gt: now } },
                { iqamaExpiry: { $lt: thirtyDaysFromNow, $gt: now } },
                { insuranceExpiry: { $lt: thirtyDaysFromNow, $gt: now } }
            ]
        });

        // 2. Send Notifications
        const results = [];
        for (const driver of expiringDrivers) {
            let message = 'Action Required: ';
            const expiries = [];

            if (driver.licenseExpiry < thirtyDaysFromNow) expiries.push('License');
            if (driver.iqamaExpiry < thirtyDaysFromNow) expiries.push('Iqama');
            if (driver.insuranceExpiry < thirtyDaysFromNow) expiries.push('Insurance');

            message += `${expiries.join(', ')} expiring soon. Please renew.`;

            // Check if notification already sent recently (e.g. today)? 
            // For MVP specific checks might be complex, so we just send/log.

            // Create in-app notification
            await Notification.create({
                userId: driver._id,
                title: 'Document Expiry Alert',
                message: message,
                type: 'warning',
                link: '/driver/documents' // Deep link to documents page
            });

            // Send Push Notification
            try {
                const { sendPushNotification } = await import('@/lib/notifications');
                await sendPushNotification(driver._id, {
                    title: 'Document Expiry Warning',
                    body: message,
                    url: '/driver/documents'
                });
            } catch (pushError) {
                console.error('Failed to send push:', pushError);
            }

            results.push({ driver: driver.name, issues: expiries });
        }

        return NextResponse.json({
            success: true,
            checkedCount: expiringDrivers.length,
            alertsSent: results
        });

    } catch (error) {
        console.error('Compliance Check Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
