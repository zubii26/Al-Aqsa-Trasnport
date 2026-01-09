
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Booking, User } from '@/models';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
            },
            stats: null,
            activeAssignments: [],
            history: []
        });

    } catch (error) {
        console.error('Error fetching driver stats:', error);
        return NextResponse.json(
            { error: 'Failed to fetch driver statistics' },
            { status: 500 }
        );
    }
}
