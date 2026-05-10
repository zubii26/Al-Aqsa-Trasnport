import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User } from '@/models';
import { cookies } from 'next/headers';
import { rateLimit, authLimiter } from '@/lib/rate-limit';
import { logAction } from '@/lib/logger';

export async function POST(request: Request) {
    // ─── Rate Limiting ──────────────────────────────────────────────────────
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const limiter = rateLimit(ip, authLimiter); // 5 attempts / 15 min per IP

    if (!limiter.success) {
        return NextResponse.json(
            { success: false, error: 'Too many login attempts. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': String(limiter.retryAfter) },
            }
        );
    }

    try {
        const body: { username?: string; password?: string } = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { success: false, error: 'Missing credentials.' },
                { status: 400 }
            );
        }

        // Basic length guards to prevent oversized payloads
        if (username.length > 254 || password.length > 128) {
            return NextResponse.json(
                { success: false, error: 'Invalid credentials.' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({
            $or: [{ email: username }, { phone: username }],
        }).lean();

        let isValid = false;

        if (user && user.password) {
            if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
                // ✅ bcrypt hash — verify securely
                const { verifyPassword } = await import('@/lib/password-utils');
                isValid = await verifyPassword(password, user.password);
            } else {
                // ⚠️  Plaintext fallback — kept for migration compatibility.
                // TODO: Once all users are migrated, remove this branch and
                //       enforce bcrypt-only by running the /api/auth/migrate-passwords route.
                isValid = user.password === password;
            }
        }

        if (!user || !isValid) {
            // Log failed attempt to audit trail (server-side only)
            await logAction(
                'LOGIN_FAILED',
                `Failed login attempt for "${username}"`,
                ip,
                'system'
            ).catch(() => {}); // Non-blocking — don't fail the request if logging fails

            console.warn(`[auth/login] Failed attempt for ${username} from ${ip}`);

            return NextResponse.json(
                { success: false, error: 'Invalid credentials.' },
                { status: 401 }
            );
        }

        // ─── Role check ─────────────────────────────────────────────────────
        const allowedRoles = ['admin', 'manager', 'operational_manager', 'user'];
        if (!allowedRoles.includes(user.role)) {
            console.warn(`[auth/login] Unauthorized role "${user.role}" for ${username} from ${ip}`);
            return NextResponse.json(
                { success: false, error: 'Unauthorized access.' },
                { status: 403 }
            );
        }

        // ─── Issue JWT ───────────────────────────────────────────────────────
        const { signToken } = await import('@/lib/auth-utils');
        const token = await signToken({
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        });

        // ─── Set secure httpOnly cookie ──────────────────────────────────────
        const cookieStore = await cookies();
        cookieStore.set('admin_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 24 hours — matches JWT expiry
            path: '/',
        });

        // Remove legacy insecure cookie if it exists
        cookieStore.delete('admin_user_id');
        cookieStore.delete('admin_session');

        // Log successful login
        await logAction(
            'LOGIN_SUCCESS',
            `User "${user.email}" logged in`,
            ip,
            user.email
        ).catch(() => {});

        // Return user info — never include the password field
        const { password: _pwd, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            user: { ...userWithoutPassword, id: user._id.toString() },
        });
    } catch (error) {
        console.error('[auth/login] Unexpected error:', error);
        return NextResponse.json(
            { success: false, error: 'Internal server error.' },
            { status: 500 }
        );
    }
}
