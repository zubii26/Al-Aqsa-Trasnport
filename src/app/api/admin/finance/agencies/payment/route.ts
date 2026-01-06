import { NextResponse } from 'next/server';
import { AgencyWallet, WalletTransaction, Payment } from '@/models';
import dbConnect from '@/lib/mongodb';
import { validateRequest } from '@/lib/server-auth';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { agencyId, amount, method, reference, notes } = body;

        if (!agencyId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid payment data' }, { status: 400 });
        }

        await dbConnect();

        // 1. Get Wallet
        let wallet = await AgencyWallet.findOne({ agencyId });
        if (!wallet) {
            // Auto-create if missing (failsafe)
            wallet = await AgencyWallet.create({
                agencyId,
                balance: 0,
                creditLimit: 0,
                currency: 'SAR'
            });
        }

        // 2. Create Payment Record (Audit)
        const payment = await Payment.create({
            userId: agencyId,
            amount,
            method,
            reference,
            notes,
            status: 'completed',
            recordedBy: user.id,
            currency: 'SAR'
        });

        // 3. Update Wallet Balance
        // Credit means adding to the balance.
        // If balance was -500 (Debt) and we add 500, it becomes 0.
        // If balance was 0 and we add 500, it becomes 500 (Prepaid).
        wallet.balance += Number(amount);
        await wallet.save();

        // 4. Create Wallet Transaction
        await WalletTransaction.create({
            walletId: wallet._id.toString(),
            amount,
            type: 'CREDIT',
            referenceType: 'PAYMENT',
            referenceId: payment._id.toString(),
            description: `Manual Payment: ${method}`,
            status: 'COMPLETED',
            performedBy: user.id
        });

        return NextResponse.json({ success: true, newBalance: wallet.balance });

    } catch (error) {
        console.error('Error recording payment:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
