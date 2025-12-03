import { LucideIcon } from 'lucide-react';

export interface Route {
    id: string;
    name: string;
    distance: string;
    time: string;
    baseRate: number;
    promotionalDiscount?: number; // Percentage discount
    customRates?: { [vehicleId: string]: number };
}

export const ROUTES: Route[] = [];

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
}

export const VEHICLES: Vehicle[] = [];

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
