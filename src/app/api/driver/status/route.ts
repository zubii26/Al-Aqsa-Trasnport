import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { verifyToken } from '@/lib/auth-utils';
import { cookies } from 'next/headers';

export async function PATCH(request: Request) {
    try {
        const adminToken = (await cookies()).get('admin_token')?.value;
        if (!adminToken) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(adminToken);
        if (!payload || payload.role !== 'driver') {
            return NextResponse.json({ success: false, error: 'Access denied' }, { status: 403 });
        }

        const { isOnline } = await request.json();

        await dbConnect();

        const updatedUser = await User.findByIdAndUpdate(
            payload.userId,
            { isOnline },
            { new: true }
        ).select('-password');

        return NextResponse.json({ success: true, user: updatedUser });

    } catch (error) {
        console.error('Update Status Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
