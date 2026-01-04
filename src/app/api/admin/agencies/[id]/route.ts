import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { User, AgencyWallet, WalletTransaction } from '@/models';
import dbConnect from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const admin = await validateRequest();
        if (!admin || !['admin', 'manager'].includes(admin.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // 1. Fetch User & Wallet
        const agency = await User.findById(id).lean();
        if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

        let wallet = await AgencyWallet.findOne({ agencyId: id }).lean();

        // 2. Fetch All Transactions for Ledger
        let transactions: any[] = [];
        if (wallet && wallet._id) {
            transactions = await WalletTransaction.find({ walletId: wallet._id.toString() })
                .sort({ createdAt: 1 }) // Oldest first to calculate running balance
                .lean();
        }

        // 3. Calculate Ledger with Running Balance
        let runningBalance = 0;

        const ledger = transactions.map((tx: any) => {
            // Effect on "Outstanding Debt":
            // DEBIT (Booking): Increase Debt.
            // CREDIT (Payment): Decrease Debt.

            const debit = tx.type === 'DEBIT' ? tx.amount : 0;
            const credit = tx.type === 'CREDIT' ? tx.amount : 0;

            // Running Debt
            runningBalance += (debit - credit);

            return {
                id: tx._id,
                date: tx.createdAt,
                description: tx.description,
                reference: tx.referenceId,
                type: tx.type === 'DEBIT' ? 'BOOKING' : 'PAYMENT',
                debit,
                credit,
                balance: runningBalance // This represents "Outstanding Amount"
            };
        }).reverse(); // Show newest first

        return NextResponse.json({
            agency: {
                name: agency.name,
                email: agency.email,
                phone: agency.phone,
            },
            summary: {
                outstanding: wallet ? Math.abs(Math.min(0, wallet.balance)) : 0, // Current Debt
                creditLimit: wallet ? wallet.creditLimit : agency.creditLimit || 0
            },
            ledger
        });

    } catch (error) {
        console.error('Agency Detail API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const admin = await validateRequest();
        if (!admin || !['admin', 'manager'].includes(admin.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { amount, method, reference, notes } = body;

        const wallet = await AgencyWallet.findOne({ agencyId: id });
        if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });

        const amountNum = Number(amount);
        if (isNaN(amountNum) || amountNum <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        // Create Transaction (CREDIT - Payment)
        // Payment INCREASES the wallet balance (reducing debt)
        // e.g. Balance -100. Pay 100. Balance becomes 0.
        wallet.balance += amountNum;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id.toString(),
            amount: amountNum,
            type: 'CREDIT',
            referenceType: 'PAYMENT',
            referenceId: reference || `MANUAL-${Date.now()}`,
            description: `Payment Received via ${method}. ${notes || ''}`,
            status: 'COMPLETED',
            performedBy: admin.id
        });

        // Trigger Push Notification
        const { sendPushNotification } = await import('@/lib/notifications');
        await sendPushNotification(id, {
            title: 'Payment Received',
            body: `A payment of SAR ${amountNum} has been credited to your wallet.`,
            url: '/agency/wallet'
        });

        // Trigger Real-time Dashboard Sync
        try {
            const { pusherServer } = await import('@/lib/pusher');
            await pusherServer.trigger(`agency-channel-${id}`, 'wallet-updated', {
                agencyId: id,
                amount: amountNum,
                type: 'payment'
            });
        } catch (realtimeErr) {
            console.error('Realtime wallet update failed:', realtimeErr);
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Record Payment API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
