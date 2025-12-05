import { NextResponse } from 'next/server';
import { getBookings, addBooking } from '@/lib/db';
import { sendEmail, getBookingConfirmationTemplate, getAdminBookingNotificationTemplate } from '@/lib/email';
import { BookingSchema } from '@/lib/validations';
import { validateRequest } from '@/lib/server-auth';
import { getSettings } from '@/lib/settings-storage';
import { routeService, RouteWithPrices } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';
import { calculateFinalPrice } from '@/lib/pricing';

export async function GET() {
    const user = await validateRequest();
    if (!user || (user.role !== 'admin' && !user.role.toLowerCase().includes('manager'))) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const bookings = await getBookings();
    return NextResponse.json(bookings);
}

export async function POST(request: Request) {

    try {
        const body = await request.json();

        // Validate input
        const validation = BookingSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: 'Invalid booking data', errors: validation.error.format() },
                { status: 400 }
            );
        }

        const bookingData = validation.data;
        let priceDetails = {};

        // Calculate price if routeId and vehicleId are present
        if (bookingData.routeId && bookingData.vehicleId) {
            try {
                const [routes, vehicles, settings] = await Promise.all([
                    routeService.getRoutes(),
                    vehicleService.getVehicles(),
                    getSettings()
                ]);

                const route = (routes as RouteWithPrices[]).find(r => r.id === bookingData.routeId);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const vehicle = (vehicles as any[]).find(v => v.id === bookingData.vehicleId);

                if (route && vehicle) {
                    let basePrice = 0;
                    // Check for custom price
                    const priceEntry = route.prices?.find(p => p.vehicleId === bookingData.vehicleId);

                    if (priceEntry) {
                        basePrice = priceEntry.price;
                    } else {
                        // Fallback logic if needed, or 0
                        // Assuming baseRate logic if applicable, but mostly using custom rates
                        basePrice = 0;
                    }

                    if (basePrice > 0) {
                        const { price, originalPrice, discountApplied, discountType } = calculateFinalPrice(basePrice, settings.discount);

                        if (discountApplied > 0) {
                            console.log(`[Booking] Discount applied: ${discountApplied} (${discountType}) for route ${bookingData.routeId} vehicle ${bookingData.vehicleId}`);
                        }

                        priceDetails = {
                            originalPrice,
                            discountApplied,
                            finalPrice: price,
                            discountType,
                            price: String(price) // Store final price as string for compatibility
                        };
                    }
                }
            } catch (err) {
                console.error('Error calculating price:', err);
                // Continue without price if calculation fails
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const booking = await addBooking({ ...bookingData, ...priceDetails, userId: null } as any);

        // Send confirmation email to customer
        // Send confirmation email to customer
        try {
            if (booking && booking.email) {
                await sendEmail({
                    to: booking.email,
                    subject: 'Booking Confirmation - Al Aqsa Transport',
                    html: getBookingConfirmationTemplate({
                        name: booking.name,
                        status: booking.status,
                        id: booking._id.toString(),
                        vehicle: booking.vehicle,
                        pickup: booking.pickup,
                        dropoff: booking.dropoff,
                        date: booking.date,
                        time: booking.time,
                        passengers: booking.passengers,
                        price: booking.finalPrice ? `${booking.finalPrice} SAR` : undefined
                    }),
                });
            }
        } catch (error) {
            console.error('Error sending customer confirmation email:', error);
        }

        // Send notification email to admin
        try {
            const settings = await getSettings();
            if (settings.contact && settings.contact.email) {
                await sendEmail({
                    to: settings.contact.email,
                    subject: 'New Booking Received - Al Aqsa Transport',
                    html: getAdminBookingNotificationTemplate({
                        name: booking.name,
                        status: booking.status,
                        id: booking._id.toString(),
                        vehicle: booking.vehicle,
                        pickup: booking.pickup,
                        dropoff: booking.dropoff,
                        date: booking.date,
                        time: booking.time,
                        passengers: booking.passengers,
                        price: booking.finalPrice ? `${booking.finalPrice} SAR` : undefined
                    }),
                });
                console.log('Admin notification email sent to:', settings.contact.email);
            }
        } catch (error) {
            console.error('Error sending admin notification:', error);
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
