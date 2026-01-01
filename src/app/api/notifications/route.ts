import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Notification } from '@/models';

export async function GET(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch unread notifications first, then some recent read ones
        // Limit to 20 total
        const notifications = await Notification.find({ userId: user.id })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return NextResponse.json(notifications);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { id, markAllRead } = body;

        await dbConnect();

        if (markAllRead) {
            await Notification.updateMany(
                { userId: user.id, isRead: false },
                { $set: { isRead: true } }
            );
            return NextResponse.json({ message: 'All marked as read' });
        }

        if (id) {
            await Notification.findByIdAndUpdate(
                id,
                { $set: { isRead: true } }
            );
            return NextResponse.json({ message: 'Marked as read' });
        }

        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
