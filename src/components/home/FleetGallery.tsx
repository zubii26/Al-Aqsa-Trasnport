'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Users, Briefcase, Star, ArrowRight } from 'lucide-react';

const FLEET_IMAGES = [
    {
        src: '/images/fleet/gmc-yukon-hero-professional.png',
        alt: 'GMC Yukon AT4 Black VIP SUV Front View',
        name: 'GMC Yukon 2025',
        badge: 'VIP Choice',
        capacity: '7 Pax',
        luggage: '5 Bags',
        url: '/fleet/gmc-yukon-at4',
        gradient: 'from-amber-500/20 to-amber-900/40'
    },
    {
        src: '/images/fleet/staria-hero-professional.png',
        alt: 'Hyundai Staria Luxury Van for Families',
        name: 'Hyundai Staria',
        badge: 'Family Favorite',
        capacity: '7 Pax',
        luggage: '4 Bags',
        url: '/fleet/hyundai-staria',
        gradient: 'from-blue-500/20 to-slate-900/40'
    },
    {
        src: '/images/fleet/camry-hero-professional.png',
        alt: 'Toyota Camry Recent Model White Sedan',
        name: 'Toyota Camry',
        badge: 'Best Value',
        capacity: '4 Pax',
        luggage: '2 Bags',
        url: '/fleet/toyota-camry',
        gradient: 'from-emerald-500/20 to-slate-900/40'
    },
    {
        src: '/images/fleet/hiace-hero-professional.png',
        alt: 'Toyota Hiace Commuter Bus High Roof White',
        name: 'Toyota Hiace',
        badge: 'Large Groups',
        capacity: '10 Pax',
        luggage: '8 Bags',
        url: '/fleet/toyota-hiace',
        gradient: 'from-slate-500/20 to-slate-900/40'
    },
    {
        src: '/images/fleet/starex-hero-professional.png',
        alt: 'Hyundai H1 Starex Practical Family Van',
        name: 'Hyundai H1',
        badge: 'Comfort',
        capacity: '7 Pax',
        luggage: '4 Bags',
        url: '/fleet/hyundai-starex',
        gradient: 'from-purple-500/20 to-slate-900/40'
    },
    {
        src: '/images/fleet/coaster-hero-professional.png',
        alt: 'Toyota Coaster 21 Seater Bus',
        name: 'Toyota Coaster',
        badge: 'Group Travel',
        capacity: '21 Pax',
        luggage: '15 Bags',
        url: '/fleet/toyota-coaster',
        gradient: 'from-blue-600/20 to-slate-900/40'
    }
];

export default function FleetGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    // Tripled list for pseudo-infinite feel
    const displayImages = [...FLEET_IMAGES, ...FLEET_IMAGES, ...FLEET_IMAGES];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollAmount = direction === 'left' ? -420 : 420;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 border-y border-slate-200 dark:border-white/5 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-multiply dark:mix-blend-overlay" />

            {/* Ambient Glows */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="container mx-auto px-4 mb-16 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-end gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/20 rounded-full">
                            <Star size={14} className="text-[#D4AF37] fill-[#D4AF37]" />
                            <span className="text-[#D4AF37] font-bold text-xs uppercase tracking-widest">Premium Fleet</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white font-playfair leading-tight">
                            Experience the <span className="text-[#D4AF37]">Gold Standard</span> of Travel.
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                            Meticulously maintained vehicles designed for your comfort, safety, and style.
                        </p>
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => scroll('left')}
                            className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm hover:shadow-[#D4AF37]/30 group"
                            aria-label="Previous"
                        >
                            <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="w-14 h-14 rounded-full border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-md flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-white transition-all duration-300 shadow-sm hover:shadow-[#D4AF37]/30 group"
                            aria-label="Next"
                        >
                            <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Gallery Slider */}
            <div className="relative w-full overflow-hidden pb-12">
                <motion.div
                    ref={scrollContainerRef}
                    className="flex gap-8 overflow-x-auto px-4 md:px-8 pb-12 cursor-grab active:cursor-grabbing select-none"
                    style={{
                        scrollSnapType: 'x mandatory',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none'
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    {displayImages.map((img, idx) => (
                        <Link
                            key={`${img.name}-${idx}`}
                            href={img.url}
                            className="group relative w-[320px] h-[420px] md:w-[400px] md:h-[500px] shrink-0 scroll-snap-align-start perspective-1000 block"
                            draggable={false}
                        >
                            <motion.div
                                className="w-full h-full relative rounded-[2rem] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 shadow-xl transition-all duration-500 ease-out group-hover:shadow-2xl group-hover:shadow-[#D4AF37]/20 group-hover:border-[#D4AF37]/50"
                                whileHover={{ y: -10 }}
                            >
                                {/* Image Gradient Background */}
                                <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${img.gradient}`} />

                                {/* Badge */}
                                <div className="absolute top-6 left-6 z-20">
                                    <span className="px-5 py-2 bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                                        {img.badge}
                                    </span>
                                </div>

                                {/* Main Image */}
                                <div className="absolute inset-0 z-0">
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        sizes="(max-width: 768px) 320px, 400px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                                        draggable={false}
                                    />
                                    {/* Dark Gradient Overlay for text readability */}
                                    <div className="absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />
                                </div>

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 z-10 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <h3 className="text-3xl font-bold text-white font-playfair mb-3">{img.name}</h3>

                                    <div className="flex items-center gap-6 mb-6">
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Users size={16} className="text-[#D4AF37]" />
                                            <span className="text-sm font-medium">{img.capacity}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-300">
                                            <Briefcase size={16} className="text-[#D4AF37]" />
                                            <span className="text-sm font-medium">{img.luggage}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between border-t border-white/10 pt-6">
                                        <span className="text-[#D4AF37] font-semibold text-sm uppercase tracking-wider group-hover:text-white transition-colors">
                                            View Details
                                        </span>
                                        <div className="w-10 h-10 rounded-full bg-[#D4AF37] text-white flex items-center justify-center shadow-lg shadow-[#D4AF37]/20 group-hover:bg-[#b89628] transition-all duration-300 transform group-hover:scale-110">
                                            <ArrowRight size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </motion.div>
                <style jsx>{`
                    .overflow-x-auto::-webkit-scrollbar {
                        display: none;
                    }
                `}</style>
            </div>
        </section>
    );
}
