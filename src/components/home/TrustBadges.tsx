'use client';

import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileCheck, Navigation, Tag, Plane, Headphones } from 'lucide-react';

const TRUST_BADGES = [
    {
        id: 'nusuk',
        icon: ShieldCheck,
        title: 'Nusuk Registered',
        description: 'Officially registered to serve Umrah and Hajj pilgrims.'
    },
    {
        id: 'licensed',
        icon: FileCheck,
        title: 'Licensed Transport',
        description: 'Fully licensed commercial transportation provider in Saudi Arabia.'
    },
    {
        id: 'chauffeurs',
        icon: Navigation,
        title: 'Professional Chauffeurs',
        description: 'Experienced, courteous, multilingual drivers.'
    },
    {
        id: 'pricing',
        icon: Tag,
        title: 'Fixed Transparent Pricing',
        description: 'No hidden fees or surge pricing.'
    },
    {
        id: 'flight',
        icon: Plane,
        title: 'Flight Monitoring',
        description: 'Real-time flight tracking for punctual airport pickups.'
    },
    {
        id: 'support',
        icon: Headphones,
        title: '24/7 Support',
        description: 'Dedicated assistance before, during, and after your journey.'
    }
];

export default function TrustBadges() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="py-20 md:py-28 bg-white overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                
                {/* Section Header */}
                <div 
                    className={`max-w-3xl mx-auto text-center mb-16 transition-all duration-700 transform ${
                        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                        Trusted by Pilgrims Worldwide
                    </h2>
                    <p className="text-lg md:text-xl text-slate-600 leading-relaxed font-medium">
                        Licensed, professional, and trusted transportation services for Umrah and Hajj pilgrims across Saudi Arabia.
                    </p>
                </div>

                {/* Badges Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {TRUST_BADGES.map((badge, index) => (
                        <div
                            key={badge.id}
                            style={{ transitionDelay: `${index * 100}ms` }}
                            className={`flex flex-col items-center text-center p-6 md:p-8 bg-white border border-slate-200 rounded-[20px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] 
                            transition-all duration-500 ease-out h-full
                            hover:shadow-[0_12px_30px_rgba(212,175,55,0.1)] hover:border-secondary/40 
                            md:hover:-translate-y-1.5 
                            ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                        >
                            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center rounded-2xl bg-secondary/10 text-secondary mb-5 md:mb-6 shrink-0 transition-transform duration-300 md:group-hover:scale-105">
                                <badge.icon size={28} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-base md:text-lg font-bold text-slate-900 mb-3 leading-snug">
                                {badge.title}
                            </h3>
                            <p className="text-sm md:text-base text-slate-500 leading-relaxed">
                                {badge.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Optional Statistics Row */}
                <div 
                    className={`mt-20 md:mt-24 pt-10 border-t border-slate-100 transition-all duration-700 delay-500 transform ${
                        mounted ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                    }`}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
                        <div className="text-center px-4">
                            <div className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">10k+</div>
                            <div className="text-sm md:text-base font-semibold text-slate-600 uppercase tracking-wide">Successful Transfers</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">50+</div>
                            <div className="text-sm md:text-base font-semibold text-slate-600 uppercase tracking-wide">Premium Vehicles</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">15+</div>
                            <div className="text-sm md:text-base font-semibold text-slate-600 uppercase tracking-wide">Years Experience</div>
                        </div>
                        <div className="text-center px-4">
                            <div className="text-3xl md:text-4xl font-extrabold text-secondary mb-2">4.9/5</div>
                            <div className="text-sm md:text-base font-semibold text-slate-600 uppercase tracking-wide">Customer Rating</div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
}
