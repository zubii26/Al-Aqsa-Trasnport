import { z } from 'zod';

export const BookingSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone number must be at least 10 characters'),
    pickup: z.string().min(3, 'Pickup location is required'),
    dropoff: z.string().min(3, 'Dropoff location is required'),
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
    time: z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),
    vehicle: z.string().min(1, 'Vehicle selection is required'),
    passengers: z.number().int().min(1, 'At least 1 passenger is required').max(50, 'Max 50 passengers'),
});

export const VehicleSchema = z.object({
    name: z.string().min(2, 'Vehicle name is required'),
    image: z.string().min(1, 'Image path is required'),
    passengers: z.number().int().min(1, 'Passenger capacity must be at least 1'),
    luggage: z.number().int().min(0, 'Luggage capacity cannot be negative'),
    features: z.array(z.string()).min(1, 'At least one feature is required'),
    price: z.string().min(1, 'Price information is required'),
    category: z.enum(['Standard', 'Premium', 'VIP']).optional(),
    isActive: z.boolean().optional(),
});

export const ContactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const PricingSchema = z.object({
    routes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        distance: z.string(),
        time: z.string(),
        baseRate: z.number(),
        promotionalDiscount: z.number().optional(),
        customRates: z.record(z.string(), z.number()).optional(),
    })),
    vehicles: z.array(z.object({
        id: z.string(),
        name: z.string(),
        capacity: z.string(),
        multiplier: z.number(),
        features: z.array(z.string()),
        luggage: z.string(),
        category: z.enum(['Standard', 'Premium', 'VIP']).optional(), // Optional for backward compatibility
        isActive: z.boolean().optional(),
    })),
});

export const SettingsSchema = z.object({
    general: z.object({
        siteName: z.string().min(1, 'Site name is required'),
        description: z.string(),
        footerText: z.string(),
        logo: z.string().optional(),
    }),
    contact: z.object({
        email: z.string().email('Invalid email'),
        phone: z.string(),
        address: z.string(),
        whatsapp: z.string(),
        social: z.object({
            facebook: z.string().optional(),
            twitter: z.string().optional(),
            instagram: z.string().optional(),
            tiktok: z.string().optional(),
            linkedin: z.string().optional(),
        }),
    }),
    seo: z.object({
        defaultTitle: z.string(),
        defaultDescription: z.string(),
        keywords: z.string(),
    }),
    appearance: z.object({
        darkMode: z.boolean(),
        primaryColor: z.string(),
    }),
});

export type Booking = z.infer<typeof BookingSchema>;
export type Vehicle = z.infer<typeof VehicleSchema>;
export type Contact = z.infer<typeof ContactSchema>;
export type PricingData = z.infer<typeof PricingSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
