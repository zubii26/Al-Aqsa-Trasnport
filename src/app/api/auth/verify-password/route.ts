import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { verifyToken } from '@/lib/auth-utils';
import { verifyPassword } from '@/lib/password-utils';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('admin_token');

        if (!token) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyToken(token.value);
        if (!payload || !payload.userId) {
            return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 401 });
        }

        const { password } = await request.json();
        if (!password) {
            return NextResponse.json({ success: false, error: 'Password required' }, { status: 400 });
        }

        await dbConnect();
        const user = await User.findById(payload.userId).lean();

        if (!user) {
            return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
        }

        let isValid = false;
        if (user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                isValid = await verifyPassword(password, user.password);
            } else {
                isValid = user.password === password;
            }
        }

        if (isValid) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }

    } catch (error) {
        console.error('Password verification error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
