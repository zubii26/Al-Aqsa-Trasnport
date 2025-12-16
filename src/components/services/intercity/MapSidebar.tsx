'use client';

import React, { useState } from 'react';
import { RouteWithPrices } from '@/services/routeService';
import { ArrowRight, ChevronDown, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MapSidebarProps {
    routes: RouteWithPrices[];
    activeRouteId: string | null;
    onSelectRoute: (id: string) => void;
    onHoverRoute: (id: string | null) => void;
}

export default function MapSidebar({ routes, activeRouteId, onSelectRoute, onHoverRoute }: MapSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Find active route label for headers
    const activeRoute = routes.find(r => r.id === activeRouteId);

    const toggleOpen = () => setIsOpen(!isOpen);

    const RouteList = ({ isMobile = false }) => (
        <div className={`space-y-4 ${isMobile ? 'p-4' : ''}`}>
            {routes.map((route, i) => {
                const isActive = route.id === activeRouteId;
                return (
                    <motion.button
                        key={route.id || i}
                        onClick={(e) => {
                            if (isMobile) {
                                e.stopPropagation();
                                onSelectRoute(route.id);
                                setIsOpen(false);
                            } else {
                                onSelectRoute(route.id);
                            }
                        }}
                        onMouseEnter={() => !isMobile && onHoverRoute(route.id)}
                        onMouseLeave={() => !isMobile && onHoverRoute(null)}
                        className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${isActive
                                ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500 shadow-xl transform scale-[1.02] z-10'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700 hover:shadow-lg scale-100'
                            }`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        {isActive && (
                            <motion.div
                                layoutId="activeGlow"
                                className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent pointer-events-none"
                            />
                        )}

                        <div className="relative z-10 space-y-4">
                            {/* Header: Locations */}
                            <div className="flex items-start justify-between gap-3">
                                <div className="space-y-4 w-full">
                                    {/* Origin */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isActive ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                                            <div className="w-2 h-2 bg-current rounded-full" />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block leading-none mb-1">From</span>
                                            <span className={`font-bold leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {route.origin}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    <div className="pl-4 -my-2">
                                        <div className="w-[2px] h-6 bg-slate-200 dark:bg-slate-700 mx-auto border-l-2 border-dashed border-slate-300 dark:border-slate-600" />
                                    </div>

                                    {/* Destination */}
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-amber-500 bg-white' : 'border-slate-200 dark:border-slate-700 bg-transparent'}`}>
                                            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block leading-none mb-1">To</span>
                                            <span className={`font-bold leading-tight ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                                {route.destination}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Price & Action */}
                                <div className="flex flex-col items-end justify-between self-stretch pt-1">
                                    {route.prices && route.prices.length > 0 && (
                                        <div className="text-right">
                                            <span className="text-[10px] text-muted-foreground block">Starting</span>
                                            <span className={`font-bold text-lg ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>
                                                {route.prices[0].price} <span className="text-[10px]">SAR</span>
                                            </span>
                                        </div>
                                    )}
                                    <div className={`mt-auto w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-amber-500 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:bg-amber-500 group-hover:text-white'}`}>
                                        <ArrowRight size={16} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );

    return (
        <div className="flex flex-col w-full bg-white dark:bg-slate-900 shadow-xl border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800 lg:h-full">

            {/* Mobile/Tablet Header */}
            <div
                className="lg:hidden p-4 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 z-20 sticky top-0 flex items-center justify-between cursor-pointer"
                onClick={toggleOpen}
            >
                <div className="flex-1 min-w-0 mr-4">
                    <span className="text-amber-600 dark:text-amber-500 text-[10px] font-bold uppercase tracking-wider block mb-0.5">Route Explorer</span>
                    <h2 className="text-base font-bold font-playfair text-slate-900 dark:text-white truncate">
                        {activeRoute ? `${activeRoute.origin} - ${activeRoute.destination}` : 'Select Journey'}
                    </h2>
                </div>

                <div className="flex items-center gap-3">
                    {/* Mobile Book Button */}
                    {activeRoute && (
                        <a
                            href={`/booking?from=${encodeURIComponent(activeRoute.origin)}&to=${encodeURIComponent(activeRoute.destination)}&service=transfer`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-md transition-colors whitespace-nowrap"
                        >
                            Book {activeRoute.prices?.[0]?.price} SAR
                        </a>
                    )}

                    <div className={`p-2 rounded-full bg-slate-100 dark:bg-slate-800 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                        <ChevronDown size={18} className="text-slate-600 dark:text-slate-400" />
                    </div>
                </div>
            </div>

            {/* Desktop Header */}
            <div className="hidden lg:block p-6 border-b border-slate-100 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">Route Explorer</h3>
                <h2 className="text-2xl font-bold font-playfair text-slate-900 dark:text-white">Select Your Journey</h2>
                <p className="text-sm text-slate-500 mt-2">Choose a route to view details on the map.</p>
            </div>

            {/* Mobile List (Collapsible) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="lg:hidden flex-1 overflow-y-auto custom-scrollbar"
                    >
                        <RouteList isMobile={true} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Desktop List (Always Visible) */}
            <div className="hidden lg:block flex-1 overflow-y-auto custom-scrollbar p-4 pr-2">
                <RouteList isMobile={false} />
            </div>
        </div>
    );
}
