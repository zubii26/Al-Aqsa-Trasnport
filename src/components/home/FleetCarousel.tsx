'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, Check, ArrowRight, Tag, Star, Armchair, Snowflake, Usb, Wifi, Monitor, ShieldCheck, Settings } from 'lucide-react';
import styles from './FleetCarousel.module.css';
import GlassButton from '@/components/ui/GlassButton';
import { getWhatsAppLink } from '@/lib/whatsapp';

export interface Vehicle {
    id: string;
    name: string;
    image: string;
    passengers: number | string;
    luggage: number;
    features: string[];
    price: string;
}

interface FleetCarouselProps {
    vehicles: Vehicle[];
    discount?: {
        enabled: boolean;
        type: 'percentage' | 'fixed';
        value: number;
        startDate?: string;
        endDate?: string;
    };
}

function mapFeatureToDisplay(feature: string) {
    const lower = feature.toLowerCase();
    let icon = Check;
    
    if (lower.includes('ac') || lower.includes('climate') || lower.includes('cool')) icon = Snowflake;
    else if (lower.includes('comfort') || lower.includes('leather') || lower.includes('seat') || lower.includes('spacious')) icon = Armchair;
    else if (lower.includes('usb')) icon = Usb;
    else if (lower.includes('wifi')) icon = Wifi;
    else if (lower.includes('tech') || lower.includes('screen') || lower.includes('monitor')) icon = Monitor;
    else if (lower.includes('luxury') || lower.includes('premium')) icon = Star;
    else if (lower.includes('safe') || lower.includes('security') || lower.includes('reliable')) icon = ShieldCheck;
    else if (lower.includes('modern') || lower.includes('auto')) icon = Settings;

    const parts = feature.split(' ');
    const title = parts[0];
    const subtitle = parts.slice(1).join(' ');

    return { icon, title, subtitle };
}

export default function FleetCarousel({ vehicles, discount }: FleetCarouselProps) {
    if (vehicles.length === 0) return null;

    // Duplicate list for seamless infinite scroll
    const displayVehicles = [...vehicles, ...vehicles];

    // Check if discount is active
    const now = new Date();
    const isDiscountActive = discount?.enabled &&
        (!discount.startDate || new Date(discount.startDate) <= now) &&
        (!discount.endDate || new Date(discount.endDate) > now);

    return (
        <section className={styles.section}>
            <div className="container px-[10px] md:px-4">
                <div className={styles.header}>
                    <span className="text-secondary font-bold tracking-widest text-sm uppercase mb-3 block">Our Premium Fleet</span>
                    <h2 className={styles.title}>
                        Travel in <span className="text-secondary">Absolute Comfort</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Experience VIP comfort specific for Makkah & Madinah travel.
                        <br className="hidden md:block" />
                        Choose from our luxury GMC Yukons and spacious family vans.
                    </p>
                </div>

                <div className="fleet-marquee-wrapper">
                    <div className="fleet-marquee-track">
                        {displayVehicles.map((vehicle, index) => {
                            const isDuplicate = index >= vehicles.length;
                            return (
                            <div
                                key={`${vehicle.id}-${index}`}
                                aria-hidden={isDuplicate ? 'true' : undefined}
                                className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden group marquee-card flex-shrink-0 min-w-[320px] md:min-w-[350px] mx-3"
                            >
                                
                                {/* Image Section */}
                                <div className="relative h-56 w-full bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/20 pt-8 pb-4 px-8 flex items-center justify-center">
                                    {isDiscountActive && (
                                        <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                                            <Tag size={12} className="fill-current" />
                                            <span>
                                                {discount?.type === 'percentage' ? `-${discount.value}% OFF` : `-${discount?.value} SAR OFF`}
                                            </span>
                                        </div>
                                    )}
                                    <div className="relative w-full h-full pointer-events-none">
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
                                    <div className="flex justify-between items-start mb-4 gap-4">
                                        <div className="flex-1">
                                            <h3 className="text-2xl font-serif text-slate-900 dark:text-white group-hover:text-secondary transition-colors leading-tight">
                                                {vehicle.name}
                                            </h3>
                                        </div>
                                        <div className="text-right flex flex-col items-end flex-shrink-0">
                                            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium leading-none mb-1">
                                                Starting from
                                            </span>
                                            <div className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1 whitespace-nowrap">
                                                {vehicle.price.replace(/from\s+/i, '').trim()}
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
                                            <span>{vehicle.passengers} Passengers</span>
                                        </div>
                                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700"></div>
                                        <div className="flex items-center gap-2">
                                            <Briefcase size={16} className="text-secondary/70" strokeWidth={1.5} />
                                            <span>{vehicle.luggage} Bags</span>
                                        </div>
                                    </div>

                                    <div className="h-[1px] w-full bg-slate-100 dark:bg-slate-800 mb-6"></div>

                                    {/* Features */}
                                    <div className="grid grid-cols-3 gap-2 mb-8 mt-auto">
                                        {vehicle.features.slice(0, 3).map((featureString, i) => {
                                            const feature = mapFeatureToDisplay(featureString);
                                            return (
                                                <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left gap-1.5">
                                                    <feature.icon size={20} className="text-secondary/80" strokeWidth={1.5} />
                                                    <div>
                                                        <div className="text-[11px] font-medium text-slate-900 dark:text-white leading-snug">{feature.title}</div>
                                                        {feature.subtitle && (
                                                            <div className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">{feature.subtitle}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* CTA Button — suppressed on duplicate cards */}
                                    {!isDuplicate ? (
                                        <GlassButton
                                            href={`/booking?vehicle=${vehicle.id}`}
                                            variant="secondary"
                                            className="w-full justify-center gap-2 !bg-[#0B1221] hover:!bg-slate-800 dark:!bg-white dark:hover:!bg-slate-100 !text-white dark:!text-[#0B1221] !border-none !rounded-xl !py-3.5 transition-colors font-medium text-sm !shadow-none"
                                        >
                                            Book {vehicle.name} <ArrowRight size={16} className="text-secondary" />
                                        </GlassButton>
                                    ) : (
                                        <div className="w-full py-3.5 rounded-xl bg-[#0B1221] dark:bg-white" aria-hidden="true" />
                                    )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
