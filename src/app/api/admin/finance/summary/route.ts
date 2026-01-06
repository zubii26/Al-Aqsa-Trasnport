import { NextResponse } from 'next/server';
import { AgencyWallet } from '@/models';
import dbConnect from '@/lib/mongodb';
import { validateRequest } from '@/lib/server-auth';

export async function GET() {
    try {
        // Auth check
        const user = await validateRequest();
        if (!user || !['admin', 'manager'].includes(user.role)) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch all wallets
        const wallets = await AgencyWallet.find({});

        let totalOutstanding = 0;
        let totalCreditLimit = 0;
        let overdueCount = 0;
        let warningCount = 0;
        let totalAvailable = 0;

        for (const wallet of wallets) {
            // Logic: 
            // Balance < 0 means they OWE us (Outstanding)
            // Balance > 0 means they PREPAID (Surplus)

            // NOTE: The request asked to simplify "Dues". 
            // If Balance is negative, that is the "Due" amount.
            if (wallet.balance < 0) {
                totalOutstanding += Math.abs(wallet.balance);
            } else {
                totalAvailable += wallet.balance;
            }

            totalCreditLimit += wallet.creditLimit;

            // Overdue/Warning Logic
            // If they have used > 90% of their limit (Balance + Limit < 10% of Limit)
            // Example: Limit 1000. Balance -950. Available 50. 
            // Threshold: 1000 * 0.1 = 100. 50 < 100 -> Warning.
            const availableCredit = wallet.balance + wallet.creditLimit;
            const warningThreshold = wallet.creditLimit * 0.1; // 10% remaining

            if (availableCredit < 0) {
                // Technically "Over Limit" - immediate action needed
                overdueCount++;
            } else if (availableCredit < warningThreshold) {
                warningCount++;
            }
        }

        return NextResponse.json({
            metrics: {
                totalOutstanding,
                totalCreditLimit,
                totalAvailable, // Prepaid funds
                overdueCount,
                warningCount,
                totalAgencies: wallets.length
            }
        });

    } catch (error) {
        console.error('Error fetching finance summary:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
