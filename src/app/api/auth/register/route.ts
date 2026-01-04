
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

export async function POST(request: Request) {
    try {
        const { name, email, password, phone, role } = await request.json();

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'User already exists' },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await hashPassword(password);

        // Disable generic user/customer registration
        if (role !== 'agency') {
            return NextResponse.json(
                { success: false, error: 'Public registration is disabled. Only agency applications are accepted.' },
                { status: 403 }
            );
        }

        const safeRole = 'agency';

        // Create new user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            phone,
            role: safeRole,
            isOnline: false,
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
