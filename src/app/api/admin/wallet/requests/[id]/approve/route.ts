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

        const wallet = await AgencyWallet.findById(transaction.walletId);
        if (!wallet) {
            return NextResponse.json({ error: 'Associated wallet not found' }, { status: 404 });
        }

        // 1. Update Transaction Status
        transaction.status = 'COMPLETED';
        // @ts-ignore
        transaction.performedBy = admin.id || admin._id.toString(); // Mark who approved it
        await transaction.save();

        // 2. Update Wallet Balance
        // Logic: 'balance' in this system represents DEBT/USAGE.
        // Booking ADDS to balance (increases debt).
        // Top-up (Payment) SUBTRACTS from balance (reduces debt).
        wallet.balance -= transaction.amount;
        await wallet.save();

        // 3. Log Audit
        await auditLogService.log({
            action: 'APPROVE_TOPUP',
            entity: 'AgencyWallet',
            entityId: wallet._id.toString(),
            details: `Approved top-up of ${transaction.amount} SAR for Transaction ${id}`,
            user: admin.name || 'Admin'
        });

        return NextResponse.json({ success: true, message: 'Top-up approved successfully' });

    } catch (error) {
        console.error('Error approving top-up:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
