'use client';

import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Users, MapPin, Star, Calendar } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isIntersecting && !hasAnimated) {
            setTimeout(() => setHasAnimated(true), 0);
            let startTime: number | null = null;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [isIntersecting, end, duration, hasAnimated]);

    return <span ref={ref as unknown as React.RefObject<HTMLElement>}>{count.toLocaleString()}+</span>;
};

export default function ImpactStats() {

    const stats = [
        { id: 'pilgrims', icon: Users, value: 50000, label: 'Happy Pilgrims' },
        { id: 'trips', icon: MapPin, value: 10000, label: 'Trips Completed' },
        { id: 'reviews', icon: Star, value: 5, label: '5-Star Reviews' }, // Special handling for 5.0
        { id: 'years', icon: Calendar, value: 10, label: 'Years of Service' },
    ];

    return (
        <section className="py-16 md:py-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50 to-white dark:from-slate-900 dark:to-slate-950 -z-10" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-200/20 dark:bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                    {stats.map((stat, index) => (
                        <GlassCard
                            key={stat.id}
                            delay={index * 0.1}
                            className="flex flex-col items-center justify-center text-center p-8 group hover:border-amber-500/30 transition-colors duration-500"
                        >
                            <div className="mb-4 text-amber-600 dark:text-amber-500 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-full group-hover:scale-110 transition-transform duration-300">
                                <stat.icon size={32} strokeWidth={1.5} />
                            </div>
                            <div className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 mb-2 font-outfit">
                                {stat.id === 'reviews' ? '5.0' : <Counter end={stat.value} />}
                            </div>
                            <div className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium uppercase tracking-wide">
                                {stat.label}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
