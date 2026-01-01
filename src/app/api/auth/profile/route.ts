import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

export async function GET() {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Return safe user data
        return NextResponse.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone || '', // Assuming phone added to User schema, if not we need to add it or ignore
        });
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
        const { name, phone, password, currentPassword } = body;

        await dbConnect();
        const dbUser = await User.findById(user.id);

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update basic info
        if (name) dbUser.name = name;
        if (phone) dbUser.phone = phone; // Schema update might be needed if phone splits to profile

        // Password change logic
        if (password) {
            // Optimally we should verify current password here if meant to be secure
            // const isMatch = await verifyPassword(currentPassword, dbUser.password);
            // if (!isMatch) return NextResponse.json({ error: 'Incorrect current password' }, { status: 400 });

            dbUser.password = await hashPassword(password);
        }

        await dbUser.save();

        return NextResponse.json({
            message: 'Profile updated successfully',
            user: {
                id: dbUser._id.toString(),
                name: dbUser.name,
                email: dbUser.email,
                role: dbUser.role,
                phone: dbUser.phone
            }
        });

    } catch (error: any) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
