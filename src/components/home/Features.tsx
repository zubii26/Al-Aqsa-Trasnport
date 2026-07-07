'use client';

import React from 'react';
import { Shield, Clock, Heart, Banknote, Navigation, Car } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const FEATURES = [
    {
        id: 'licensed',
        icon: Shield,
        title: 'Licensed Transport',
        titleAr: 'نقل مرخص',
        description: 'Officially licensed by the Ministry of Transport for safe Makkah and Madinah travel.'
    },
    {
        id: 'professional',
        icon: Navigation,
        title: 'Professional Drivers',
        titleAr: 'سائقون محترفون',
        description: 'Expert, bilingual chauffeurs familiar with all Holy City routes and hotels.'
    },
    {
        id: 'pricing',
        icon: Banknote,
        title: 'Fixed Pricing',
        titleAr: 'أسعار ثابتة',
        description: 'Transparent rates with no hidden fees, toll charges, or surge pricing.'
    },
    {
        id: 'flight',
        icon: Clock,
        title: 'Flight Monitoring',
        titleAr: 'متابعة الرحلات',
        description: 'We track your Jeddah/Madinah arrival to ensure punctual pickups, even if delayed.'
    },
    {
        id: 'support',
        icon: Heart,
        title: '24/7 Support',
        titleAr: 'دعم على مدار الساعة',
        description: 'Round-the-clock customer service via WhatsApp for your peace of mind.'
    },
    {
        id: 'luxury',
        icon: Car,
        title: 'Luxury Fleet',
        titleAr: 'أسطول فاخر',
        description: 'Premium GMC Yukons, Hyundai Starias, and spacious vans for ultimate comfort.'
    }
];

export default function Features() {
    return (
        <section className="py-20 bg-white dark:bg-[#0B1221]">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <span className="text-primary font-bold tracking-wider uppercase text-sm mb-3 block">Why Choose Us</span>
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        The Al Aqsa Promise
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        We combine spiritual understanding with logistical excellence to provide a seamless journey for the Guests of Allah.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURES.map((feature) => (
                        <div key={feature.id} className="h-full">
                            <GlassCard className="h-full p-8 text-center lg:hover:bg-slate-50 dark:lg:hover:bg-slate-800/50 transition-colors border border-border/50">
                                <div className="mb-6 inline-flex p-4 rounded-full bg-primary/10 text-primary">
                                    <feature.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                    {feature.title}
                                </h3>
                                <p className="text-primary font-bold font-reem-kufi mb-4">
                                    {feature.titleAr}
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
                                    {feature.description}
                                </p>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
