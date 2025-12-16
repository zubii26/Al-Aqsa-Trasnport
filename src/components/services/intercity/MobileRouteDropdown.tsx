import React from 'react';
import { RouteWithPrices } from '@/services/routeService';
import { ChevronDown, MapPin } from 'lucide-react';

interface MobileRouteDropdownProps {
    routes: RouteWithPrices[];
    activeRouteId: string | null;
    onSelectRoute: (id: string) => void;
}

export default function MobileRouteDropdown({ routes, activeRouteId, onSelectRoute }: MobileRouteDropdownProps) {
    return (
        <div className="relative w-full px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 lg:hidden z-30 shadow-sm">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Select Route</label>
            <div className="relative">
                <select
                    className="w-full appearance-none bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-3 pl-10 pr-10 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 font-bold font-playfair text-lg"
                    value={activeRouteId || ''}
                    onChange={(e) => onSelectRoute(e.target.value)}
                >
                    {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                            {route.origin} to {route.destination}
                        </option>
                    ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-amber-500">
                    <MapPin size={20} />
                </div>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <ChevronDown size={20} />
                </div>
            </div>
        </div>
    );
}
