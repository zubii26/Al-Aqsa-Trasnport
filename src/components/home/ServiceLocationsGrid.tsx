'use client';

import React from 'react';
import { MapPin, Building2 } from 'lucide-react';
import { TOP_HOTELS_MAKKAH, TOP_HOTELS_MADINAH, MAKKAH_DISTRICTS, MADINAH_DISTRICTS } from '@/data/seo-keywords';

// NOTE: Hotel and district items are plain text spans — not links.
// Previously these rendered ~40 anchor tags resolving to only 2 destination URLs,
// which search engines read as internal link manipulation. Text content is preserved.
export default function ServiceLocationsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-8 border-t border-border/50">
            {/* Makkah Hotels */}
            <div>
                <h4 className="flex items-center gap-2 font-bold mb-4 text-primary dark:text-white">
                    <Building2 size={18} className="text-secondary" />
                    Top Makkah Hotels Served
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {TOP_HOTELS_MAKKAH.slice(0, 10).map((hotel) => (
                        <li key={hotel}>
                            <span>Taxi to {hotel}</span>
                        </li>
                    ))}
                    <li className="mt-2 text-xs font-semibold text-secondary">
                        And 50+ more Makkah hotels
                    </li>
                </ul>
            </div>

            {/* Madinah Hotels */}
            <div>
                <h4 className="flex items-center gap-2 font-bold mb-4 text-primary dark:text-white">
                    <Building2 size={18} className="text-secondary" />
                    Top Madinah Hotels Served
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                    {TOP_HOTELS_MADINAH.slice(0, 10).map((hotel) => (
                        <li key={hotel}>
                            <span>Transfer to {hotel}</span>
                        </li>
                    ))}
                    <li className="mt-2 text-xs font-semibold text-secondary">
                        And 40+ more Madinah hotels
                    </li>
                </ul>
            </div>

            {/* Makkah Districts */}
            <div>
                <h4 className="flex items-center gap-2 font-bold mb-4 text-primary dark:text-white">
                    <MapPin size={18} className="text-secondary" />
                    Makkah Districts Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                    {MAKKAH_DISTRICTS.map((district) => (
                        <span
                            key={district}
                            className="bg-muted/50 text-xs px-2 py-1 rounded text-muted-foreground"
                        >
                            {district}
                        </span>
                    ))}
                </div>
            </div>

            {/* Madinah Districts */}
            <div>
                <h4 className="flex items-center gap-2 font-bold mb-4 text-primary dark:text-white">
                    <MapPin size={18} className="text-secondary" />
                    Madinah Zones Covered
                </h4>
                <div className="flex flex-wrap gap-2">
                    {MADINAH_DISTRICTS.map((district) => (
                        <span
                            key={district}
                            className="bg-muted/50 text-xs px-2 py-1 rounded text-muted-foreground"
                        >
                            {district}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
