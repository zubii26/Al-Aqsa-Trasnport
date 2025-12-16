'use client';

import React, { useState } from 'react';
import { RouteWithPrices } from '@/services/routeService';
import AirportStylizedCanvas from './AirportStylizedCanvas';
import AirportRouteSidebar from './AirportRouteSidebar';
import MobileRouteDropdown from '../intercity/MobileRouteDropdown';
import FloatingRoutePanel from '../intercity/FloatingRoutePanel'; // Reusing generic panel
import { AnimatePresence } from 'framer-motion';

interface AirportInteractiveMapProps {
    routes: RouteWithPrices[];
}

export default function AirportInteractiveMap({ routes }: AirportInteractiveMapProps) {
    // Default to first route or specific relevant route like "Jeddah Airport -> Makkah"
    const [activeRouteId, setActiveRouteId] = useState<string | null>(routes.length > 0 ? routes[0].id : null);
    const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

    const activeRoute = routes.find(r => r.id === activeRouteId) || null;

    return (
        <section className="relative w-full bg-slate-950 flex flex-col lg:flex-row overflow-hidden lg:h-[85vh] lg:min-h-[600px]">
            {/* Mobile: Route Dropdown (Top) */}
            <div className="lg:hidden shrink-0 z-30">
                <MobileRouteDropdown
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={setActiveRouteId}
                />
            </div>

            {/* Desktop: Sidebar (Left) */}
            <div className="hidden lg:block h-full z-20 shrink-0 relative">
                <AirportRouteSidebar
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={setActiveRouteId}
                    onHoverRoute={setHoveredRouteId}
                />
            </div>

            {/* Map Canvas Area */}
            <div className="relative flex-1 w-full bg-slate-950 overflow-hidden flex flex-col lg:block">
                {/* Map Container */}
                <div className="h-[400px] lg:h-full w-full relative">
                    <AirportStylizedCanvas
                        routes={routes}
                        activeRouteId={activeRouteId}
                        hoveredRouteId={hoveredRouteId}
                        onSelectRoute={setActiveRouteId}
                    />

                    {/* Desktop Floating Panel */}
                    <div className="hidden lg:block absolute top-6 right-6 z-20 w-80 pointer-events-none">
                        <AnimatePresence mode='wait'>
                            {activeRoute && (
                                <div className="pointer-events-auto">
                                    <FloatingRoutePanel route={activeRoute} />
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Static Panel */}
                <div className="lg:hidden p-4 bg-slate-900 border-t border-slate-800 relative z-20">
                    <AnimatePresence mode='wait'>
                        {activeRoute && (
                            <FloatingRoutePanel route={activeRoute} />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
