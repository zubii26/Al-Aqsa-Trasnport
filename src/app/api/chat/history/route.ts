
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Message } from '@/models';

export async function GET(request: Request) {
    try {
        const user = await requireRole(['admin', 'driver', 'manager', 'operational_manager']);
        if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const { searchParams } = new URL(request.url);
        const channelId = searchParams.get('channelId');

        if (!channelId) {
            return NextResponse.json({ error: 'Channel ID required' }, { status: 400 });
        }

        await dbConnect();

        const messages = await Message.find({ channelId })
            .sort({ createdAt: 1 }); // Oldest first for chat history

        return NextResponse.json({ messages });

    } catch (error) {
        console.error('Chat History Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
