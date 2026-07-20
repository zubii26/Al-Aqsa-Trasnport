'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, MapPin, Clock } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

const POPULAR_ROUTES = [
    {
        id: 'jeddah-makkah',
        title: 'Jeddah Airport ⇄ Makkah',
        distance: '95 km',
        time: '60-75 mins',
        price: 'From SAR 250',
        link: '/services/jeddah-airport-transfer',
        image: '/images/routes/jeddah-airport-hero-professional.webp'
    },
    {
        id: 'makkah-madinah',
        title: 'Makkah ⇄ Madinah',
        distance: '450 km',
        time: '4.5 - 5 hours',
        price: 'From SAR 450',
        link: '/services/makkah-madinah-taxi',
        image: '/images/routes/makkah-madinah-route-hero.webp'
    },
    {
        id: 'madinah-airport',
        title: 'Madinah Airport ⇄ Hotel',
        distance: '20 km',
        time: '25-30 mins',
        price: 'From SAR 150',
        link: '/services/madinah-airport-transfer',
        image: '/images/routes/madinah-airport-hero.webp'
    },
    {
        id: 'ziyarat-makkah',
        title: 'Makkah Ziyarat Tours',
        distance: 'Various',
        time: '3-4 hours',
        price: 'From SAR 300',
        link: '/services/ziyarat-tours',
        image: '/images/routes/makkah-ziyarat-hero.webp'
    },
    {
        id: 'jeddah-madinah',
        title: 'Jeddah Airport ⇄ Madinah',
        distance: '400 km',
        time: '4 - 4.5 hours',
        price: 'From SAR 500',
        link: '/services/intercity-transfer',
        image: '/images/fleet/intercity-hero.webp'
    },
    {
        id: 'makkah-taif',
        title: 'Makkah ⇄ Taif',
        distance: '85 km',
        time: '1.5 hours',
        price: 'From SAR 350',
        link: '/routes/makkah-to-taif-taxi',
        image: '/images/blog/makkah-haram-view.webp'
    }
];

export default function PopularRoutes() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                    <div className="max-w-2xl">
                        <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-3 block">Popular Destinations</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Most Requested Routes
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Reliable and comfortable VIP transport to all major holy destinations in Saudi Arabia.
                        </p>
                    </div>
                    <Link
                        href="/routes"
                        className="hidden md:flex items-center gap-2 text-secondary font-semibold hover:text-secondary/80 transition-colors"
                    >
                        View All Routes <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POPULAR_ROUTES.map((route) => (
                        <div key={route.id} className="group relative block h-full">
                            <GlassCard className="h-full hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-300 overflow-hidden border border-border">
                                <Link href={route.link} className="absolute inset-0 z-10">
                                    <span className="sr-only">View {route.title}</span>
                                </Link>
                                <div className="flex flex-col h-full">
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={route.image}
                                            alt={route.title}
                                            fill
                                            loading="lazy"
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white z-10">
                                            <div>
                                                <div className="flex items-center gap-1 text-xs font-medium mb-1">
                                                    <Clock size={12} className="text-secondary" />
                                                    {route.time}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-medium">
                                                    <MapPin size={12} className="text-secondary" />
                                                    {route.distance}
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-secondary">
                                                {route.price}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-5 flex flex-col flex-grow">
                                        <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-secondary transition-colors">
                                            {route.title}
                                        </h3>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ))}
                </div>
                
                <div className="mt-8 text-center md:hidden">
                    <Link
                        href="/routes"
                        className="inline-flex items-center gap-2 text-secondary font-semibold border-b border-secondary pb-1"
                    >
                        View All Routes <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
