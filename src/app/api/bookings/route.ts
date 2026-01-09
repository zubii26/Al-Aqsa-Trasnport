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
    try {
        const bookings = await getBookings();
        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

export async function POST(request: Request) {

    try {
        console.log('[Booking API] Received new booking request');
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
        let priceDetails: any = {};
        const selectedVehiclesList = [];

        // Normalize vehicle selection
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let vehiclesToProcess: any[] = [];
        if (bookingData.selectedVehicles && bookingData.selectedVehicles.length > 0) {
            vehiclesToProcess = bookingData.selectedVehicles;
        } else if (bookingData.vehicleId) {
            vehiclesToProcess = [{ vehicleId: bookingData.vehicleId, quantity: bookingData.vehicleCount || 1 }];
        }

        // Calculate price and resolve vehicle names
        if (bookingData.routeId && vehiclesToProcess.length > 0) {
            try {
                const [routes, vehicles, settings] = await Promise.all([
                    routeService.getRoutes(),
                    vehicleService.getVehicles(),
                    getSettings()
                ]);

                const route = (routes as RouteWithPrices[]).find(r => r.id === bookingData.routeId);

                let totalBasePrice = 0;
                let vehicleNames: string[] = [];

                for (const sv of vehiclesToProcess) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const vehicle = (vehicles as any[]).find(v => v.id === sv.vehicleId);
                    if (vehicle) {
                        // Check availability
                        if (bookingData.date && vehicle.unavailableDates?.includes(bookingData.date)) {
                            // If this specific vehicle is unavailable on the requested date
                            throw new Error(`Vehicle ${vehicle.name} is unavailable on ${bookingData.date}`);
                        }

                        selectedVehiclesList.push({ name: vehicle.name, quantity: sv.quantity });
                        vehicleNames.push(`${sv.quantity} x ${vehicle.name}`);

                        if (route) {
                            const priceEntry = route.prices?.find(p => p.vehicleId === sv.vehicleId);
                            if (priceEntry) {
                                totalBasePrice += (priceEntry.price * sv.quantity);
                            }
                        }
                    }
                }

                if (totalBasePrice > 0) {
                    const { price, originalPrice, discountApplied, discountType } = calculateFinalPrice(totalBasePrice, settings.discount);

                    if (discountApplied > 0) {
                        console.log(`[Booking] Discount applied: ${discountApplied} (${discountType})`);
                    }

                    priceDetails = {
                        originalPrice,
                        discountApplied,
                        finalPrice: price,
                        discountType,
                        price: String(price) // Store final price as string for compatibility
                    };
                }

                // Set the fallback/summary vehicle string
                if (vehicleNames.length > 0) {
                    bookingData.vehicle = vehicleNames.join(', ');
                }

            } catch (err) {
                console.error('Error calculating price:', err);
            }
        }

        // Check if user is logged in (Optional)
        let userId = undefined;
        try {
            const { verifyToken } = await import('@/lib/auth-utils');
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            const token = cookieStore.get('admin_token')?.value;

            if (token) {
                const decoded = await verifyToken(token);
                if (decoded && decoded.userId) {
                    userId = decoded.userId;
                }
            }
        } catch (err) {
            console.log('Booking created as guest (no valid token found)');
        }




        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const booking = await addBooking({
            ...bookingData,
            ...priceDetails,
            userId, // Attach User ID if authenticated
            // Ensure we save the detailed selection if the DB supports it, 
            // otherwise 'vehicle' string covers the basics. 
            // We assume addBooking can handle extra fields or ignores them.
            selectedVehicles: selectedVehiclesList
        } as any);



        // Send standardized confirmation email to customer
        console.log('[Booking API] Processing customer email...');
        try {
            if (booking && booking.email) {
                const { sendBookingConfirmationEmail, sendAdminNewBookingEmail } = await import('@/lib/email');

                const emailData = {
                    name: booking.name,
                    email: booking.email,
                    status: booking.status,
                    id: booking._id.toString().slice(-8).toUpperCase(),
                    vehicle: booking.vehicle,
                    pickup: booking.pickup,
                    dropoff: booking.dropoff,
                    date: booking.date,
                    time: booking.time,
                    passengers: booking.passengers,
                    vehicleCount: booking.vehicleCount,
                    luggage: booking.luggage,
                    notes: booking.notes,
                    price: booking.finalPrice ? `${booking.finalPrice} SAR` : undefined,
                    selectedVehicles: selectedVehiclesList,
                    country: booking.country,
                    flightNumber: booking.flightNumber,
                    arrivalDate: booking.arrivalDate,
                    phone: booking.phone,
                };

                await sendBookingConfirmationEmail(emailData);
                await sendAdminNewBookingEmail(emailData);
                console.log('Standardized emails sent successfully');

                const { pusherServer } = await import('@/lib/pusher');
                await pusherServer.trigger('admin-channel', 'new-booking', {
                    message: `New booking: ${booking._id}`,
                    bookingId: booking._id,
                    data: emailData
                });
            }
        } catch (error) {
            console.error('Error sending standardized emails or notifications:', error);
        }

        return NextResponse.json(booking);
    } catch (error) {
        console.error('Booking error:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
