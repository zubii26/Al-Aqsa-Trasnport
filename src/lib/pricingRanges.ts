// src/lib/pricingRanges.ts
// Single source of truth for the DISPLAY price ranges shown on marketing pages
// (homepage, /pricing-guide, etc). Computed directly from the same route data
// the booking engine actually charges from (src/data/pricing.json via @/lib/pricing) —
// never a hand-typed number. This exists specifically to fix a real bug: the
// homepage, /services, and the fleet cards previously showed three different,
// disagreeing prices for the same vehicle because each had its own hardcoded string.
//
// Safe to import from both server and client components — it only reads the
// already-bundled pricing.json, no filesystem or DB access (unlike
// src/lib/pricing-storage.ts, which is server-only).

import { ROUTES, type Route } from '@/lib/pricing';

// "Local" = airport/city transfers, used for the low end of a range.
// The Makkah <> Madinah intercity run is our longest common route, used for the high end.
const LOCAL_MAX_KM = 100;
const INTERCITY_ROUTE_NAMES = ['Makkah Hotel to Madinah Hotel', 'Madinah Hotel to Makkah Hotel'];

function parseKm(distance?: string): number {
    if (!distance) return 0;
    const match = distance.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
}

export interface VehiclePriceRange {
    low: number;
    high: number;
}

/**
 * Real, defensible "SAR low–high" range for a vehicle, derived from live route data.
 * Returns null if the vehicle has no rates on the reference routes (e.g. a new
 * vehicle added to the fleet without pricing set up yet) — callers should treat
 * null as "don't show a price," never fall back to a guessed number.
 */
export function getVehiclePriceRange(vehicleId: string): VehiclePriceRange | null {
    const localRoutes = ROUTES.filter(
        (r: Route) =>
            !r.name.toLowerCase().includes('hourly') &&
            parseKm(r.distance) > 0 &&
            parseKm(r.distance) <= LOCAL_MAX_KM
    );
    const intercityRoutes = ROUTES.filter((r: Route) => INTERCITY_ROUTE_NAMES.includes(r.name));

    const localPrices = localRoutes
        .map((r) => r.customRates?.[vehicleId])
        .filter((p): p is number => typeof p === 'number');
    const intercityPrices = intercityRoutes
        .map((r) => r.customRates?.[vehicleId])
        .filter((p): p is number => typeof p === 'number');

    if (!localPrices.length || !intercityPrices.length) return null;

    return {
        low: Math.min(...localPrices),
        high: Math.max(...intercityPrices),
    };
}

/** Formats a range as "200–450". Returns an empty string if range is null. */
export function formatPriceRange(range: VehiclePriceRange | null): string {
    if (!range) return '';
    return `${range.low}–${range.high}`;
}

/** Full per-route price for a specific vehicle, for the pricing guide's route table. */
export function getRoutePrice(routeName: string, vehicleId: string): number | null {
    const route = ROUTES.find((r) => r.name === routeName);
    const price = route?.customRates?.[vehicleId];
    return typeof price === 'number' ? price : null;
}

export { ROUTES };
