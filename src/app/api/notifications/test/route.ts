import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { sendPushNotification } from '@/lib/notifications';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await sendPushNotification(user.id as string, {
            title: 'Test Notification',
            body: 'This is a test notification from Al Aqsa Transport!',
            url: '/admin/dashboard'
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Test notification error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
