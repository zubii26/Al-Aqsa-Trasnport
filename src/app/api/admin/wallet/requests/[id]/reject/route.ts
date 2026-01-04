import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { WalletTransaction } from '@/models';
import { requireRole } from '@/lib/server-auth';
import { auditLogService } from '@/services/auditLogService';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const admin = await requireRole(['ADMIN', 'MANAGER']);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    try {
        await dbConnect();

        const transaction = await WalletTransaction.findById(id);
        if (!transaction) {
            return NextResponse.json({ error: 'Transaction not found' }, { status: 404 });
        }

        if (transaction.status !== 'PENDING') {
            return NextResponse.json({ error: 'Transaction is not pending' }, { status: 400 });
        }

        transaction.status = 'FAILED'; // or rejected status if enum allows, relying on FAILED for now
        transaction.performedBy = admin.id as string;
        transaction.description = (transaction.description || '') + ' (Rejected by Admin)';
        await transaction.save();

        // 2. Log Audit
        await auditLogService.log({
            action: 'REJECT_TOPUP',
            entity: 'WalletTransaction',
            entityId: id,
            details: `Rejected top-up request ${id}`,
            user: admin.name || 'Admin'
        });

        return NextResponse.json({ success: true, message: 'Top-up rejected' });

    } catch (error) {
        console.error('Error rejecting top-up:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
