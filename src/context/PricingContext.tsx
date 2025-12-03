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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const attachIcons = (vehiclesData: any[]): Vehicle[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return vehiclesData.map((v: any) => ({
        ...v,
        icon: v.id.includes('hiace') || v.id.includes('coaster') ? Bus : Car
    }));
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

                setRoutes(data.routes);
                setVehicles(vehiclesWithIcons);
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
