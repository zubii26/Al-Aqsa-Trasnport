import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { AgencyWallet, WalletTransaction } from '@/models';

export async function GET() {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'agency') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        let wallet = await AgencyWallet.findOne({ agencyId: user.id });

        if (!wallet) {
            // Auto-create wallet if it doesn't exist
            wallet = await AgencyWallet.create({
                agencyId: user.id,
                balance: 0,
                creditLimit: 0, // Default limit, admin usually sets this
                currency: 'SAR',
                isActive: true
            });
        }

        const transactions = await WalletTransaction.find({ walletId: wallet._id.toString() })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json({
            balance: wallet.balance,
            creditLimit: wallet.creditLimit,
            // Available = Limit + Balance (since Balance decreases with spend)
            // Example: Limit 0, Topup 5000 -> Bal +5000 -> Avail 5000.
            // Example: Limit 1000, Spend 100 -> Bal -100 -> Avail 900.
            availableCredit: wallet.creditLimit + wallet.balance,
            currency: wallet.currency,
            transactions
        });

    } catch (error) {
        console.error('Fetch Wallet Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
