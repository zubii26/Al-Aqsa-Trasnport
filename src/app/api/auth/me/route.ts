import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    const user = await validateRequest();
    if (!user) {
        return NextResponse.json({ authenticated: false });
    }
    return NextResponse.json({
        authenticated: true,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
}
