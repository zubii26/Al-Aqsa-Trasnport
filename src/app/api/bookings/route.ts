import { NextResponse } from 'next/server';
import { getBookings, addBooking } from '@/lib/db';
import { sendEmail, getBookingConfirmationTemplate, getAdminBookingNotificationTemplate } from '@/lib/email';
import { BookingSchema } from '@/lib/validations';
import { validateRequest } from '@/lib/server-auth';
import { getSettings } from '@/lib/settings-storage';
import { routeService, RouteWithPrices } from '@/services/routeService';
import { vehicleService } from '@/services/vehicleService';
import { calculateFinalPrice, VEHICLES as DEFAULT_VEHICLES } from '@/lib/pricing';


export async function GET() {
    try {
        const user = await validateRequest();
        if (!user || (user.role !== 'admin' && user.role !== 'manager' && user.role !== 'operational_manager')) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookings = await getBookings();
        return NextResponse.json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

import { rateLimit, bookingLimiter } from '@/lib/rate-limit';

export async function POST(request: Request) {

    // ─── Rate Limiting ──────────────────────────────────────────────────────
    const ip =
        request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'unknown';

    const limiter = rateLimit(ip, bookingLimiter);

    if (!limiter.success) {
        return NextResponse.json(
            { success: false, message: 'Too many booking requests. Please try again later.' },
            {
                status: 429,
                headers: { 'Retry-After': String(limiter.retryAfter) },
            }
        );
    }

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
        const selectedVehiclesList: any[] = [];
        let totalBasePrice = 0;
        let vehicleNames: string[] = [];

        // Normalize top-level vehicle selection for backwards compatibility or "same vehicle"
        let topLevelVehiclesToProcess: any[] = [];
        if (bookingData.selectedVehicles && bookingData.selectedVehicles.length > 0) {
            topLevelVehiclesToProcess = bookingData.selectedVehicles;
        } else if (bookingData.vehicleId) {
            topLevelVehiclesToProcess = [{ vehicleId: bookingData.vehicleId, quantity: bookingData.vehicleCount || 1 }];
        }

        try {
            const [routes, vehicles, settings] = await Promise.all([
                routeService.getRoutes(),
                vehicleService.getVehicles(),
                getSettings()
            ]);

            const routesList = routes as RouteWithPrices[];
            const vehiclesList = vehicles as any[];

            // Process multi-leg bookings
            if (bookingData.legs && bookingData.legs.length > 0) {
                for (const leg of bookingData.legs) {
                    const legRoute = routesList.find(r => r.id === leg.routeId);
                    
                    // Determine which vehicle applies to this leg (leg-specific or top-level fallback)
                    let legVehiclesToProcess = topLevelVehiclesToProcess;
                    if (!bookingData.sameVehicleForAllLegs && leg.selectedVehicles && leg.selectedVehicles.length > 0) {
                        legVehiclesToProcess = leg.selectedVehicles;
                    } else if (leg.vehicleId) {
                        legVehiclesToProcess = [{ vehicleId: leg.vehicleId, quantity: bookingData.vehicleCount || 1 }];
                    }
                    
                    for (const sv of legVehiclesToProcess) {
                        if (!sv) continue;
                        const vehicle = vehiclesList.find(v => v.id === sv.vehicleId);
                        if (vehicle) {
                            if (leg.date && vehicle.unavailableDates?.includes(leg.date)) {
                                throw new Error(`Vehicle ${vehicle.name} is unavailable on ${leg.date}`);
                            }
                            
                            leg.vehicleName = leg.vehicleName ? `${leg.vehicleName}, ${vehicle.name}` : vehicle.name;
                            
                            // Track unique vehicles globally for summary
                            if (!vehicleNames.includes(`${sv.quantity} x ${vehicle.name}`)) {
                                vehicleNames.push(`${sv.quantity} x ${vehicle.name}`);
                                selectedVehiclesList.push({ name: vehicle.name, quantity: sv.quantity, vehicleId: vehicle.id });
                            }

                            if (legRoute) {
                                const priceEntry = legRoute.prices?.find(p => p.vehicleId === sv.vehicleId);
                                if (priceEntry) {
                                    let legPrice = priceEntry.price * sv.quantity;
                                    
                                    // Add stopover extra price
                                    if (leg.stopovers && legRoute.stopovers) {
                                        for (const sName of leg.stopovers) {
                                            const s = legRoute.stopovers.find((rs: any) => rs.name === sName);
                                            if (s) legPrice += (s.extraPrice * sv.quantity);
                                        }
                                    }
                                    
                                    if (leg.includeWadiJinn) {
                                        const wadiJinnFee = settings.wadiJinnFee ?? 200;
                                        legPrice += wadiJinnFee * sv.quantity;
                                    }

                                    // Via Badr route fee
                                    if (leg.viaBadr && settings.routeFees?.enableViaBadr !== false) {
                                        legPrice += (settings.routeFees?.viaBadrFeeAmount ?? 150) * sv.quantity;
                                    }
                                    
                                    leg.price = (leg.price || 0) + legPrice;
                                    totalBasePrice += legPrice;
                                }
                            }
                        }
                    }
                }
            } 
            // Fallback to legacy single-route processing
            else if (bookingData.routeId && topLevelVehiclesToProcess.length > 0) {
                const route = routesList.find(r => r.id === bookingData.routeId);

                for (const sv of topLevelVehiclesToProcess) {
                    const vehicle = vehiclesList.find(v => v.id === sv.vehicleId);
                    if (vehicle) {
                        if (bookingData.date && vehicle.unavailableDates?.includes(bookingData.date)) {
                            throw new Error(`Vehicle ${vehicle.name} is unavailable on ${bookingData.date}`);
                        }

                        selectedVehiclesList.push({ name: vehicle.name, quantity: sv.quantity, vehicleId: vehicle.id });
                        vehicleNames.push(`${sv.quantity} x ${vehicle.name}`);

                        if (route) {
                            const priceEntry = route.prices?.find(p => p.vehicleId === sv.vehicleId);
                            if (priceEntry) {
                                let singlePrice = priceEntry.price * sv.quantity;
                                if (bookingData.includeWadiJinn) {
                                    const wadiJinnFee = settings.wadiJinnFee ?? 200;
                                    singlePrice += wadiJinnFee * sv.quantity;
                                }
                                // Nusuk Direct Route Fee (Umrah Visa + Jeddah Airport → Madinah)
                                if (bookingData.visaType === 'Umrah Visa' && settings.routeFees?.enableUmrahFee !== false) {
                                    const pickup = (bookingData.pickup || '').toLowerCase();
                                    const dropoff = (bookingData.dropoff || '').toLowerCase();
                                    if (pickup.includes('jeddah') && pickup.includes('airport') && dropoff.includes('madin')) {
                                        singlePrice += (settings.routeFees?.umrahFeeAmount ?? 150) * sv.quantity;
                                    }
                                }
                                // Via Badr route fee
                                if (bookingData.viaBadr && settings.routeFees?.enableViaBadr !== false) {
                                    singlePrice += (settings.routeFees?.viaBadrFeeAmount ?? 150) * sv.quantity;
                                }
                                totalBasePrice += singlePrice;
                            }
                        } else if (bookingData.routeId === 'custom' && bookingData.customRoute) {
                            const baseFare = settings.customRoute?.baseFare ?? 50;
                            const kmRate = settings.customRoute?.kmRate ?? 3;
                            const minFare = settings.customRoute?.minFare ?? 50;
                            const distance = bookingData.customRoute.distanceKm ?? 0;
                            
                            const defaultVehicle = DEFAULT_VEHICLES.find(dv => dv.id === sv.vehicleId || dv.name.toLowerCase() === vehicle.name.toLowerCase());
                            const multiplier = defaultVehicle?.multiplier ?? 1;

                            const customBase = Math.max(minFare, baseFare + distance * kmRate);
                            let singleCustomPrice = customBase * multiplier * sv.quantity;
                            if (bookingData.includeWadiJinn) {
                                const wadiJinnFee = settings.wadiJinnFee ?? 200;
                                singleCustomPrice += wadiJinnFee * sv.quantity;
                            }
                            totalBasePrice += singleCustomPrice;
                        }
                    }
                }
            }

            // Apply discounts to the total accumulated price
            if (totalBasePrice > 0) {
                let { price, originalPrice, discountApplied, discountType } = calculateFinalPrice(totalBasePrice, settings.discount);

                // Multi-route 10% discount for 3+ routes
                if (bookingData.legs && bookingData.legs.filter((l: any) => l.routeId && l.vehicleId).length >= 3) {
                    const multiDiscount = price * 0.10;
                    price = price - multiDiscount;
                    discountApplied += multiDiscount;
                    discountType = 'percentage';
                }

                if (discountApplied > 0) {
                    console.log(`[Booking] Discount applied: ${discountApplied} (${discountType})`);
                }

                priceDetails = {
                    originalPrice,
                    discountApplied,
                    finalPrice: price,
                    discountType,
                    price: String(price)
                };
            }

            if (vehicleNames.length > 0) {
                bookingData.vehicle = vehicleNames.join(', ');
            }

        } catch (err) {
            console.error('Error calculating price:', err);
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
                    legs: booking.legs,
                    visaType: booking.visaType,
                    viaBadr: booking.viaBadr,
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
