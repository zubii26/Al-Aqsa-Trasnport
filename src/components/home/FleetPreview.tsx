'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Users, Briefcase, Star, Armchair, Snowflake, Usb, Wifi, Monitor, Settings } from 'lucide-react';

const FLEET_PREVIEW = [
    {
        id: 'business-sedan',
        name: 'Business Sedan',
        price: '200',
        capacity: '4–7 Passengers',
        luggage: '2–3 Bags',
        image: '/images/fleet/camry.webp',
        link: '/fleet/business-sedan',
        isPopular: false,
        features: [
            { icon: Armchair, title: 'Comfort', subtitle: 'Cabin' },
            { icon: Snowflake, title: 'AC', subtitle: 'Climate' },
            { icon: Usb, title: 'USB', subtitle: 'Charging' }
        ]
    },
    {
        id: 'gmc-yukon',
        name: 'GMC Yukon',
        price: '350',
        capacity: '7 Passengers',
        luggage: '5 Bags',
        image: '/images/fleet/gmc.webp',
        link: '/fleet/gmc-yukon-at4',
        isPopular: true,
        features: [
            { icon: Star, title: 'Luxury', subtitle: 'Interior' },
            { icon: Armchair, title: 'Leather', subtitle: 'Seats' },
            { icon: Wifi, title: 'WiFi', subtitle: 'Included' }
        ]
    },
    {
        id: 'hyundai-staria',
        name: 'Hyundai Staria',
        price: '300',
        capacity: '7 Passengers',
        luggage: '5 Bags',
        image: '/images/fleet/staria.webp',
        link: '/fleet/hyundai-staria',
        isPopular: false,
        features: [
            { icon: Settings, title: 'Modern', subtitle: 'Design' },
            { icon: Armchair, title: 'Comfort', subtitle: 'Cabin' },
            { icon: Monitor, title: 'Tech', subtitle: 'Features' }
        ]
    }
];

export default function FleetPreview() {
    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#0B1221]">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-t-2 border-secondary pt-8 relative">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4 tracking-tight">
                            Our Premium Fleet
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Travel in comfort and style with our well-maintained, modern fleet.
                        </p>
                    </div>
                    <Link
                        href="/fleet"
                        className="hidden md:inline-flex items-center gap-2 text-secondary font-medium border border-secondary/30 hover:border-secondary hover:bg-secondary/5 rounded-full px-6 py-2.5 transition-all duration-300 mt-6 md:mt-0"
                    >
                        View Full Fleet <ArrowRight size={18} />
                    </Link>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
                    {FLEET_PREVIEW.map((vehicle) => (
                        <div key={vehicle.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden group">
                            
                            {/* Image Section */}
                            <div className="relative h-56 w-full bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/20 pt-8 pb-4 px-8 flex items-center justify-center">
                                {vehicle.isPopular && (
                                    <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm">
                                        <Star size={12} className="fill-current" />
                                        Popular Choice
                                    </div>
                                )}
                                <div className="relative w-full h-full">
                                    <Image
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        fill
                                        priority
                                        className="object-contain transition-transform duration-500 ease-out transform-gpu lg:group-hover:scale-[1.02]"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-7 md:p-8 flex flex-col flex-grow">
                                {/* Title & Price */}
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-serif text-slate-900 dark:text-white group-hover:text-secondary transition-colors leading-tight">
                                            {vehicle.name}
                                        </h3>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium leading-none mb-1">
                                            Starting from
                                        </span>
                                        <div className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1 whitespace-nowrap">
                                            SAR {vehicle.price.replace(/from\s+/i, '').trim()}
                                        </div>
                                        <span className="text-[10px] text-secondary font-medium tracking-wide uppercase leading-none">
                                            Per Trip
                                        </span>
                                    </div>
                                </div>

                                {/* Specs */}
                                <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 text-sm mb-6">
                                    <div className="flex items-center gap-2">
                                        <Users size={16} className="text-secondary/70" strokeWidth={1.5} />
                                        <span>{vehicle.capacity}</span>
                                    </div>
                                    <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700"></div>
                                    <div className="flex items-center gap-2">
                                        <Briefcase size={16} className="text-secondary/70" strokeWidth={1.5} />
                                        <span>{vehicle.luggage}</span>
                                    </div>
                                </div>

                                <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-800 mb-6"></div>

                                {/* Features */}
                                <div className="grid grid-cols-3 gap-2 mb-8 mt-auto">
                                    {vehicle.features.map((feature, idx) => (
                                        <div key={idx} className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
                                            <feature.icon size={20} className="text-secondary/80" strokeWidth={1.5} />
                                            <div>
                                                <div className="text-[11px] font-medium text-slate-900 dark:text-white leading-snug">{feature.title}</div>
                                                <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{feature.subtitle}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA Button */}
                                <Link 
                                    href={vehicle.link}
                                    className="w-full py-3.5 px-4 bg-[#0B1221] hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0B1221] rounded-xl font-medium text-sm transition-colors flex justify-between items-center"
                                >
                                    <span>Book {vehicle.name}</span>
                                    <ArrowRight size={18} className="text-secondary" />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="md:hidden text-center mb-16">
                    <Link
                        href="/fleet"
                        className="inline-flex items-center gap-2 text-secondary font-medium border border-secondary/30 hover:border-secondary hover:bg-secondary/5 rounded-full px-6 py-2.5 transition-all"
                    >
                        View Full Fleet <ArrowRight size={18} />
                    </Link>
                </div>


            </div>
        </section>
    );
}
