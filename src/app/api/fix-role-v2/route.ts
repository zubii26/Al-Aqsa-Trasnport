
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';

export async function GET() {
    try {
        await dbConnect();

        // Force update by ID
        const result = await User.updateOne(
            { _id: '692db09634f15bc89b45a5e5' },
            { $set: { role: 'operational_manager' } }
        );

        // Also try by email just in case ID is weird
        const result2 = await User.updateOne(
            { email: 'meharzubair@gmail.com' },
            { $set: { role: 'operational_manager' } }
        );

        return NextResponse.json({
            success: true,
            message: 'Attempted update',
            byId: result,
            byEmail: result2
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}
