import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { AgencyWallet, WalletTransaction } from '@/models';

export async function POST(req: Request) {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'agency') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { amount } = await req.json();
        if (!amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
        }

        await dbConnect();

        const wallet = await AgencyWallet.findOne({ agencyId: user.id });
        if (!wallet) {
            return NextResponse.json({ error: 'Wallet not found' }, { status: 404 });
        }

        // Create a PENDING Credit Transaction
        // valid 'referenceType' enum: 'BOOKING' | 'PAYMENT' | 'ADJUSTMENT' | 'REFUND'
        // valid 'status' enum: 'PENDING' | 'COMPLETED' | 'FAILED'

        await WalletTransaction.create({
            walletId: wallet._id.toString(),
            amount: amount,
            type: 'CREDIT',
            referenceType: 'PAYMENT',
            referenceId: `TOPUP-${Date.now()}`,
            description: 'Balance Top-up Request',
            status: 'PENDING',
            performedBy: user.id
        });

        return NextResponse.json({ success: true, message: 'Top-up request submitted' });

    } catch (error) {
        console.error('Top-up Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
