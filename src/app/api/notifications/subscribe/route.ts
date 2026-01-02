import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/auth';
import { User } from '@/models';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const subscription = await request.json();

        // Update user with subscription
        await User.findByIdAndUpdate(user.userId, {
            pushSubscription: subscription
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Subscription error:', error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
