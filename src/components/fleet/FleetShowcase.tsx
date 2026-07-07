'use client';

import { Users, Briefcase, Check, ArrowRight, Star, Armchair, Snowflake, Usb, Wifi, Monitor, ShieldCheck, Settings } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/common/FadeIn';
import { useSettings } from '@/context/SettingsContext';

export interface Vehicle {
    id: string;
    name: string;
    exampleVehicle?: string;
    price: string;
    passengers: number;
    luggage: number;
    features: string[];
    image: string;
}

interface FleetShowcaseProps {
    vehicles: Vehicle[];
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

export default function FleetShowcase({ vehicles }: FleetShowcaseProps) {
    const { settings } = useSettings();

    const calculateDiscountedPrice = (priceString: string) => {
        if (!settings?.discount?.enabled) return null;

        const now = new Date();
        const nowCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (settings.discount.startDate) {
            const startDate = new Date(settings.discount.startDate);
            const startCheck = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            if (startCheck > nowCheck) return null;
        }

        if (settings.discount.endDate) {
            const endDate = new Date(settings.discount.endDate);
            const endCheck = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            if (nowCheck > endCheck) return null;
        }

        const match = priceString.match(/(\d+)/);
        if (!match) return null;

        const originalPrice = parseInt(match[0]);
        let finalPrice = originalPrice;

        if (settings.discount.type === 'percentage') {
            finalPrice = Math.round(originalPrice * (1 - settings.discount.value / 100));
        } else {
            finalPrice = Math.max(0, originalPrice - settings.discount.value);
        }

        return {
            original: originalPrice,
            final: finalPrice,
            formatted: priceString.replace(match[0], finalPrice.toString())
        };
    };

    return (
        <section className="py-24 bg-[#FAFAFA] dark:bg-[#0B1221]">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-serif text-slate-900 dark:text-white mb-4 tracking-tight">Our Premium Fleet</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg">Choose from our wide range of luxury vehicles</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {vehicles.map((vehicle, index) => {
                        const discountInfo = calculateDiscountedPrice(vehicle.price);

                        return (
                            <FadeIn key={vehicle.id} delay={index * 0.1}>
                                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden group h-full">
                                    
                                    {/* Image Section */}
                                    <div className="relative h-56 w-full bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-800/20 pt-8 pb-4 px-8 flex items-center justify-center">
                                        {discountInfo && settings?.discount && (
                                            <div className="absolute top-4 left-4 z-10 bg-secondary text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-sm">
                                                {settings.discount.type === 'percentage' ? `-${settings.discount.value}% OFF` : `-${settings.discount.value} SAR OFF`}
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
                                        <div className="flex justify-between items-start mb-4 gap-4">
                                            <div className="flex-1">
                                                <h3 className="text-2xl font-serif text-slate-900 dark:text-white group-hover:text-secondary transition-colors leading-tight mb-1">
                                                    {vehicle.name}
                                                </h3>
                                                {vehicle.exampleVehicle && (
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                                                        Example: {vehicle.exampleVehicle}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right flex flex-col items-end flex-shrink-0">
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-medium leading-none mb-1">
                                                    Starting from
                                                </span>
                                                <div className="flex flex-col items-end">
                                                    {discountInfo ? (
                                                        <>
                                                            <span className="text-[10px] text-slate-400 line-through decoration-secondary/50 mb-0.5">
                                                                {vehicle.price.replace(/from\s+/i, '').trim()}
                                                            </span>
                                                            <div className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1 whitespace-nowrap">
                                                                {discountInfo.formatted.replace(/from\s+/i, '').trim()}
                                                            </div>
                                                        </>
                                                    ) : (
                                                        <div className="text-xl font-bold text-slate-900 dark:text-white leading-none mb-1 whitespace-nowrap">
                                                            {vehicle.price.replace(/from\s+/i, '').trim()}
                                                        </div>
                                                    )}
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
                                            {vehicle.features.slice(0, 3).map((featureString: string, i: number) => {
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

                                        {/* CTA Button */}
                                        <Link 
                                            href={`/booking?vehicle=${vehicle.id}`}
                                            className="w-full py-3.5 px-4 bg-[#0B1221] hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-[#0B1221] rounded-xl font-medium text-sm transition-colors flex justify-between items-center"
                                        >
                                            <span>Book {vehicle.name}</span>
                                            <ArrowRight size={18} className="text-secondary" />
                                        </Link>
                                    </div>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
