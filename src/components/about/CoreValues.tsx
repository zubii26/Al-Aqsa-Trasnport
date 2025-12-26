'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Shield, Clock, HeartHandshake, Moon } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function CoreValues() {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

    const values = [
        {
            id: 'safety',
            icon: Shield,
            title: 'Safety First',
            desc: 'We prioritize the safety of our passengers above all else, ensuring well-maintained vehicles and rigorously trained drivers for your peace of mind.'
        },
        {
            id: 'reliability',
            icon: Clock,
            title: 'Reliability',
            desc: 'Punctuality is our promise. We understand the value of your time during Umrah and ensure you reach every destination comfortably and on schedule.'
        },
        {
            id: 'hospitality',
            icon: HeartHandshake,
            title: 'Hospitality',
            desc: 'We treat every pilgrim as an honored guest of Allah, serving with genuine kindness, deep respect, and infinite patience throughout your journey.'
        },
        {
            id: 'spiritual',
            icon: Moon,
            title: 'Spiritual Focus',
            desc: 'We respect the sacred nature of your travel. Our service is designed to maintain a peaceful environment so you can focus on your worship.'
        },
    ];

    return (
        <section className="py-20 md:py-32 bg-slate-50 dark:bg-slate-900" ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className={`text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair transition-all duration-700 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        Our Core Values
                    </h2>
                    <p className={`text-lg text-slate-600 dark:text-slate-300 transition-all duration-700 delay-100 ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        The guiding principles that define our service to the Guests of Allah.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {values.map((value, index) => (
                        <GlassCard
                            key={value.id}
                            className={`p-8 h-full flex flex-col items-center text-center transition-all duration-700 hover:-translate-y-2 hover:shadow-xl border-t-4 border-t-amber-500`}
                            delay={index * 0.1}
                        >
                            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <value.icon size={32} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{value.title}</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">{value.desc}</p>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
