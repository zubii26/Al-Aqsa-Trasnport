import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import { AgencyWallet, User } from '@/models';
import dbConnect from '@/lib/mongodb';

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        // 1. Auth Check (Admin Only)
        const admin = await validateRequest();
        if (!admin || !['admin', 'manager'].includes(admin.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { creditLimit } = body;
        const { id } = await params;

        if (typeof creditLimit !== 'number' || creditLimit < 0) {
            return NextResponse.json({ error: 'Invalid credit limit' }, { status: 400 });
        }

        // 2. Update Wallet
        let wallet = await AgencyWallet.findOne({ agencyId: id });

        if (!wallet) {
            // Create if missing
            wallet = await AgencyWallet.create({
                agencyId: id,
                balance: 0,
                creditLimit: creditLimit,
                currency: 'SAR',
                isActive: true
            });
        } else {
            wallet.creditLimit = creditLimit;
            await wallet.save();
        }

        // 3. Update User Profile as well (for redundancy/quick access if needed, though Wallet is source of truth)
        await User.findByIdAndUpdate(id, { creditLimit: creditLimit });

        return NextResponse.json({ success: true, wallet });

    } catch (error) {
        console.error('Update Credit Limit Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
