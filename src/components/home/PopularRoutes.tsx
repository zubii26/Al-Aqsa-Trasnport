'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {POPULAR_ROUTES.map((route) => (
                        <Link 
                            key={route.id} 
                            href={route.link}
                            className="group relative block h-[200px] lg:h-[260px] w-full rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            <span className="sr-only">View {route.title}</span>
                            <Image
                                src={route.image}
                                alt={route.title}
                                fill
                                loading="lazy"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors z-10" />
                            <div className="absolute inset-0 z-20 flex items-center justify-center p-6">
                                <h3 className="text-white font-bold text-center text-xl lg:text-2xl drop-shadow-md group-hover:text-secondary transition-colors leading-tight">
                                    {route.title}
                                </h3>
                            </div>
                        </Link>
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
