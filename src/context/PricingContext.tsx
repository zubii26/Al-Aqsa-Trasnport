'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Route, Vehicle, ROUTES as DEFAULT_ROUTES, VEHICLES as DEFAULT_VEHICLES } from '@/lib/pricing';
import { Car, Bus } from 'lucide-react';

interface PricingContextType {
    routes: Route[];
    vehicles: Vehicle[];
    calculatePrice: (routeId: string, vehicleId: string) => number;
    refreshPricing: () => Promise<void>;
    isLoading: boolean;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

export function PricingProvider({ children }: { children: React.ReactNode }) {
    const [routes, setRoutes] = useState<Route[]>(DEFAULT_ROUTES);
    const [vehicles, setVehicles] = useState<Vehicle[]>(DEFAULT_VEHICLES);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPricing = async () => {
        try {
            const res = await fetch('/api/pricing');
            if (res.ok) {
                const data = await res.json();

                // Re-attach icons to vehicles since JSON doesn't store components
                const vehiclesWithIcons = data.vehicles.map((v: any) => ({
                    ...v,
                    icon: v.id.includes('hiace') || v.id.includes('coaster') ? Bus : Car
                }));

                setRoutes(data.routes);
                setVehicles(vehiclesWithIcons);
            }
        } catch (error) {
            console.error('Failed to fetch pricing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPricing();
    }, []);

    const calculatePrice = (routeId: string, vehicleId: string): number => {
        const route = routes.find(r => r.id === routeId);
        const vehicle = vehicles.find(v => v.id === vehicleId);

        if (!route || !vehicle) return 0;

        // Check for custom vehicle rate
        if (route.customRates && route.customRates[vehicleId]) {
            return route.customRates[vehicleId];
        }

        const base = route.baseRate * vehicle.multiplier;
        return Math.round(base);
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
