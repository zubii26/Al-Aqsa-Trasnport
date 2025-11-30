import { Car, Bus, LucideIcon } from 'lucide-react';

export interface Route {
    id: string;
    name: string;
    distance: string;
    time: string;
    baseRate: number;
    promotionalDiscount?: number; // Percentage discount
    customRates?: { [vehicleId: string]: number };
}

export const ROUTES: Route[] = [
    // Airport Transfers
    {
        id: 'jed-mak',
        name: 'Jeddah Airport → Makkah Hotel',
        distance: '100 km',
        time: '1 hr 30 min',
        baseRate: 200,
        customRates: { hiace: 350, gmc: 500, starex: 300, staria: 300, coaster: 550 }
    },
    {
        id: 'jed-mad',
        name: 'Jeddah Airport → Madinah Hotel',
        distance: '400 km',
        time: '4 hrs',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 1000, starex: 450, staria: 500, coaster: 1100 }
    },
    {
        id: 'mak-mad',
        name: 'Makkah Hotel → Madinah Hotel',
        distance: '450 km',
        time: '4 hrs 30 min',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 900, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'mad-mak',
        name: 'Madinah Hotel → Makkah Hotel',
        distance: '450 km',
        time: '4 hrs 30 min',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 900, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'mak-jed',
        name: 'Makkah Hotel → Jeddah Airport',
        distance: '100 km',
        time: '1 hr 30 min',
        baseRate: 200,
        customRates: { hiace: 350, gmc: 500, starex: 300, staria: 300, coaster: 550 }
    },
    {
        id: 'mad-airport',
        name: 'Madinah Airport ↔ Madinah Hotel',
        distance: '20 km',
        time: '25 min',
        baseRate: 150,
        customRates: { hiace: 250, gmc: 300, starex: 200, staria: 250, coaster: 400 }
    },

    // Train Station Transfers
    {
        id: 'jed-train',
        name: 'Jeddah Airport ↔ Jeddah Train Station',
        distance: '20 km',
        time: '30 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },
    {
        id: 'mak-train',
        name: 'Makkah Hotel ↔ Makkah Train Station',
        distance: '15 km',
        time: '25 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },
    {
        id: 'mad-train',
        name: 'Madinah Hotel ↔ Madinah Train Station',
        distance: '15 km',
        time: '25 min',
        baseRate: 120,
        customRates: { hiace: 200, gmc: 250, starex: 180, staria: 180, coaster: 350 }
    },

    // Ziarat (Sightseeing)
    {
        id: 'ziarat-mak',
        name: 'Makkah Ziarat (Half Day)',
        distance: '40 km',
        time: '3-4 hrs',
        baseRate: 200,
        customRates: { hiace: 300, gmc: 400, starex: 250, staria: 250, coaster: 500 }
    },
    {
        id: 'ziarat-mad',
        name: 'Madinah Ziarat (Half Day)',
        distance: '40 km',
        time: '3-4 hrs',
        baseRate: 200,
        customRates: { hiace: 250, gmc: 400, starex: 200, staria: 200, coaster: 500 }
    },
    {
        id: 'taif-tour',
        name: 'Makkah to Taif (Return)',
        distance: '180 km',
        time: '8-10 hrs',
        baseRate: 400,
        customRates: { hiace: 550, gmc: 800, starex: 450, staria: 450, coaster: 900 }
    },
    {
        id: 'jed-taif',
        name: 'Jeddah to Taif (Return)',
        distance: '350 km',
        time: '10-12 hrs',
        baseRate: 500,
        customRates: { hiace: 700, gmc: 1000, starex: 600, staria: 600, coaster: 1000 }
    },
    {
        id: 'badar-ziarat',
        name: 'Badar Ziarat (Full Day)',
        distance: '300 km',
        time: '6-8 hrs',
        baseRate: 700
    },

    // Hourly Rental
    {
        id: 'hourly',
        name: 'Hourly Rental (Per Hour)',
        distance: '-',
        time: '1 Hour',
        baseRate: 80,
        customRates: { hiace: 120, gmc: 140, starex: 100, staria: 100, coaster: 250 }
    },
];

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

export const VEHICLES: Vehicle[] = [
    {
        id: 'camry',
        name: 'Toyota Camry',
        capacity: '4 Seater',
        multiplier: 1,
        icon: Car,
        features: ['Air Conditioning', 'Comfortable Seating', 'USB Charging'],
        luggage: '2 Large Suitcases',
        category: 'Standard',
        isActive: true
    },
    {
        id: 'starex',
        name: 'Hyundai Starex',
        capacity: '7 Seater',
        multiplier: 1.2,
        icon: Car,
        features: ['Spacious Interior', 'AC Vents for Rear', 'Sliding Doors'],
        luggage: '4 Large Suitcases',
        category: 'Standard',
        isActive: true
    },
    {
        id: 'staria',
        name: 'Hyundai Staria',
        capacity: '7 Seater',
        multiplier: 1.3,
        icon: Car,
        features: ['Modern Design', 'Panoramic Windows', 'Premium Comfort'],
        luggage: '4 Large Suitcases',
        category: 'Premium',
        isActive: true
    },
    {
        id: 'gmc',
        name: 'GMC Yukon',
        capacity: '7 Seater',
        multiplier: 1.5,
        icon: Car,
        features: ['Luxury Leather Seats', 'Premium Sound', 'Extra Legroom'],
        luggage: '5 Large Suitcases',
        category: 'VIP',
        isActive: true
    },
    {
        id: 'hiace',
        name: 'Toyota Hiace',
        capacity: '11 Seater',
        multiplier: 1.6,
        icon: Bus,
        features: ['High Roof', 'Individual Seats', 'Ample Luggage Space'],
        luggage: '8 Large Suitcases',
        category: 'Standard',
        isActive: true
    },
    {
        id: 'coaster',
        name: 'Toyota Coaster',
        capacity: '21 Seater',
        multiplier: 2.5,
        icon: Bus,
        features: ['Microphone System', 'Curtains', 'Reclining Seats'],
        luggage: '15 Large Suitcases',
        category: 'Standard',
        isActive: true
    },
];

export const calculatePrice = (routeId: string, vehicleId: string): number => {
    const route = ROUTES.find(r => r.id === routeId);
    const vehicle = VEHICLES.find(v => v.id === vehicleId);

    if (!route || !vehicle) return 0;

    // Check for custom vehicle rate
    if (route.customRates && route.customRates[vehicleId]) {
        return route.customRates[vehicleId];
    }

    const base = route.baseRate * vehicle.multiplier;
    return Math.round(base);
};
