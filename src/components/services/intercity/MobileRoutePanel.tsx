'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { RouteWithPrices } from '@/services/routeService';
import { ChevronUp, Clock, Navigation, ArrowRight, X } from 'lucide-react';
import GlassButton from '@/components/ui/GlassButton';
import Link from 'next/link';

interface MobileRoutePanelProps {
    route: RouteWithPrices | null;
    onClose: () => void;
}

export default function MobileRoutePanel({ route, onClose }: MobileRoutePanelProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // If no route, show nothing
    if (!route) return null;

    const price = route.prices && route.prices.length > 0 ? route.prices[0].price : null;

    return (
        <motion.div
            className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-slate-900 rounded-t-[2rem] shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.2)] border-t border-slate-200 dark:border-slate-800 lg:hidden"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
                if (info.offset.y > 100) {
                    onClose(); // Close on drag down
                } else if (info.offset.y < -50) {
                    setIsExpanded(true); // Expand on drag up
                }
            }}
        >
            {/* Handle for dragging */}
            <div className="w-full flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full" />
            </div>

            <div className="px-6 pb-6 pt-2">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-amber-500 text-[10px] font-bold uppercase tracking-wider">SELECTED ROUTE</span>
                        <h3 className="text-xl font-bold font-playfair text-slate-900 dark:text-white leading-tight">
                            {route.origin} <span className="text-slate-400 text-sm">to</span> {route.destination}
                        </h3>
                    </div>
                    {/* Close Button */}
                    <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Quick Stats */}
                <div className="flex gap-4 mb-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                        <Clock size={14} className="text-amber-500" />
                        <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg">
                        <Navigation size={14} className="text-blue-500" />
                        <span>{route.distance}</span>
                    </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center gap-4">
                    <div className="flex-1">
                        <span className="text-xs text-muted-foreground block">Starting from</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white text-emerald-600 dark:text-emerald-500">{price || '--'}</span>
                            <span className="text-sm font-medium text-muted-foreground">SAR</span>
                        </div>
                    </div>
                    <Link href={`/booking?from=${encodeURIComponent(route.origin)}&to=${encodeURIComponent(route.destination)}&service=transfer`} className="flex-1">
                        <GlassButton variant="primary" className="w-full justify-center bg-amber-500 hover:bg-amber-600 text-slate-900 border-none">
                            Book Now <ArrowRight size={16} className="ml-2" />
                        </GlassButton>
                    </Link>
                </div>
            </div>
        </motion.div>
    );
}
