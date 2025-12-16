'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteWithPrices } from '@/services/routeService';
import RouteSidebar from './RouteSidebar';
import StylizedMapCanvas from './StylizedMapCanvas';
import FloatingRoutePanel from './FloatingRoutePanel';
import MobileRouteDropdown from './MobileRouteDropdown';

interface InteractiveMapSectionProps {
    routes: RouteWithPrices[];
}

export default function InteractiveMapSection({ routes }: InteractiveMapSectionProps) {
    const [activeRouteId, setActiveRouteId] = useState<string | null>(routes.length > 0 ? routes[0].id : null);
    const [hoveredRouteId, setHoveredRouteId] = useState<string | null>(null);

    const activeRoute = routes.find(r => r.id === activeRouteId) || null;

    return (
        <section className="relative w-full bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row overflow-hidden lg:h-[85vh] lg:min-h-[600px]">

            {/* Mobile: Route Dropdown (Top) */}
            <div className="lg:hidden shrink-0">
                <MobileRouteDropdown
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={setActiveRouteId}
                />
            </div>

            {/* Desktop: Sidebar (Left) */}
            <div className="hidden lg:block h-full z-20 shadow-xl shrink-0 relative w-80">
                <RouteSidebar
                    routes={routes}
                    activeRouteId={activeRouteId}
                    onSelectRoute={setActiveRouteId}
                    onHoverRoute={setHoveredRouteId}
                />
            </div>

            {/* Map Canvas Area (Center Flex Grow) */}
            <div className="relative flex-1 w-full bg-slate-100 dark:bg-slate-950 overflow-hidden flex flex-col lg:block shadow-inner z-10">

                {/* Map Container */}
                <div className="h-[400px] lg:h-full w-full relative">
                    <StylizedMapCanvas
                        routes={routes}
                        activeRouteId={activeRouteId}
                        hoveredRouteId={hoveredRouteId}
                        onSelectRoute={setActiveRouteId}
                    />
                </div>

                {/* Mobile: Static Details Card (Bottom) */}
                <div className="lg:hidden p-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                    <AnimatePresence mode='wait'>
                        {activeRoute && (
                            <FloatingRoutePanel route={activeRoute} />
                        )}
                    </AnimatePresence>
                </div>

                {/* Mobile Only Overlay Gradient */}
                <div className="lg:hidden absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/5 to-transparent pointer-events-none z-10" />
            </div>

            {/* Desktop: Details Panel (Right Sidebar) */}
            <div className="hidden lg:flex w-96 shrink-0 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex-col relative z-20 shadow-xl">
                <div className="p-6 flex-1 overflow-y-auto">
                    <AnimatePresence mode='wait'>
                        {activeRoute ? (
                            <FloatingRoutePanel route={activeRoute} />
                        ) : (
                            <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
                                Select a route to view details
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
