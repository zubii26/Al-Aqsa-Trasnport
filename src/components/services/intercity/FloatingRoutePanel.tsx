'use client';

import React from 'react';
import { RouteWithPrices } from '@/services/routeService';
import { motion } from 'framer-motion';
import { Clock, Navigation, ArrowRight, Star, ShieldCheck, UserCheck } from 'lucide-react';
import Link from 'next/link';
import GlassButton from '@/components/ui/GlassButton';

interface FloatingRoutePanelProps {
    route: RouteWithPrices;
}

export default function FloatingRoutePanel({ route }: FloatingRoutePanelProps) {
    const price = route.prices && route.prices.length > 0 ? route.prices[0].price : null;

    return (
        <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-6 w-full"
        >
            <div className="mb-4">
                <span className="text-amber-500 text-xs font-bold uppercase tracking-wider mb-1 block">Selected Detail</span>
                <h3 className="text-xl font-bold font-playfair leading-tight text-slate-900 dark:text-white">
                    {route.origin} <span className="text-muted-foreground font-normal mx-1">to</span> {route.destination}
                </h3>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> Duration</span>
                    <span className="font-bold text-slate-900 dark:text-white">{route.duration || '--'}</span>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex flex-col gap-1">
                    <span className="text-xs text-muted-foreground flex items-center gap-1"><Navigation size={12} /> Distance</span>
                    <span className="font-bold text-slate-900 dark:text-white">{route.distance || '--'}</span>
                </div>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <ShieldCheck size={16} className="text-emerald-500" />
                    <span>Hijrah Road Certified</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Star size={16} className="text-amber-500" />
                    <span>VIP Fleet Service</span>
                </div>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
                <Link href={`/booking?from=${encodeURIComponent(route.origin)}&to=${encodeURIComponent(route.destination)}&service=transfer`}>
                    <GlassButton variant="primary" className="w-full justify-center text-sm bg-amber-500 hover:bg-amber-600 text-slate-900 border-none">
                        Book Now {price && <span className="ml-1 opacity-90">({price} SAR)</span>} <ArrowRight size={16} className="ml-2" />
                    </GlassButton>
                </Link>
            </div>
        </motion.div>
    );
}
