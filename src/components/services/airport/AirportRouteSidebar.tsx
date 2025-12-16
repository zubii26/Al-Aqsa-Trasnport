'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { RouteWithPrices } from '@/services/routeService';
import { Plane, ChevronRight, Clock } from 'lucide-react';

interface AirportRouteSidebarProps {
    routes: RouteWithPrices[];
    activeRouteId: string | null;
    onSelectRoute: (id: string) => void;
    onHoverRoute: (id: string | null) => void;
}

export default function AirportRouteSidebar({ routes, activeRouteId, onSelectRoute, onHoverRoute }: AirportRouteSidebarProps) {
    return (
        <div className="flex flex-col h-full w-96 bg-slate-950 border-r border-slate-800 shadow-2xl z-20">
            {/* Header */}
            <div className="p-6 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                        <Plane className="text-amber-500" size={20} />
                    </div>
                    <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Airport Transfer</span>
                </div>
                <h2 className="text-2xl font-bold font-playfair text-white">Select Destination</h2>
                <p className="text-slate-400 text-sm mt-1">Reliable pickups from KAIA Airport</p>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {routes.map((route) => {
                    const isActive = activeRouteId === route.id;
                    return (
                        <motion.div
                            key={route.id}
                            onClick={() => onSelectRoute(route.id)}
                            onMouseEnter={() => onHoverRoute(route.id)}
                            onMouseLeave={() => onHoverRoute(null)}
                            className={`
                                group relative p-4 rounded-xl cursor-pointer transition-all duration-300 border
                                ${isActive
                                    ? 'bg-amber-950/20 border-amber-500/50 shadow-lg'
                                    : 'bg-slate-900/50 border-transparent hover:bg-slate-900 hover:border-slate-700'}
                            `}
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        <span className="text-[10px] font-bold text-slate-400 uppercase">Available</span>
                                    </div>
                                    <h3 className={`font-bold text-lg mb-1 ${isActive ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                                        {route.destination}
                                    </h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-2">
                                        <Clock size={12} /> {route.duration} • {route.distance}
                                    </p>
                                </div>
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center transition-colors
                                    ${isActive ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'}
                                `}>
                                    <ChevronRight size={16} />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-500 rounded-full"></span> Flight Tracking Included</span>
                </div>
            </div>
        </div>
    );
}
