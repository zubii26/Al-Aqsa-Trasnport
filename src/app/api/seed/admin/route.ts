import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { hashPassword } from '@/lib/password-utils';

/**
 * Admin seeding endpoint — locked behind ADMIN_SEED_SECRET.
 * Only usable once during initial setup. Remove or restrict after first deploy.
 *
 * Usage: GET /api/seed/admin?secret=YOUR_ADMIN_SEED_SECRET
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    const seedSecret = process.env.ADMIN_SEED_SECRET;

    if (!seedSecret) {
        return NextResponse.json(
            { error: 'Seed endpoint is disabled. Set ADMIN_SEED_SECRET in environment variables to enable.' },
            { status: 403 }
        );
    }

    if (!secret || secret !== seedSecret) {
        return NextResponse.json(
            { error: 'Invalid secret key.' },
            { status: 403 }
        );
    }

    try {
        await dbConnect();

        const email = process.env.ADMIN_SEED_EMAIL || 'admin@alaqsaumrahtransport.com';
        const rawPassword = process.env.ADMIN_SEED_PASSWORD;

        if (!rawPassword) {
            return NextResponse.json(
                { error: 'ADMIN_SEED_PASSWORD is not set. Cannot seed without a password.' },
                { status: 500 }
            );
        }

        const hashedPassword = await hashPassword(rawPassword);

        const existingAdmin = await User.findOne({ email });

        if (existingAdmin) {
            existingAdmin.password = hashedPassword;
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            return NextResponse.json({
                success: true,
                message: 'Admin user updated successfully.',
                email,
                // Never return the password — check your email/env for the value you set
            });
        }

        await User.create({
            name: 'Super Admin',
            email,
            password: hashedPassword,
            role: 'admin',
        });

        return NextResponse.json({
            success: true,
            message: 'Admin user created successfully.',
            email,
        });
    } catch (error) {
        console.error('[seed/admin] Error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed admin user.' },
            { status: 500 }
        );
    }
}
