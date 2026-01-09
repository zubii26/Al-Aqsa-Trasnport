
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    return NextResponse.json(
        { success: false, error: 'Registration is disabled.' },
        { status: 403 }
    );
}
