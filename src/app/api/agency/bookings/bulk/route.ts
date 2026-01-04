import { NextResponse } from 'next/server';
import { validateRequest } from '@/lib/server-auth';
import dbConnect from '@/lib/mongodb';
import { Booking, User, AgencyWallet, WalletTransaction, RoutePrice } from '@/models';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
    try {
        const user = await validateRequest();
        if (!user || user.role !== 'agency') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { routeId, date, time, vehicles, passengers, notes } = body;
        // vehicles: [{ type: 'GMC Yukon', count: 2 }, { type: 'Toyota Hiace', count: 1 }]

        if (!routeId || !vehicles || vehicles.length === 0) {
            return NextResponse.json({ error: 'Missing required booking details' }, { status: 400 });
        }

        await dbConnect();

        // 1. Calculate Total Cost
        let totalCost = 0;
        const vehicleDetails = [];

        for (const item of vehicles) {
            const priceDoc = await RoutePrice.findOne({ route: routeId, vehicle: item.type });
            // Fallback price if not found (simulated for now, real app should block)
            const price = priceDoc ? priceDoc.price : 0;

            if (price === 0) {
                return NextResponse.json({ error: `Price not found for vehicle ${item.type} on this route` }, { status: 400 });
            }

            totalCost += (price * item.count);
            vehicleDetails.push({ ...item, price });
        }

        // 2. Check Wallet / Credit Limit
        let wallet = await AgencyWallet.findOne({ agencyId: user.id });
        if (!wallet) {
            // Create if missing
            wallet = await AgencyWallet.create({ agencyId: user.id, creditLimit: 0, balance: 0 });
        }

        const newBalance = wallet.balance + totalCost;
        if (newBalance > wallet.creditLimit) {
            return NextResponse.json({
                error: 'Credit Limit Exceeded',
                details: {
                    currentBalance: wallet.balance,
                    attemptedAmount: totalCost,
                    limit: wallet.creditLimit,
                    shortfall: newBalance - wallet.creditLimit
                }
            }, { status: 402 });
        }

        // 3. Create Bookings
        const groupId = uuidv4();
        const bookingsPromises = [];

        // Flatten vehicles to individual bookings? Or one bulk booking record?
        // Prompt asked for "Bulk Booking Management". 
        // Best approach: Individual Booking Records sharing a GroupID.

        for (const item of vehicles) {
            for (let i = 0; i < item.count; i++) {
                bookingsPromises.push(Booking.create({
                    userId: user.id,
                    name: user.name, // Agency Name
                    email: user.email,
                    phone: user.phone || '',
                    pickup: 'TBD', // Should be derived from Route
                    dropoff: 'TBD',
                    routeId,
                    date,
                    time,
                    vehicle: item.type,
                    passengers: Math.ceil(passengers / vehicles.reduce((a: number, b: any) => a + b.count, 0)), // Rough split
                    status: 'pending', // Or 'confirmed' if auto-approve
                    paymentStatus: 'unpaid',
                    paymentMethod: 'agency_account',
                    price: item.price,
                    finalPrice: item.price,
                    groupId,
                    isBulk: true,
                    notes: `Bulk Booking [${i + 1}/${item.count}] - ${notes || ''}`
                }));
            }
        }

        const createdBookings = await Promise.all(bookingsPromises);

        // 4. Update Wallet & Log Transaction
        wallet.balance += totalCost;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id.toString(),
            amount: totalCost,
            type: 'DEBIT',
            referenceType: 'BOOKING',
            referenceId: groupId,
            description: `Bulk Booking (${createdBookings.length} vehicles)`,
            performedBy: user.id
        });

        // Notify Agency via Push
        try {
            const { sendPushNotification } = await import('@/lib/notifications');
            await sendPushNotification(user.id as string, {
                title: 'Bulk Booking Successful',
                body: `${createdBookings.length} vehicles booked. Total: SAR ${totalCost.toLocaleString()}`,
                url: `/agency/bookings?groupId=${groupId}`
            });
        } catch (pushErr) {
            console.error('Push Notification Failed:', pushErr);
        }

        return NextResponse.json({
            success: true,
            groupId,
            bookingCount: createdBookings.length,
            totalCost,
            newBalance: wallet.balance
        });

    } catch (error: any) {
        console.error('Bulk Booking Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
