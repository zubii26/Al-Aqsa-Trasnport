import { NextResponse } from 'next/server';
import { getSettings, saveSettings } from '@/lib/settings-storage';
import { requireRole } from '@/lib/server-auth';
import { SettingsSchema } from '@/lib/validations';
import { logAction } from '@/lib/logger';

export async function GET() {
    try {
        const settings = await getSettings();
        return NextResponse.json(settings);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const validation = SettingsSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Invalid settings data', errors: validation.error.format() },
                { status: 400 }
            );
        }

        await saveSettings(validation.data);
        await logAction('UPDATE_SETTINGS', 'Site settings updated', request.headers.get('x-forwarded-for') || 'unknown');

        return NextResponse.json({ success: true, settings: validation.data });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }
}
