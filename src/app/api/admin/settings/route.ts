import { NextResponse } from 'next/server';
import { settingsService } from '@/services/settingsService';
import { auditLogService } from '@/services/auditLogService';
import { requireRole } from '@/lib/server-auth';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET() {
    if (!await requireRole(['ADMIN', 'MANAGER'])) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    try {
        const settings = await settingsService.getSettings();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    const user = await requireRole(['ADMIN']);
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    try {
        const body = await request.json();
        const updates: Record<string, string> = {};
        let auditAction = 'UPDATE';
        let auditDetails = 'Updated general settings';

        // Handle Discount Object Flattening
        if (body.discount) {
            updates['discount_enabled'] = String(body.discount.enabled);
            updates['discount_type'] = body.discount.type;
            updates['discount_value'] = String(body.discount.value);
            updates['discount_start_date'] = body.discount.startDate || '';
            updates['discount_end_date'] = body.discount.endDate || '';

            delete body.discount;
            auditAction = 'UPDATE_DISCOUNT';
            auditDetails = `Updated discount settings: ${updates['discount_enabled'] === 'true' ? 'Enabled' : 'Disabled'} (${updates['discount_value']}${updates['discount_type'] === 'percentage' ? '%' : ' SAR'})`;
        }

        // Handle Email Templates Object Flattening
        if (body.emailTemplates) {
            updates['email_template_booking_confirmation'] = body.emailTemplates.bookingConfirmation;
            updates['email_template_admin_notification'] = body.emailTemplates.adminNotification;

            delete body.emailTemplates;
            auditAction = 'UPDATE_EMAILS';
            auditDetails = 'Updated email templates';
        }

        // Merge remaining body items
        Object.entries(body).forEach(([key, value]) => {
            updates[key] = String(value);
        });

        // Update settings
        const updatePromises = Object.entries(updates).map(([key, value]) => {
            return settingsService.updateSetting(key, value);
        });

        await Promise.all(updatePromises);

        // Invalidate cache
        revalidatePath('/admin/settings');
        revalidatePath('/', 'layout'); // Clears everything using layout (header/footer)
        // revalidateTag('settings');

        // Audit Log
        try {
            await auditLogService.log({
                action: auditAction,
                entity: 'Settings',
                details: auditDetails,
                user: 'Admin', // Should get actual user name if possible
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
