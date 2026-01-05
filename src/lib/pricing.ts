import { LucideIcon } from 'lucide-react';
import pricingData from '@/data/pricing.json';

export interface Route {
    id: string;
    name: string;
    distance: string;
    time: string;
    baseRate: number;
    promotionalDiscount?: number; // Percentage discount
    category?: string; // e.g. 'Airport', 'Ziarat', 'Intercity'
    customRates?: { [vehicleId: string]: number };
}

export const ROUTES: Route[] = pricingData.routes as unknown as Route[];

export interface Vehicle {
    id: string;
    name: string;
    capacity: string;
    multiplier: number;
    icon: LucideIcon;
    features: string[];
    luggage: string;
    category?: 'Standard' | 'Premium' | 'VIP';
    isActive?: boolean;
    image?: string;
}

export const VEHICLES: Vehicle[] = pricingData.vehicles as unknown as Vehicle[];

export * from './pricing-calc';
// import { calculateFinalPrice } from './pricing-calc'; // Removed redundant import

// Re-export specific types if they were used locally
export type { DiscountSettings, PricingResult } from './pricing-calc';


export const getPricingData = async () => {
    return {
        routes: [],
        vehicles: []
    };
};
