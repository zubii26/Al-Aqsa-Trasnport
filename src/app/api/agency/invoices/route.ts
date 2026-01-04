import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Invoice } from '@/models';

export async function GET() {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'agency') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const invoices = await Invoice.find({ agencyId: user.id })
            .sort({ createdAt: -1 })
            .limit(50);

        return NextResponse.json(invoices);
    } catch (error) {
        console.error('Fetch Invoices Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
