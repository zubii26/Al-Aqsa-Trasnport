import { NextResponse } from 'next/server';
import { addBooking } from '@/lib/db';
import { validateRequest } from '@/lib/server-auth';
import { calculateFinalPrice } from '@/lib/pricing';
import { getSettings } from '@/lib/settings-storage';
import { routeService, RouteWithPrices } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';

import dbConnect from '@/lib/mongodb';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const user = await validateRequest();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { bookings } = body;

        if (!Array.isArray(bookings) || bookings.length === 0) {
            return NextResponse.json({ error: 'Invalid bookings array' }, { status: 400 });
        }

        // 1. Calculate Total Cost & Validate Wallet
        let totalBatchCost = 0;
        const bookingsToProcess: any[] = [];
        const errors: any[] = [];

        // Pre-fetch settings and data
        const [settings, routes, vehicles] = await Promise.all([
            getSettings(),
            routeService.getRoutes(),
            vehicleService.getVehicles()
        ]);

        // First Pass: Calculate Prices and Validate
        for (const bookingData of bookings) {
            let priceDetails: any = {
                price: '0',
                finalPrice: 0,
                originalPrice: 0,
                discountApplied: 0,
                discountType: undefined
            };
            let vehicleString = bookingData.vehicle || 'Standard Vehicle';

            if (bookingData.routeId && bookingData.vehicleId) {
                const route = (routes as RouteWithPrices[]).find(r => r.id === bookingData.routeId || r._id === bookingData.routeId);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vehicle = (vehicles as any[]).find(v => v.id === bookingData.vehicleId || v._id === bookingData.vehicleId);

                if (route && vehicle) {
                    const quantity = Number(bookingData.quantity) || 1;
                    const priceEntry = route.prices?.find(p => p.vehicleId === bookingData.vehicleId);

                    if (priceEntry) {
                        const basePrice = priceEntry.price * quantity;
                        // const { price, originalPrice, discountApplied, discountType } = calculateFinalPrice(basePrice, settings.discount);
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

            bookingsToProcess.push({
                ...bookingData,
                vehicleString,
                priceDetails
            });
            totalBatchCost += Number(priceDetails.finalPrice || 0);
        }

        // Create Booking
        const results = [];
        for (const item of bookingsToProcess) {
            try {
                const newBooking = await addBooking({
                    name: user.name || item.name || 'Customer',
                    email: user.email,
                    phone: user.phone || item.phone || '',
                    pickup: item.pickup,
                    dropoff: item.dropoff,
                    date: item.date,
                    time: item.time,
                    vehicle: item.vehicleString,
                    passengers: item.passengers || 1,
                    vehicleCount: item.quantity || 1,
                    luggage: item.luggage || 0,
                    notes: item.notes,
                    status: 'pending',
                    userId: user.id,
                    paymentStatus: 'unpaid',
                    ...item.priceDetails
                });

                results.push(newBooking);
            } catch (err) {
                console.error('Failed to create item', err);
                errors.push({ item, error: 'Failed to create' });
            }
        }

        return NextResponse.json({
            success: true,
            count: results.length,
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Bulk booking error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
