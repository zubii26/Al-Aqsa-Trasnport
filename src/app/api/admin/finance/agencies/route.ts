import { NextResponse } from 'next/server';
import { AgencyWallet, User, Invoice } from '@/models';
import dbConnect from '@/lib/mongodb';
import { validateRequest } from '@/lib/server-auth';

export async function GET(request: Request) {
    try {
        const user = await validateRequest();
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter') || 'all'; // all, overdue, warning

        // 1. Get all agencies (Users with role 'agency')
        const agencies = await User.find({ role: 'agency' }).select('name email phone branding location contactPerson');

        // 2. Get all wallets
        const wallets = await AgencyWallet.find({});
        const walletMap = new Map(wallets.map(w => [w.agencyId, w]));

        // 2a. Get all overdue invoices
        const now = new Date();
        const overdueInvoices = await Invoice.find({
            status: { $in: ['ISSUED', 'PARTIAL', 'OVERDUE'] }, // DRAFT is internal, PAID is good
            dueDate: { $lt: now }
        }).select('agencyId');

        const overdueAgencyIds = new Set(overdueInvoices.map(inv => inv.agencyId));

        // 3. Merge Data
        let agencyData = agencies.map(agency => {
            const wallet = walletMap.get(agency._id.toString());
            const balance = wallet?.balance || 0;
            const creditLimit = wallet?.creditLimit || 0;
            const availableCredit = balance + creditLimit;
            const agencyIdStr = agency._id.toString();

            let status = 'good';

            // Logic: 
            // 1. Overdue if they have unpaid invoices past due date
            if (overdueAgencyIds.has(agencyIdStr)) {
                status = 'overdue';
            }
            // 2. Overdue if they exceeded credit limit
            else if (availableCredit < 0) {
                status = 'overdue';
            }
            // 3. Warning if low credit
            else if (availableCredit < (creditLimit * 0.1)) {
                status = 'warning';
            }

            return {
                id: agency._id,
                name: agency.name || 'Unknown Agency',
                email: agency.email,
                phone: agency.phone,
                balance,
                creditLimit,
                availableCredit,
                status,
                lastPaymentDate: wallet?.updatedAt || null,
            };
        });

        // 4. Client-side filter (since it's computed)
        if (filter === 'overdue') {
            agencyData = agencyData.filter(a => a.status === 'overdue');
        } else if (filter === 'warning') {
            agencyData = agencyData.filter(a => a.status === 'warning' || a.status === 'overdue');
        }

        return NextResponse.json({ agencies: agencyData });

    } catch (error) {
        console.error('Error fetching agency finance list:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
