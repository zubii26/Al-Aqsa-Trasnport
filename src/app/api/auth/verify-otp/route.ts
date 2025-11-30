import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { otpStore } from '@/lib/otp';

export async function POST(request: Request) {
    const body = await request.json();
    const { username, otp } = body;

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
}
