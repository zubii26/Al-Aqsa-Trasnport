'use client';

import React from 'react';
import { Target, Eye } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function MissionVision() {

    return (
        <section className="py-20 bg-gradient-to-b from-white to-amber-50 dark:from-slate-900 dark:to-slate-950">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">

                    {/* Mission */}
                    <FadeIn animate direction="up" className="h-full">
                        <div
                            className="h-full bg-white dark:bg-slate-900 p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800"
                        >
                            <div className="w-16 h-16 bg-secondary/20 dark:bg-secondary/30 text-secondary dark:text-secondary rounded-2xl flex items-center justify-center mb-6">
                                <Target size={32} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4 ">Our Mission</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                                To provide safe, reliable, and spiritually enriching transport services for pilgrims, honoring the sanctity of their journey. We strive to ensure every mile traveled is filled with comfort, peace of mind, and the highest standards of hospitality.
                            </p>
                        </div>
                    </FadeIn>

                    {/* Vision */}
                    <FadeIn animate direction="up" delay={0.2} className="h-full">
                        <div
                            className="h-full bg-slate-900 dark:bg-slate-800 text-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-800 dark:border-slate-700"
                        >
                            <div className="w-16 h-16 bg-white/10 text-amber-400 rounded-2xl flex items-center justify-center mb-6">
                                <Eye size={32} strokeWidth={1.5} />
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-4 ">Our Vision</h2>
                            <p className="text-lg text-slate-300 leading-relaxed">
                                To be the most trusted and preferred transport partner for Hajj and Umrah pilgrims worldwide, setting the global benchmark for excellence in logistics, customer care, and spiritual tourism.
                            </p>
                        </div>
                    </FadeIn>

                </div>
            </div>
        </section>
    );
}
