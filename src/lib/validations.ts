import { z } from 'zod';

export const BookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long').trim(),
    email: z.string().email('Invalid email address').max(254, 'Email is too long').trim(),
    phone: z.string().min(10, 'Phone number must be at least 10 characters').max(30, 'Phone number is too long').trim(),
    pickup: z.string().min(3, 'Pickup location is required').max(200, 'Pickup location is too long').trim(),
    dropoff: z.string().min(3, 'Dropoff location is required').max(200, 'Dropoff location is too long').trim(),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    vehicle: z.string().max(100).trim().optional(), // Made optional for backward compatibility
    passengers: z.number().int().min(1, 'At least 1 passenger is required').max(100, 'Max 100 passengers').optional(), // Made optional as vehicle capacity determines this
    vehicleCount: z.number().int().min(1, 'At least 1 vehicle is required').max(20, 'Max 20 vehicles').optional(),
    luggage: z.number().int().min(0, 'Luggage cannot be negative').max(100, 'Luggage count too high').optional(),
    notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').trim().optional(),
    originalPrice: z.number().optional(),
    discountApplied: z.number().optional(),
    finalPrice: z.number().optional(),
    discountType: z.enum(['percentage', 'fixed']).optional(),
    routeId: z.string().max(50).trim().optional(),
    vehicleId: z.string().max(50).trim().optional(), // Kept for backward compatibility
    selectedVehicles: z.array(z.object({
        vehicleId: z.string().max(50).trim(),
        quantity: z.number().min(1).max(20),
        name: z.string().max(100).trim().optional()
    })).optional(),
    country: z.string().max(100).trim().optional(),
    flightNumber: z.string().max(50).trim().optional(),
    arrivalDate: z.string().max(50).trim().optional(),
    paymentMethod: z.string().max(50).trim().optional(),
    paymentStatus: z.enum(['paid', 'unpaid', 'refunded']).optional(),
    price: z.string().max(50).trim().optional(),
    customRoute: z.object({
        pickupLat: z.number(),
        pickupLng: z.number(),
        dropoffLat: z.number(),
        dropoffLng: z.number(),
        distanceKm: z.number().optional(),
        durationMin: z.number().optional(),
        geometry: z.string().optional(),
    }).optional(),
});

export const VehicleSchema = z.object({
    name: z.string().min(2, 'Vehicle name is required').max(100).trim(),
    image: z.string().min(1, 'Image path is required').max(500).trim(),
    passengers: z.number().int().min(1, 'Passenger capacity must be at least 1').max(100),
    luggage: z.number().int().min(0, 'Luggage capacity cannot be negative').max(100),
    features: z.array(z.string().max(100).trim()).min(1, 'At least one feature is required'),
    price: z.string().min(1, 'Price information is required').max(100).trim(),
    category: z.enum(['Standard', 'Premium', 'VIP']).optional(),
    isActive: z.boolean().optional(),
    unavailableDates: z.array(z.string().max(50).trim()).optional(),
});

export const ContactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
    email: z.string().email('Invalid email address').max(254).trim(),
    message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message cannot exceed 2000 characters').trim(),
});

export const PricingSchema = z.object({
    routes: z.array(z.object({
        id: z.string().max(50).trim(),
        name: z.string().max(200).trim(),
        distance: z.string().max(50).trim(),
        time: z.string().max(50).trim(),
        baseRate: z.number(),
        promotionalDiscount: z.number().optional(),
        customRates: z.record(z.string().max(50).trim(), z.number()).optional(),
    })),
    vehicles: z.array(z.object({
        id: z.string().max(50).trim(),
        name: z.string().max(100).trim(),
        capacity: z.string().max(50).trim(),
        multiplier: z.number(),
        features: z.array(z.string().max(100).trim()),
        luggage: z.string().max(50).trim(),
        category: z.enum(['Standard', 'Premium', 'VIP']).optional(), // Optional for backward compatibility
        isActive: z.boolean().optional(),
    })),
});

export const SettingsSchema = z.object({
    general: z.object({
        siteName: z.string().min(1, 'Site name is required').max(100).trim(),
        description: z.string().max(500).trim(),
        footerText: z.string().max(500).trim(),
        logo: z.string().max(500).trim().optional(),
        googleAnalyticsId: z.string().max(50).trim().optional(),
    }),
    contact: z.object({
        email: z.string().email('Invalid email').max(254).trim(),
        phone: z.string().max(30).trim(),
        phone2: z.string().max(30).trim().optional(),
        address: z.string().max(500).trim(),
        social: z.object({
            facebook: z.string().max(500).trim().optional(),
            twitter: z.string().max(500).trim().optional(),
            instagram: z.string().max(500).trim().optional(),
            tiktok: z.string().max(500).trim().optional(),
            linkedin: z.string().max(500).trim().optional(),
        }),
    }),
    seo: z.object({
        defaultTitle: z.string().max(200).trim(),
        defaultDescription: z.string().max(500).trim(),
        keywords: z.string().max(1000).trim(),
    }),
    appearance: z.object({
        darkMode: z.boolean(),
        primaryColor: z.string().max(20).trim(),
    }),
    discount: z.object({
        enabled: z.boolean(),
        type: z.enum(['percentage', 'fixed']),
        value: z.number().min(0),
        startDate: z.string().max(50).trim().optional(),
        endDate: z.string().max(50).trim().optional(),
    }).optional(),
    emailTemplates: z.object({
        bookingConfirmation: z.string().max(5000).optional(),
        adminNotification: z.string().max(5000).optional(),
    }).optional(),
    customRoute: z.object({
        baseFare: z.number().min(0),
        kmRate: z.number().min(0),
        minFare: z.number().min(0),
    }).optional(),
});

export type Booking = z.infer<typeof BookingSchema>;
export type Vehicle = z.infer<typeof VehicleSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type PricingData = z.infer<typeof PricingSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
