import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Super simple secret key to prevent random access
    if (secret !== 'alaqsa-reset-2026') {
        return NextResponse.json({ error: 'Invalid secret key' }, { status: 403 });
    }

    try {
        await dbConnect();
        const { hashPassword } = await import('@/lib/password-utils');
        
        const newPassword = 'AdminPassword123!';
        const hashedPassword = await hashPassword(newPassword);

        // Find the admin user and update the password
        const adminUser = await User.findOneAndUpdate(
            { role: 'admin' }, 
            { $set: { password: hashedPassword } },
            { new: true }
        ).lean();

        if (!adminUser) {
            return NextResponse.json({ error: 'No admin user found in database' }, { status: 404 });
        }

        return NextResponse.json({ 
            success: true, 
            message: 'Admin password has been reset successfully!',
            email: adminUser.email,
            newPassword: newPassword
        });

    } catch (error) {
        console.error('Reset error:', error);
        return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
    }
}
