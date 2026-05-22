import { Route } from '@/lib/pricing';

export const splitRouteName = (name: string): [string, string] => {
    if (!name) return ['', ''];
    // Handle arrows, "to", or other common delimiters
    const parts = name.split(/\s*(?:->|to|\u2192|\u2194)\s*/i);
    return [parts[0]?.trim() || '', parts[1]?.trim() || ''];
};

/** Get origin (pickup) from a route — prefer explicit field, fall back to name parsing */
export const getRouteOrigin = (r: Route): string => r.origin || splitRouteName(r.name)[0] || r.name;

/** Get destination (dropoff) from a route — prefer explicit field, fall back to name parsing */
export const getRouteDestination = (r: Route): string => r.destination || splitRouteName(r.name)[1] || '';
