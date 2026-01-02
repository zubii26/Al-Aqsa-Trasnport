import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { User, Booking, Payment } from '@/models';
import { requireRole } from '@/lib/server-auth';

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        await dbConnect();
        const agencyId = params.id;

        // 1. Fetch Agency Details
        const agency = await User.findById(agencyId).lean();
        if (!agency) return NextResponse.json({ error: 'Agency not found' }, { status: 404 });

        // 2. Fetch Bookings (Debits) - Only confirmed/completed ones should usually charge, but for now lets take all non-cancelled
        const bookings = await Booking.find({
            userId: agencyId,
            status: { $ne: 'cancelled' }
        }).lean();

        // 3. Fetch Payments (Credits)
        const payments = await Payment.find({ userId: agencyId }).lean();

        // 4. Merge & Sort
        const ledger = [
            ...bookings.map(b => ({
                id: b._id.toString(),
                type: 'INVOICE',
                date: b.createdAt,
                description: `Invoice #${b._id.toString().slice(-6).toUpperCase()} - ${b.pickup} -> ${b.dropoff}`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                amount: (b as any).totalPrice || parseFloat(b.price || '0') || 0, // Debit
                reference: b._id.toString(),
                status: b.paymentStatus
            })),
            ...payments.map(p => ({
                id: p._id.toString(),
                type: 'PAYMENT',
                date: p.createdAt,
                description: `Payment via ${p.method} - ${p.reference || ''}`,
                amount: -(p.amount), // Credit (Negative for calculation, but visual will handle it)
                reference: p.reference,
                status: p.status
            }))
        ].sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

        // 5. Calculate Running Balance
        let currentBalance = 0;
        const ledgerWithBalance = ledger.map(item => {
            currentBalance += item.amount;
            return {
                ...item,
                balance: currentBalance,
                debit: item.type === 'INVOICE' ? item.amount : 0,
                credit: item.type === 'PAYMENT' ? Math.abs(item.amount) : 0
            };
        });

        // 6. Summary Stats
        const summary = {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            totalInvoiced: bookings.reduce((sum, b) => sum + ((b as any).totalPrice || parseFloat(b.price || '0') || 0), 0),
            totalPaid: payments.reduce((sum, p) => sum + (p.status === 'completed' ? p.amount : 0), 0),
            outstanding: currentBalance,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            creditLimit: (agency as any).creditLimit || 0
        };

        return NextResponse.json({
            agency: {
                id: agency._id,
                name: agency.name,
                email: agency.email,
                phone: agency.phone,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                creditLimit: (agency as any).creditLimit
            },
            ledger: ledgerWithBalance.reverse(), // Show newest first
            summary
        });

    } catch (error) {
        console.error('Ledger error:', error);
        return NextResponse.json({ error: 'Failed to fetch ledger' }, { status: 500 });
    }
}

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
    const params = await context.params;
    // Record Payment
    const user = await requireRole(['ADMIN', 'MANAGER']);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

    try {
        await dbConnect();
        const body = await request.json();

        const payment = await Payment.create({
            userId: params.id,
            amount: Number(body.amount),
            method: body.method,
            reference: body.reference,
            notes: body.notes,
            recordedBy: (user as any).id,
            status: 'completed'
        });

        return NextResponse.json(payment);

    } catch (error) {
        return NextResponse.json({ error: 'Failed to record payment' }, { status: 500 });
    }
}
