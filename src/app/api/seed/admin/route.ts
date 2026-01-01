import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

export async function GET() {
    try {
        await dbConnect();

        const email = 'admin@alaqsa.com';
        const rawPassword = 'admin123'; // Initial password
        const hashedPassword = await hashPassword(rawPassword);

        // Check if admin exists
        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            // Update password if exists (for reset purposes)
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin'; // Ensure role is admin
            await existingAdmin.save();
            return NextResponse.json({ success: true, message: 'Admin user updated', email });
        }

        // Create new admin
        await User.create({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({ success: true, message: 'Admin user created', email });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ success: false, error: 'Failed to seed admin' }, { status: 500 });
    }
}
