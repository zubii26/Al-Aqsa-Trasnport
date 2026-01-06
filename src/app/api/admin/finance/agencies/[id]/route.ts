import { NextResponse } from 'next/server';
import { AgencyWallet, WalletTransaction, User, Invoice } from '@/models';
import dbConnect from '@/lib/mongodb';
import { validateRequest } from '@/lib/server-auth';

// GET /api/admin/finance/agencies/[id]
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> } // Correct Next.js 15+ param typing
) {
    try {
        const { id } = await params;

        // 1. Auth & Validation
        const user = await validateRequest();
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // 2. Fetch Agency User
        const agency = await User.findById(id).select('name email phone branding location contactPerson');
        if (!agency) {
            return NextResponse.json({ error: 'Agency not found' }, { status: 404 });
        }

        // 3. Fetch Wallet
        let wallet = await AgencyWallet.findOne({ agencyId: id });

        // Create wallet if missing (auto-heal)
        if (!wallet) {
            wallet = await AgencyWallet.create({
                agencyId: id,
                balance: 0,
                creditLimit: 0,
                currency: 'SAR'
            });
        }

        // 4. Fetch Recent Transactions (Last 50)
        const transactions = await WalletTransaction.find({ walletId: wallet._id.toString() })
            .sort({ createdAt: -1 })
            .limit(50);

        // 5. Fetch Invoices (Last 12)
        const invoices = await Invoice.find({ agencyId: id })
            .sort({ periodEnd: -1 })
            .limit(12);

        // 6. Calculate Status
        const now = new Date();
        const hasOverdueInvoices = await Invoice.exists({
            agencyId: id,
            status: { $in: ['ISSUED', 'PARTIAL', 'OVERDUE'] },
            dueDate: { $lt: now }
        });

        const availableCredit = wallet.balance + wallet.creditLimit;
        let status = 'good';

        if (hasOverdueInvoices) status = 'overdue';
        else if (availableCredit < 0) status = 'overdue';
        else if (availableCredit < (wallet.creditLimit * 0.1)) status = 'warning';

        return NextResponse.json({
            agency,
            wallet: {
                balance: wallet.balance,
                creditLimit: wallet.creditLimit,
                availableCredit,
                currency: wallet.currency
            },
            status,
            transactions,
            invoices
        });

    } catch (error) {
        console.error('Error fetching agency details:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
