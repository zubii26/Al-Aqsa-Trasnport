'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Route, Vehicle, ROUTES as DEFAULT_ROUTES, VEHICLES as DEFAULT_VEHICLES, calculateFinalPrice } from '@/lib/pricing';
import { Car, Bus } from 'lucide-react';
import { useSettings } from './SettingsContext';

// Helper to parse route name into origin/destination
const splitRouteName = (name: string): [string, string] => {
    if (!name) return ['', ''];
    const parts = name.split(/\s*(?:->|to|\u2192)\s*/i);
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
};

interface RoutePricingOptions {
    includeWadiJinn?: boolean;
    viaBadr?: boolean;
    visaType?: string;
    pickup?: string;
    dropoff?: string;
}

interface PricingContextType {
    routes: Route[];
    vehicles: Vehicle[];
    calculatePrice: (routeId: string, vehicleId: string, options?: RoutePricingOptions) => { price: number; originalPrice: number; discountApplied: number; discountType?: 'percentage' | 'fixed' };
    calculateMultiRoutePrice: (legs: any[], globalVehicleCount?: number) => { price: number; originalPrice: number; discountApplied: number; discountType?: 'percentage' | 'fixed' };
    refreshPricing: () => Promise<void>;
    isLoading: boolean;
}

const PricingContext = createContext<PricingContextType | undefined>(undefined);

const VEHICLE_IMAGES: Record<string, string> = {
    'camry': '/images/fleet/camry.webp',
    'gmc': '/images/fleet/gmc.webp',
    'staria': '/images/fleet/staria.webp',
    'starex': '/images/fleet/starex.webp',
    'hiace': '/images/fleet/hiace.webp',
    'coaster': '/images/fleet/coaster.webp',
    'default': '/images/fleet/camry.webp'
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const attachIcons = (vehiclesData: any[]): Vehicle[] => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return vehiclesData.map((v: any) => {
        // Check both ID and Name to ensure we catch the correct type even if ID is numeric/UUID
        const searchStr = `${v.id} ${v.name}`.toLowerCase();

        let fallbackImageKey = 'default';
        if (searchStr.includes('camry') || searchStr.includes('sedan')) fallbackImageKey = 'camry';
        else if (searchStr.includes('gmc') || searchStr.includes('suv') || searchStr.includes('yukon')) fallbackImageKey = 'gmc';
        else if (searchStr.includes('staria')) fallbackImageKey = 'staria';
        else if (searchStr.includes('starex')) fallbackImageKey = 'starex';
        else if (searchStr.includes('hiace') || searchStr.includes('van')) fallbackImageKey = 'hiace';
        else if (searchStr.includes('coaster') || searchStr.includes('bus')) fallbackImageKey = 'coaster';

        return {
            ...v,
            icon: v.id.includes('hiace') || v.id.includes('coaster') ? Bus : Car,
            // Use the image from the database/API first; only fall back to hardcoded if empty
            image: v.image || VEHICLE_IMAGES[fallbackImageKey]
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
            const res = await fetch('/api/pricing', { cache: 'no-store' });
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

    const calculatePrice = (routeId: string, vehicleId: string, options?: RoutePricingOptions) => {
        const route = routes.find(r => r.id === routeId);
        const vehicle = vehicles.find(v => v.id === vehicleId);

        if (!route || !vehicle) return { price: 0, originalPrice: 0, discountApplied: 0 };

        let base = 0;
        // Check for custom vehicle rate
        if (route.customRates && route.customRates[vehicleId]) {
            base = route.customRates[vehicleId];
        } else if (route.baseRate > 0) {
            base = route.baseRate * vehicle.multiplier;
        } else {
            // Fallback to distance based pricing if no base rate is set
            const distanceStr = route.distance || '0';
            const distance = parseFloat(distanceStr.replace(/[^0-9.]/g, ''));
            if (distance > 0) {
                const baseFare = settings?.customRoute?.baseFare ?? 50;
                const kmRate = settings?.customRoute?.kmRate ?? 3;
                const minFare = settings?.customRoute?.minFare ?? 50;
                base = Math.max(minFare, baseFare + distance * kmRate) * vehicle.multiplier;
            }
        }
        
        // Rule 2: Wadi Jinn external ziyarat fee
        if (options?.includeWadiJinn) {
            const wadiJinnFee = settings?.wadiJinnFee ?? 200;
            base += wadiJinnFee;
        }

        // Rule 1: Nusuk Direct Route Fee — Jeddah Airport → Madinah + Umrah Visa
        if (options?.visaType === 'Umrah Visa' && settings?.routeFees?.enableUmrahFee !== false) {
            const pickup = (options?.pickup || route.origin || splitRouteName(route.name)[0] || '').toLowerCase();
            const dropoff = (options?.dropoff || route.destination || splitRouteName(route.name)[1] || '').toLowerCase();
            if (pickup.includes('jeddah') && pickup.includes('airport') && dropoff.includes('madin')) {
                base += settings?.routeFees?.umrahFeeAmount ?? 150;
            }
        }

        // Rule 3: Via Badr extended route fee — Madinah → Makkah
        if (options?.viaBadr && settings?.routeFees?.enableViaBadr !== false) {
            base += settings?.routeFees?.viaBadrFeeAmount ?? 150;
        }

        // Use shared calculation logic
        return calculateFinalPrice(base, settings?.discount);
    };

    const calculateMultiRoutePrice = (legs: any[], globalVehicleCount: number = 1) => {
        let totalBasePrice = 0;
        let validLegsCount = 0;
        
        for (const leg of legs) {
            if (!leg.routeId || !leg.vehicleId) continue;
            
            const route = routes.find(r => r.id === leg.routeId);
            const vehicle = vehicles.find(v => v.id === leg.vehicleId);
            
            if (route && vehicle) {
                validLegsCount++;
                let base = 0;
                if (route.customRates && route.customRates[leg.vehicleId]) {
                    base = route.customRates[leg.vehicleId];
                } else if (route.baseRate > 0) {
                    base = route.baseRate * vehicle.multiplier;
                } else {
                    const distanceStr = route.distance || '0';
                    const distance = parseFloat(distanceStr.replace(/[^0-9.]/g, ''));
                    if (distance > 0) {
                        const baseFare = settings?.customRoute?.baseFare ?? 50;
                        const kmRate = settings?.customRoute?.kmRate ?? 3;
                        const minFare = settings?.customRoute?.minFare ?? 50;
                        base = Math.max(minFare, baseFare + distance * kmRate) * vehicle.multiplier;
                    }
                }
                
                if (leg.includeWadiJinn) {
                    const wadiJinnFee = settings?.wadiJinnFee ?? 200;
                    base += wadiJinnFee;
                }

                // Rule 3: Via Badr extended route fee — Madinah → Makkah
                if (leg.viaBadr && settings?.routeFees?.enableViaBadr !== false) {
                    base += settings?.routeFees?.viaBadrFeeAmount ?? 150;
                }
                
                // Add stopovers
                if (leg.stopovers && route.stopovers) {
                    for (const sName of leg.stopovers) {
                        const s = route.stopovers.find(rs => rs.name === sName);
                        if (s) base += s.extraPrice;
                    }
                }
                
                totalBasePrice += (base * globalVehicleCount);
            }
        }
        
        if (totalBasePrice === 0) return { price: 0, originalPrice: 0, discountApplied: 0 };
        
        let finalPriceObj = calculateFinalPrice(totalBasePrice, settings?.discount);
        
        // Multi-route 10% discount for 3+ routes
        if (validLegsCount >= 3) {
            const multiDiscount = finalPriceObj.price * 0.10;
            finalPriceObj.price = finalPriceObj.price - multiDiscount;
            finalPriceObj.discountApplied += multiDiscount;
            finalPriceObj.discountType = 'percentage';
        }
        
        return finalPriceObj;
    };

    return (
        <PricingContext.Provider value={{ routes, vehicles, calculatePrice, calculateMultiRoutePrice, refreshPricing: fetchPricing, isLoading }}>
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
