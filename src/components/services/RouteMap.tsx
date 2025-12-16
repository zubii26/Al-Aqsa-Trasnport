'use client';

import React from 'react';
import { MapPin, Clock, ArrowRight } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

const routes = [
    {
        id: 'jed-mak',
        from: 'Jeddah Airport',
        to: 'Makkah Hotel',
        time: '1 hr 30 min',
        distance: '100 km',
        color: 'from-blue-500 to-blue-600'
    },
    {
        id: 'mak-mad',
        from: 'Makkah Hotel',
        to: 'Madinah Hotel',
        time: '4 hrs 30 min',
        distance: '450 km',
        color: 'from-amber-500 to-amber-600'
    },
    {
        id: 'jed-mad',
        from: 'Jeddah Airport',
        to: 'Madinah Hotel',
        time: '4 hrs',
        distance: '400 km',
        color: 'from-emerald-500 to-emerald-600'
    }
];

export default function RouteMap() {
    return (
        <div className="py-12">
            <h3 className="text-2xl font-bold font-playfair text-center mb-10">Popular Routes Network</h3>

            <div className="relative max-w-3xl mx-auto">
                {/* Vertical Line for mobile / Horizontal for desktop could be complex, keeping it vertical stack for now effectively */}
                <div className="space-y-6">
                    {routes.map((route, index) => (
                        <FadeIn key={route.id} delay={index * 0.1}>
                            <div className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-700 overflow-hidden">
                                {/* Decorator Bar */}
                                <div className={`absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b ${route.color}`} />

                                <div className="flex flex-col md:flex-row items-center justify-between gap-6 pl-4">
                                    {/* Origin */}
                                    <div className="flex items-center gap-3 w-full md:w-1/3">
                                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500">
                                            <MapPin size={20} />
                                        </div>
                                        <span className="font-bold text-lg">{route.from}</span>
                                    </div>

                                    {/* Connector Visual */}
                                    <div className="flex flex-col items-center justify-center w-full md:w-1/3 gap-1">
                                        <div className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                            <Clock size={12} /> {route.time}
                                        </div>
                                        <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full relative overflow-hidden">
                                            <div className={`absolute inset-0 bg-gradient-to-r ${route.color} opacity-30 group-hover:opacity-100 transition-opacity duration-500`} />
                                            {/* Animated dot */}
                                            <div className={`absolute top-0 bottom-0 w-8 bg-gradient-to-r ${route.color} blur-md animate-shimmer`} style={{ animationDuration: '2s' }} />
                                        </div>
                                        <div className="text-xs text-muted-foreground">{route.distance}</div>
                                    </div>

                                    {/* Destination */}
                                    <div className="flex items-center gap-3 w-full md:w-1/3 justify-end md:flex-row-reverse">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
                                            <MapPin size={20} />
                                        </div>
                                        <span className="font-bold text-lg text-right">{route.to}</span>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>

                {/* Visual Connectors could be added here for a 'map' feel, but the list is cleaner and mobile friendly */}
            </div>
        </div>
    );
}
