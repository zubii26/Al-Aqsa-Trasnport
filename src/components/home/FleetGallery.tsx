'use strict';
import React from 'react';
import Image from 'next/image';
import styles from './FleetGallery.module.css';

const FLEET_IMAGES = [
    { src: '/images/fleet/gmc-yukon-hero-professional.png', alt: 'GMC Yukon VIP Transport', name: 'GMC Yukon 2025', badge: 'VIP Choice', capacity: '7 Pax' },
    { src: '/images/fleet/staria-hero-professional.png', alt: 'Hyundai Staria Luxury Van', name: 'Hyundai Staria', badge: 'Family Favorite', capacity: '7 Pax' },
    { src: '/images/fleet/camry-hero-professional.png', alt: 'Toyota Camry Sedan', name: 'Toyota Camry', badge: 'Best Value', capacity: '4 Pax' },
    { src: '/images/fleet/hiace-hero-professional.png', alt: 'Toyota Hiace Family Bus', name: 'Toyota Hiace', badge: 'Large Groups', capacity: '12 Pax' },
    { src: '/images/fleet/starex-hero-professional.png', alt: 'Hyundai H1 Starex', name: 'Hyundai H1', badge: 'Comfort', capacity: '7 Pax' },
];

export default function FleetGallery() {
    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-amber-900/20 overflow-hidden relative">
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5 pointer-events-none mix-blend-overlay"></div>

            <div className="container mx-auto px-4 mb-10 text-center relative z-10">
                <span className="text-amber-600 dark:text-amber-500 font-bold uppercase tracking-[0.2em] text-xs">
                    Our Premium Fleet
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mt-3 font-playfair bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-400">
                    Travel in <span className="text-amber-600 dark:text-amber-500">Absolute Comfort</span>
                </h2>
            </div>

            <div className={`relative w-full max-w-[100vw] overflow-hidden ${styles.galleryContainer}`}>
                <div className={`flex gap-6 items-center ${styles.scroller}`}>
                    {/* Triple the list for smoother infinite loop on wide screens */}
                    {[...FLEET_IMAGES, ...FLEET_IMAGES, ...FLEET_IMAGES].map((img, idx) => (
                        <div
                            key={`${img.name}-${idx}`}
                            className="relative w-[320px] md:w-[400px] aspect-[16/10] rounded-2xl overflow-hidden group shrink-0 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900"
                        >
                            {/* Badge */}
                            <div className="absolute top-3 left-3 z-20">
                                <span className="px-3 py-1 bg-amber-500/90 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-lg">
                                    {img.badge}
                                </span>
                            </div>

                            {/* Image */}
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                sizes="(max-width: 768px) 320px, 400px"
                                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                            />

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                            {/* Content Slide-Up */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <h3 className="text-white font-bold text-xl font-playfair mb-1">{img.name}</h3>
                                        <div className="flex items-center gap-2 text-slate-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
                                            <span>Start Booking</span>
                                            <span className="w-1 h-1 rounded-full bg-amber-500"></span>
                                            <span className="text-amber-400 font-semibold">{img.capacity}</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300">
                                        →
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
