
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Message } from '@/models';
import { pusherServer } from '@/lib/pusher';

export async function POST(request: Request) {
    try {
        const user = await requireRole(['admin', 'driver', 'manager', 'operational_manager']);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await request.json();
        const { receiverId, content, channelId } = body;

        if (!content || !channelId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const message = await Message.create({
            senderId: user._id.toString(),
            receiverId,
            senderRole: user.role,
            content,
            channelId,
            isRead: false
        });

        // Trigger Pusher event
        await pusherServer.trigger(channelId, 'new-message', {
            _id: message._id,
            content: message.content,
            senderId: message.senderId,
            senderRole: message.senderRole,
            createdAt: message.createdAt
        });

        return NextResponse.json({ success: true, message });

    } catch (error) {
        console.error('Chat Send Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
