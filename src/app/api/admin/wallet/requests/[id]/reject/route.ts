import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { WalletTransaction, AgencyWallet } from '@/models';
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

        const wallet = await AgencyWallet.findById(transaction.walletId);
        const agencyId = wallet?.agencyId;

        // Trigger Real-time Dashboard Sync
        try {
            const { pusherServer } = await import('@/lib/pusher');
            if (agencyId) {
                await pusherServer.trigger(`agency-channel-${agencyId}`, 'wallet-updated', {
                    agencyId,
                    transactionId: id,
                    type: 'top-up-rejected'
                });
            }
            // Also notify Admin list
            await pusherServer.trigger('admin-channel', 'wallet-updated', {
                agencyId,
                type: 'request-rejected'
            });
        } catch (realtimeErr) {
            console.error('Realtime wallet update failed:', realtimeErr);
        }

        return NextResponse.json({ success: true, message: 'Top-up rejected' });

    } catch (error) {
        console.error('Error rejecting top-up:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
