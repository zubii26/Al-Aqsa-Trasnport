import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/logger';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const logs = await getLogs();
        return NextResponse.json(logs);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
