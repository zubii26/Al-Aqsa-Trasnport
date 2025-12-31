import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Subscriber } from '@/models';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
        }

        await dbConnect();

        // Check if already subscribed
        const existing = await Subscriber.findOne({ email });
        if (existing) {
            if (!existing.isActive) {
                existing.isActive = true;
                await existing.save();
                return NextResponse.json({ message: 'Welcome back! You have been resubscribed.' });
            }
            return NextResponse.json({ message: 'You are already subscribed.' });
        }

        // Create new subscriber
        await Subscriber.create({ email });

        return NextResponse.json({ message: 'Successfully subscribed!' }, { status: 201 });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
