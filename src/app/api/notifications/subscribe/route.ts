import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { User } from '@/models';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const subscription = body.subscription || body;

        // Update user with subscription
        await User.findByIdAndUpdate(user.id, {
            pushSubscription: subscription
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
