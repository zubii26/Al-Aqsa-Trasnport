import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { WalletTransaction, AgencyWallet, User } from '@/models';
import { requireRole } from '@/lib/server-auth';

export async function GET() {
    const admin = await requireRole(['ADMIN', 'MANAGER']);
    if (!admin) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        // Find all PENDING CREDIT transactions (Top-up requests)
        const pendingTransactions = await WalletTransaction.find({
            status: 'PENDING',
            type: 'CREDIT',
            referenceType: 'PAYMENT'
        }).sort({ createdAt: -1 });

        // Enrich with Agency details
        const enrichedTransactions = await Promise.all(pendingTransactions.map(async (tx) => {
            const wallet = await AgencyWallet.findById(tx.walletId);
            let agencyName = 'Unknown Agency';

            if (wallet) {
                const agencyUser = await User.findById(wallet.agencyId);
                if (agencyUser) {
                    agencyName = agencyUser.name || agencyUser.email;
                }
            }

            return {
                ...tx.toObject(),
                agencyName
            };
        }));

        return NextResponse.json(enrichedTransactions);

    } catch (error) {
        console.error('Error fetching wallet requests:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
