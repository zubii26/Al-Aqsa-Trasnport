import webpush from 'web-push';
import { User, IUser } from '@/models';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:support@alaqsa-transport.com', // Replace with real admin email
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    );
}

interface NotificationPayload {
    title: string;
    body: string;
    url?: string;
}

export async function sendPushNotification(userId: string, payload: NotificationPayload) {
    try {
        if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
            console.warn('VAPID keys not configured, skipping push notification');
            return;
        }

        const user = await User.findById(userId);
        if (!user || !user.pushSubscription) {
            return; // No subscription
        }

        const subscription = user.pushSubscription;

        await webpush.sendNotification(
            subscription,
            JSON.stringify(payload)
        );

        console.log(`Push notification sent to ${userId}`);
    } catch (error) {
        console.error('Error sending push notification:', error);
        // If 410 or 404, subscription is invalid. Remove it.
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((error as any).statusCode === 410 || (error as any).statusCode === 404) {
            await User.findByIdAndUpdate(userId, { $unset: { pushSubscription: 1 } });
            console.log(`Removed invalid subscription for ${userId}`);
        }
    }
}
