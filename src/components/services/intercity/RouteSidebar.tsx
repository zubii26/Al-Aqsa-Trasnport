'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RouteWithPrices } from '@/services/routeService';
import { Search, MapPin, ChevronRight, Clock, Navigation } from 'lucide-react';
import GlassButton from '@/components/ui/GlassButton';

interface RouteSidebarProps {
    routes: RouteWithPrices[];
    activeRouteId: string | null;
    onSelectRoute: (id: string) => void;
    onHoverRoute: (id: string | null) => void;
}

export default function RouteSidebar({ routes, activeRouteId, onSelectRoute, onHoverRoute }: RouteSidebarProps) {
    return (
        <motion.div
            className="hidden lg:flex flex-col h-full w-96 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-r border-slate-200 dark:border-slate-800 shadow-2xl relative z-20"
            initial={{ x: -384, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
                <div className="mb-4">
                    <span className="text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-wider mb-2 block">
                        Network Explorer
                    </span>
                    <h2 className="text-2xl font-bold font-playfair text-slate-900 dark:text-white">
                        Intercity Routes
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                        Select a route to view details and pricing.
                    </p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" size={18} />
                    <input
                        type="text"
                        placeholder="Search cities..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800/50 border-none rounded-xl focus:ring-2 focus:ring-amber-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm transition-all"
                    />
                </div>
            </div>

            {/* Route List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 custom-scrollbar">
                {routes.map((route, i) => {
                    const isActive = activeRouteId === route.id;
                    return (
                        <motion.div
                            key={route.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => onSelectRoute(route.id)}
                            onMouseEnter={() => onHoverRoute(route.id)}
                            onMouseLeave={() => onHoverRoute(null)}
                            className={`
                                group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border
                                ${isActive
                                    ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50 shadow-md'
                                    : 'bg-white dark:bg-slate-900/50 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-slate-200 dark:hover:border-slate-800'
                                }
                            `}
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`p-1.5 rounded-full ${isActive ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                            <MapPin size={14} />
                                        </div>
                                        <span className={`text-xs font-semibold uppercase tracking-wider ${isActive ? 'text-amber-700 dark:text-amber-400' : 'text-slate-500 dark:text-slate-500'}`}>
                                            Route {i + 1}
                                        </span>
                                    </div>

                                    <h3 className={`text-lg font-semibold font-playfair mb-1 ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                                        {route.origin.split(' ')[0]}
                                        <span className="mx-2 text-slate-400">→</span>
                                        {route.destination.split(' ')[0]}
                                    </h3>

                                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mt-2">
                                        <span className="flex items-center gap-1">
                                            <Clock size={12} /> {route.duration}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Navigation size={12} /> {route.distance}
                                        </span>
                                    </div>
                                </div>

                                <div className={`mt-2 ${isActive ? 'text-amber-500' : 'text-slate-300 group-hover:text-amber-400'} transition-colors`}>
                                    <ChevronRight size={18} />
                                </div>
                            </div>

                            {/* Active Indicator Line */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeIndicator"
                                    className="absolute left-0 top-4 bottom-4 w-1 bg-amber-500 rounded-r-full"
                                />
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer / CTA */}
            <div className="p-4 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
                <p>Select a route to view interactive details</p>
            </div>
        </motion.div>
    );
}
