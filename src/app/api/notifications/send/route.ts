import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { User } from '@/models';

// NOTE: In production, these should be in ENV variables
// Generate using: npx web-push generate-vapid-keys
const publicVapidKey = 'BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_85lboxZCXRCNknVKUDKnE3b-9htxvw';
const privateVapidKey = '3KjvS8rXsJ5jVw5q8r5q8r5q8r5q8r5q8r5q8r5q8r5'; // Placeholder

webpush.setVapidDetails(
    'mailto:test@example.com',
    publicVapidKey,
    privateVapidKey
);

export async function POST(request: Request) {
    try {
        const { userId, title, message } = await request.json();

        const user = await User.findById(userId);
        if (!user || !user.pushSubscription) {
            return NextResponse.json({ error: 'User not subscribed' }, { status: 404 });
        }

        const payload = JSON.stringify({ title, body: message });

        await webpush.sendNotification(user.pushSubscription, payload);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Push error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
