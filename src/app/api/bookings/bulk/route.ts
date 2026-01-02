import { NextResponse } from 'next/server';
import { addBooking } from '@/lib/db';
import { validateRequest } from '@/lib/server-auth';
import { calculateFinalPrice } from '@/lib/pricing';
import { getSettings } from '@/lib/settings-storage';
import { routeService, RouteWithPrices } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';

export async function POST(request: Request) {
    try {
        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { bookings } = body;

        if (!Array.isArray(bookings) || bookings.length === 0) {
            return NextResponse.json({ error: 'Invalid bookings array' }, { status: 400 });
        }

        const results = [];
        const errors = [];

        // Pre-fetch settings and data to avoid repetitive DB calls
        const [settings, routes, vehicles] = await Promise.all([
            getSettings(),
            routeService.getRoutes(),
            vehicleService.getVehicles()
        ]);

        for (const bookingData of bookings) {
            try {
                // Determine price if not manually set (similar to single booking logic)
                // Note: In bulk, we might trust the client or re-calc. Better to re-calc.
                let priceDetails = {};
                let vehicleString = bookingData.vehicle || 'Standard Vehicle';

                if (bookingData.routeId && bookingData.vehicleId) {
                    const route = (routes as RouteWithPrices[]).find(r => r.id === bookingData.routeId);
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vehicle = (vehicles as any[]).find(v => v.id === bookingData.vehicleId);

                    if (route && vehicle) {
                        const quantity = bookingData.quantity || 1;
                        const priceEntry = route.prices?.find(p => p.vehicleId === bookingData.vehicleId);

                        if (priceEntry) {
                            const basePrice = priceEntry.price * quantity;
                            const { price, originalPrice, discountApplied, discountType } = calculateFinalPrice(basePrice, settings.discount);

                            priceDetails = {
                                originalPrice,
                                discountApplied,
                                finalPrice: price,
                                discountType,
                                price: String(price)
                            };
                        }
                        vehicleString = `${quantity} x ${vehicle.name}`;
                    }
                }

                const newBooking = await addBooking({
                    name: user.name || bookingData.name || 'Agency Agent',
                    email: user.email,
                    phone: user.phone || bookingData.phone || '',
                    pickup: bookingData.pickup,
                    dropoff: bookingData.dropoff,
                    date: bookingData.date,
                    time: bookingData.time,
                    vehicle: vehicleString,
                    passengers: bookingData.passengers || 1,
                    vehicleCount: bookingData.quantity || 1,
                    luggage: bookingData.luggage || 0,
                    notes: bookingData.notes,
                    status: 'pending', // Default to pending for admin appoval
                    userId: user.userId,
                    ...priceDetails,
                    isAgency: true // Flag or relies on userId role check
                });

                results.push(newBooking);
            } catch (err) {
                console.error('Failed to create bulk booking item', err);
                errors.push({ booking: bookingData, error: 'Failed to create' });
            }
        }

        // --- Notifications & Credit Check ---

        // 1. Calculate new financials
        if (user.role === 'agency') {
            const { User, Booking } = await import('@/models'); // Dynamic import to avoid circular dep issues in some setups
            const agencyUser = await User.findById(user.userId);

            if (agencyUser) {
                const agencyBookings = await Booking.find({ userId: user.userId });
                const outstanding = agencyBookings
                    .filter(b => b.paymentStatus !== 'paid' && b.status !== 'cancelled')
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    .reduce((sum, b) => sum + (b.totalPrice || parseFloat(b.price || '0') || 0), 0);

                // Check threshold (90%)
                if (agencyUser.creditLimit > 0 && (outstanding / agencyUser.creditLimit) >= 0.9) {
                    const { sendLowCreditEmail } = await import('@/lib/email');
                    await sendLowCreditEmail({
                        email: agencyUser.email,
                        agencyName: agencyUser.name,
                        creditLimit: agencyUser.creditLimit,
                        outstanding: outstanding
                    });
                    console.log('Low credit alert sent to', agencyUser.email);
                }
            }
        }

        // 2. Notify Admin about the Batch
        // For bulk, sending individual emails might be too much. We'll implement a batch notification later.
        // For now, we rely on the dashboard.

        return NextResponse.json({
            success: true,
            count: results.length,
            totalRequested: bookings.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Bulk booking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
