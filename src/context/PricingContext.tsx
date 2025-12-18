'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Route, Vehicle, ROUTES as DEFAULT_ROUTES, VEHICLES as DEFAULT_VEHICLES, calculateFinalPrice } from '@/lib/pricing';
import { Car, Bus } from 'lucide-react';
import { useSettings } from './SettingsContext';

interface PricingContextType {
    routes: Route[];
    vehicles: Vehicle[];
    calculatePrice: (routeId: string, vehicleId: string) => { price: number; originalPrice: number; discountApplied: number; discountType?: 'percentage' | 'fixed' };
    refreshPricing: () => Promise<void>;
    isLoading: boolean;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const VEHICLE_IMAGES: Record<string, string> = {
    'camry': '/images/fleet/camry.png',
    'gmc': '/images/fleet/gmc.png',
    'staria': '/images/fleet/staria.png',
    'starex': '/images/fleet/starex.png',
    'hiace': '/images/fleet/hiace.png',
    'coaster': '/images/fleet/coaster.png',
    'default': '/images/fleet/camry.png'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const attachIcons = (vehiclesData: any[]): Vehicle[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return vehiclesData.map((v: any) => {
        // Check both ID and Name to ensure we catch the correct type even if ID is numeric/UUID
        const searchStr = `${v.id} ${v.name}`.toLowerCase();

        let imageKey = 'default';
        if (searchStr.includes('camry') || searchStr.includes('sedan')) imageKey = 'camry';
        else if (searchStr.includes('gmc') || searchStr.includes('suv') || searchStr.includes('yukon')) imageKey = 'gmc';
        else if (searchStr.includes('staria')) imageKey = 'staria';
        else if (searchStr.includes('starex')) imageKey = 'starex';
        else if (searchStr.includes('hiace') || searchStr.includes('van')) imageKey = 'hiace';
        else if (searchStr.includes('coaster') || searchStr.includes('bus')) imageKey = 'coaster';

        return {
            ...v,
            icon: v.id.includes('hiace') || v.id.includes('coaster') ? Bus : Car,
            image: VEHICLE_IMAGES[imageKey]
        };
    });
};


export function PricingProvider({ children }: { children: React.ReactNode }) {
    const [routes, setRoutes] = useState<Route[]>(DEFAULT_ROUTES);
    const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
    const [isLoading, setIsLoading] = useState(true);
    const { settings } = useSettings();


    const fetchPricing = React.useCallback(async () => {
        try {
            const res = await fetch('/api/pricing');
            if (res.ok) {
                const data = await res.json();
                const vehiclesWithIcons = attachIcons(data.vehicles);

                // Enforce specific sort order logic (Client-side safety)
                const getSortIndex = (v: any) => {
                    const str = `${v.id} ${v.name}`.toLowerCase();
                    if (str.includes('camry')) return 0;
                    if (str.includes('gmc') || str.includes('yukon')) return 1;
                    if (str.includes('staria')) return 2;
                    if (str.includes('starex')) return 3;
                    if (str.includes('hiace')) return 4;
                    if (str.includes('coaster')) return 5;
                    return 999;
                };

                const sortedVehicles = vehiclesWithIcons.sort((a, b) => getSortIndex(a) - getSortIndex(b));

                setRoutes(data.routes);
                setVehicles(sortedVehicles);
            }
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPricing();
    }, [fetchPricing]);

    const calculatePrice = (routeId: string, vehicleId: string) => {
        const route = routes.find(r => r.id === routeId);
        const vehicle = vehicles.find(v => v.id === vehicleId);

        if (!route || !vehicle) return { price: 0, originalPrice: 0, discountApplied: 0 };

        let base = 0;
        // Check for custom vehicle rate
        if (route.customRates && route.customRates[vehicleId]) {
            base = route.customRates[vehicleId];
        } else {
            base = route.baseRate * vehicle.multiplier;
        }

        // Use shared calculation logic
        return calculateFinalPrice(base, settings?.discount);
    };

    return (
        <PricingContext.Provider value={{ routes, vehicles, calculatePrice, refreshPricing: fetchPricing, isLoading }}>
            {children}
        </PricingContext.Provider>
    );
}

export function usePricing() {
    const context = useContext(PricingContext);
    if (context === undefined) {
        throw new Error('usePricing must be used within a PricingProvider');
    }
    return context;
}
