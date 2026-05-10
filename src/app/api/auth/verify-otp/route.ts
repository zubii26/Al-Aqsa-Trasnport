import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { otpStore } from '@/lib/otp';
import { rateLimit, authLimiter } from '@/lib/rate-limit';
import { z } from 'zod';

const VerifyOtpSchema = z.object({
    username: z.string().min(1).max(254).trim(),
    otp: z.string().length(6).trim(), // Assuming 6-digit OTP
});

export async function POST(request: Request) {
    // ─── Rate Limiting ──────────────────────────────────────────────────────
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const limiter = rateLimit(ip, authLimiter);

    if (!limiter.success) {
        return NextResponse.json(
            { success: false, message: 'Too many verification attempts. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': String(limiter.retryAfter) },
            }
        );
    }

    try {
        const body = await request.json();
        
        const validation = VerifyOtpSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json({ success: false, message: 'Invalid input format' }, { status: 400 });
        }

        const { username, otp } = validation.data;

        const storedOtp = otpStore[username];

        if (!storedOtp) {
            return NextResponse.json({ success: false, message: 'OTP expired or invalid' }, { status: 400 });
        }

        if (Date.now() > storedOtp.expires) {
            delete otpStore[username];
            return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
        }

        if (storedOtp.code !== otp) {
            return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
        }

        // OTP is valid, clear it and set session
        delete otpStore[username];

        (await cookies()).set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24, // 1 day
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('[api/auth/verify-otp] error:', error);
        return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
    }
}
