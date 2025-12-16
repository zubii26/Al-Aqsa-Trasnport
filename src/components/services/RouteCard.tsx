'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, ArrowRight, Bus, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface RouteCardProps {
    from: string;
    to: string;
    duration: string;
    distance: string;
    price?: number;
    delay?: number;
    color?: string;
}

export default function RouteCard({
    from,
    to,
    duration,
    distance,
    price,
    delay = 0,
    color = "amber"
}: RouteCardProps) {

    // Determine color styles
    const colorStyles = color === 'blue'
        ? { text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-200 dark:border-blue-800' }
        : color === 'emerald'
            ? { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-200 dark:border-emerald-800' }
            : { text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-200 dark:border-amber-800' };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay }}
            className="group block relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <Link href={`/booking?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&service=transfer`} className="block p-6">

                {/* Header: Locations */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    {/* Origin */}
                    <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full ${colorStyles.bg} flex items-center justify-center shrink-0`}>
                            <MapPin className={colorStyles.text} size={20} />
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">From</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{from}</h3>
                        </div>
                    </div>

                    {/* Animated Connector (Simple) */}
                    <div className="hidden md:flex flex-col items-center justify-center w-32 relative">
                        <div className="w-full h-[2px] bg-slate-100 dark:bg-slate-800 rounded-full relative overflow-hidden">
                            <motion.div
                                className={`absolute inset-0 bg-current ${colorStyles.text}`}
                                initial={{ x: '-100%' }}
                                whileInView={{ x: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                style={{ opacity: 0.3 }}
                            />
                        </div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-slate-900 px-2 text-xs font-medium text-muted-foreground flex flex-col items-center`}>
                            <span className="whitespace-nowrap">{distance}</span>
                        </div>
                    </div>

                    {/* Destination */}
                    <div className="flex items-center gap-4 flex-1 md:justify-end">
                        <div className="md:text-right order-2 md:order-1">
                            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">To</span>
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{to}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 order-1 md:order-2 group-hover:bg-amber-500 group-hover:text-white transition-colors duration-300`}>
                            <MapPin size={20} className="text-slate-400 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>

                {/* Footer: Details & CTA */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock size={16} className="text-amber-500" />
                            <span>{duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground md:hidden">
                            <ArrowRight size={16} className="text-amber-500" />
                            <span>{distance}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {price && (
                            <div className="text-right">
                                <span className="block text-xs text-muted-foreground">Starting from</span>
                                <span className="font-bold text-lg text-emerald-600 dark:text-emerald-500">{price} SAR</span>
                            </div>
                        )}
                        <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                            <ChevronRight size={20} />
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}
