'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <section className="py-20 bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-950" ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Mission */}
                    <div
                        className={`bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 transition-all duration-700 transform ${isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    >
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 rounded-2xl flex items-center justify-center mb-6">
                            <Target size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 font-playfair">Our Mission</h2>
                        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                            To provide safe, reliable, and spiritually enriching transport services for pilgrims, honoring the sanctity of their journey. We strive to ensure every mile traveled is filled with comfort, peace of mind, and the highest standards of hospitality.
                        </p>
                    </div>

                    {/* Vision */}
                    <div
                        className={`bg-slate-900 dark:bg-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-800 dark:border-slate-700 transition-all duration-700 delay-200 transform ${isIntersecting ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'}`}
                    >
                        <div className="w-16 h-16 bg-white/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                            <Eye size={32} strokeWidth={1.5} />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4 font-playfair">Our Vision</h2>
                        <p className="text-lg text-slate-300 leading-relaxed">
                            To be the most trusted and preferred transport partner for Hajj and Umrah pilgrims worldwide, setting the global benchmark for excellence in logistics, customer care, and spiritual tourism.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    );
}
