import { PlaneLanding, Building2, TrainFront, Landmark, MapPin } from 'lucide-react';
import React from 'react';

export type LocationCategory = 'Popular' | 'Airports' | 'Hotels' | 'Train Stations' | 'Holy Sites' | 'Cities' | 'Search Results';

export interface PredefinedLocation {
    id: string;
    name: string;
    description: string;
    category: LocationCategory;
    icon: React.ElementType;
    isPopular?: boolean;
}

export const PREDEFINED_LOCATIONS: PredefinedLocation[] = [
    // Airports
    { id: 'jeddah-airport', name: 'Jeddah Airport', description: 'King Abdulaziz International Airport (JED)', category: 'Airports', icon: PlaneLanding, isPopular: true },
    { id: 'madinah-airport', name: 'Madinah Airport', description: 'Prince Mohammad Bin Abdulaziz Airport (MED)', category: 'Airports', icon: PlaneLanding, isPopular: true },
    { id: 'taif-airport', name: 'Taif Airport', description: 'Taif International Airport (TIF)', category: 'Airports', icon: PlaneLanding },

    // Hotels
    { id: 'makkah-hotels', name: 'Makkah Hotels', description: 'Any hotel in Makkah', category: 'Hotels', icon: Building2, isPopular: true },
    { id: 'madinah-hotels', name: 'Madinah Hotels', description: 'Any hotel in Madinah', category: 'Hotels', icon: Building2, isPopular: true },
    { id: 'jeddah-hotels', name: 'Jeddah Hotels', description: 'Any hotel in Jeddah', category: 'Hotels', icon: Building2 },

    // Train Stations
    { id: 'makkah-train', name: 'Makkah Train Station', description: 'Haramain High Speed Railway', category: 'Train Stations', icon: TrainFront, isPopular: true },
    { id: 'madinah-train', name: 'Madinah Train Station', description: 'Haramain High Speed Railway', category: 'Train Stations', icon: TrainFront },
    { id: 'jeddah-train', name: 'Jeddah Train Station', description: 'Al-Sulimaniyah, Haramain High Speed Railway', category: 'Train Stations', icon: TrainFront },

    // Holy Sites
    { id: 'masjid-al-haram', name: 'Masjid Al-Haram', description: 'The Great Mosque of Makkah', category: 'Holy Sites', icon: Landmark },
    { id: 'masjid-an-nabawi', name: 'Masjid An-Nabawi', description: 'The Prophets Mosque, Madinah', category: 'Holy Sites', icon: Landmark },

    // Cities
    { id: 'makkah-city', name: 'Makkah City', description: 'Makkah, Saudi Arabia', category: 'Cities', icon: MapPin },
    { id: 'madinah-city', name: 'Madinah City', description: 'Madinah, Saudi Arabia', category: 'Cities', icon: MapPin },
    { id: 'jeddah-city', name: 'Jeddah City', description: 'Jeddah, Saudi Arabia', category: 'Cities', icon: MapPin },
    { id: 'taif-city', name: 'Taif City', description: 'Taif, Saudi Arabia', category: 'Cities', icon: MapPin },
];

export const getRecommendations = (pickupLocation: string): string[] => {
    const pickupLower = pickupLocation.toLowerCase();
    
    if (pickupLower.includes('jeddah airport') || pickupLower.includes('jeddah')) {
        return ['makkah-hotels', 'madinah-hotels', 'makkah-train'];
    }
    
    if (pickupLower.includes('makkah')) {
        return ['jeddah-airport', 'madinah-hotels', 'madinah-train'];
    }

    if (pickupLower.includes('madinah')) {
        return ['makkah-hotels', 'jeddah-airport', 'makkah-train'];
    }

    return [];
};
