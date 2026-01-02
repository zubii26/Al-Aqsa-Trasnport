
import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Message, User } from '@/models';

export async function GET() {
    try {
        const admin = await requireRole(['admin', 'manager']);
        if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        await dbConnect();

        // Aggregate unique channels
        // This is a simplified approach. Ideally we have a 'Channel' model.
        // Here we group messages by channelId and get the latest one.

        const channels = await Message.aggregate([
            { $sort: { createdAt: -1 } },
            {
                $group: {
                    _id: '$channelId',
                    lastMessageAt: { $first: '$createdAt' },
                    lastMessage: { $first: '$content' },
                    senderId: { $first: '$senderId' } // Just one participant to identify
                }
            }
        ]);

        // Enrich with user details (Driver name)
        // Extract Driver ID from channelId 'chat_${driverId}'
        const enrichedChannels = await Promise.all(channels.map(async (ch) => {
            const driverId = ch._id.replace('chat_', '');
            const driver = await User.findById(driverId).select('name email');
            return {
                channelId: ch._id,
                lastMessageAt: ch.lastMessageAt,
                members: driver ? [driver] : [{ name: 'Unknown' }]
            };
        }));

        return NextResponse.json({ channels: enrichedChannels });

    } catch (error) {
        console.error('Chat Channels Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
