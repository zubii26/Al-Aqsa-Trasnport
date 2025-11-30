import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateRequest } from '@/lib/server-auth';
import { revalidatePath } from 'next/cache';

export async function GET() {
    try {
        const settings = await prisma.settings.findMany();
        const formattedSettings = settings.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json(formattedSettings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    if (!await validateRequest()) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const body = await request.json();

        // Use a transaction to ensure all updates succeed or fail together
        const updates = Object.entries(body).map(([key, value]) => {
            return prisma.settings.upsert({
                where: { key },
                update: { value: String(value) },
                create: { key, value: String(value) },
            });
        });

        await prisma.$transaction(updates);

        // Invalidate cache
        revalidatePath('/admin/settings');

        // Audit Log - wrapped in try/catch so it doesn't fail the request if logging fails
        try {
            await prisma.auditLog.create({
                data: {
                    action: 'UPDATE',
                    entity: 'Settings',
                    details: 'Updated general settings',
                    user: 'Admin',
                }
            });
        } catch (logError) {
            console.error('Failed to create audit log:', logError);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Error saving settings:', error);
        return NextResponse.json({ error: 'Failed to update settings', details: String(error) }, { status: 500 });
    }
}
