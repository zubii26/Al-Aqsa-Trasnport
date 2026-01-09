import { NextResponse } from 'next/server';
import { requireRole } from '@/lib/server-auth';
import { getDashboardStats } from '@/lib/db';

export async function GET() {
    try {
        const user = await requireRole(['admin', 'manager', 'operational_manager']);
        if (!user) {
            return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
        }

        const stats = await getDashboardStats();
        return NextResponse.json({ success: true, stats });
    } catch (error) {
        console.error('[API/Admin/Stats] Error:', error);
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
    }
}
