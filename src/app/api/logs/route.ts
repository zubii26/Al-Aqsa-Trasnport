import { NextResponse } from 'next/server';
import { getLogs } from '@/lib/logger';
import { validateRequest } from '@/lib/server-auth';

export async function GET(request: Request) {
    const isAuth = await validateRequest();
    if (!isAuth) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';

    try {
        const result = await getLogs(page, limit, search);
        return NextResponse.json(result);
    } catch {
        return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 });
    }
}
