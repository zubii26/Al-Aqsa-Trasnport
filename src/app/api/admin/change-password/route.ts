import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { requireRole } from '@/lib/server-auth';

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const { currentPassword, newPassword } = body;

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
        }

        await dbConnect();

        // Fetch user with password field (it might not be in the user object from requireRole if we stripped it, but here we need it)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const dbUser = await User.findById((user as any).id);

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        if (!dbUser.password) {
            return NextResponse.json({ error: 'User has no password set' }, { status: 400 });
        }

        // Verify current password
        let isCurrentValid = false;
        if (dbUser.password.startsWith('$2a$') || dbUser.password.startsWith('$2b$')) {
            const { verifyPassword } = await import('@/lib/password-utils');
            isCurrentValid = await verifyPassword(currentPassword, dbUser.password);
        } else {
            isCurrentValid = dbUser.password === currentPassword;
        }

        if (!isCurrentValid) {
            return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });
        }

        // Update password with hash
        const { hashPassword } = await import('@/lib/password-utils');
        dbUser.password = await hashPassword(newPassword);
        await dbUser.save();

        console.log(`Password changed for user: ${user.email}`);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Password change error:', error);
        return NextResponse.json({ error: 'Failed to change password' }, { status: 500 });
    }
}
