'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, Building2, Navigation } from 'lucide-react';
import { TOP_HOTELS_MAKKAH, TOP_HOTELS_MADINAH, MAKKAH_DISTRICTS, MADINAH_DISTRICTS } from '@/data/seo-keywords';

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
                            <Link href="/services/hotel-transfers" className="hover:text-secondary hover:underline transition-colors">
                                Taxi to {hotel}
                            </Link>
                        </li>
                    ))}
                    <li className="mt-2 text-xs font-semibold text-secondary cursor-pointer hover:underline">
                        View all 50+ Makkah Hotels &rarr;
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
                            <Link href="/services/hotel-transfers" className="hover:text-secondary hover:underline transition-colors">
                                Transfer to {hotel}
                            </Link>
                        </li>
                    ))}
                    <li className="mt-2 text-xs font-semibold text-secondary cursor-pointer hover:underline">
                        View all 40+ Madinah Hotels &rarr;
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
                        <Link
                            key={district}
                            href="/services"
                            className="bg-muted/50 hover:bg-secondary/10 hover:text-secondary text-xs px-2 py-1 rounded transition-colors"
                        >
                            {district}
                        </Link>
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
                        <Link
                            key={district}
                            href="/services"
                            className="bg-muted/50 hover:bg-secondary/10 hover:text-secondary text-xs px-2 py-1 rounded transition-colors"
                        >
                            {district}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
