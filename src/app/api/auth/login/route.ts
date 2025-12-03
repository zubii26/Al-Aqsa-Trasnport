import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const body: { username?: string; password?: string } = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
        }

        await dbConnect();

        // Find user by email (username field maps to email)
        const user = await User.findOne({ email: username }).lean();

        // Simple password check (In production, use bcrypt)
        // Since we are migrating, we are using plain text passwords for now as per user request/legacy state.
        // Verify password
        // Check if password matches directly (legacy plain text) OR verify hash
        // This allows seamless transition: if verifyPassword fails, check plain text.
        // Ideally we should migrate all, but for login we can support both temporarily.

        // However, standard bcrypt.compare will fail if the hash is not a valid bcrypt hash.
        // So we need to check if the stored password looks like a hash.

        let isValid = false;

        if (user && user.password) {
            // Check if it's a bcrypt hash (starts with $2a$ or $2b$)
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                const { verifyPassword } = await import('@/lib/password-utils');
                isValid = await verifyPassword(password, user.password);
            } else {
                // Fallback to plain text check
                isValid = user.password === password;
            }
        }

        if (!user || !isValid) {
            return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 });
        }

        // Generate JWT
        const { signToken } = await import('@/lib/auth-utils');
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7 // 1 week
        });

        // Remove old insecure cookie if it exists
        cookieStore.delete('admin_user_id');

        // Return user info (excluding password)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ success: true, user: { ...userWithoutPassword, id: user._id.toString() } });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
