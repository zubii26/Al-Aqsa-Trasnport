'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, Minus } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import pricingData from '@/data/pricing.json';
import { trackConversion } from '@/lib/analytics';
import { getWhatsAppLink } from '@/lib/whatsapp';

interface RouteProduct {
    id: string;
    title: string;
    price: string;
    image: string;
}

interface FleetPricingGridProps {
    vehicleId: string;
    vehicleImage: string;
    vehicleType: string; // 'camry', 'gmc', 'staria', 'starex', 'hiace', 'coaster'
    title?: string;
    subtitle?: string;
}

const PricingCard = ({ route, dbVehicleId }: { route: RouteProduct; dbVehicleId: string }) => {
    const [quantity, setQuantity] = useState(1);

    const handleIncrement = () => setQuantity(prev => prev + 1);
    const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    return (
        <div className="group bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800 p-2 sm:p-4 transition-all duration-300 hover:shadow-lg hover:border-secondary/30 hover:-translate-y-1 relative overflow-hidden h-full flex flex-col justify-between">
            {/* Decorator */}
            <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-secondary/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-150 duration-500 ease-out" />

            <div>
                <div className="relative w-full aspect-[16/9] mb-2 sm:mb-3">
                    <Image
                        src={route.image}
                        alt={route.title}
                        fill
                        className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-500"
                        sizes="(max-width: 768px) 33vw, 25vw"
                    />
                </div>

                <div className="text-center space-y-1 sm:space-y-2 mb-2 sm:mb-4">
                    <h3 className="font-bold text-[10px] sm:text-sm leading-tight h-[2rem] sm:h-[2.5rem] flex items-center justify-center text-slate-800 dark:text-slate-100 group-hover:text-secondary transition-colors line-clamp-2">
                        {route.title}
                    </h3>

                    <div className="text-sm sm:text-lg font-bold text-secondary font-playfair tracking-tight">
                        {route.price}
                    </div>
                </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                {/* Quantity Simulator */}
                <div className="flex items-center justify-center gap-2">
                    <button
                        onClick={handleDecrement}
                        className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-secondary/20 hover:text-secondary text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                    >
                        <Minus size={10} />
                    </button>
                    <span className="font-bold text-xs sm:text-base w-4 text-center">{quantity}</span>
                    <button
                        onClick={handleIncrement}
                        className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-secondary/20 hover:text-secondary text-slate-600 dark:text-slate-300 flex items-center justify-center transition-colors"
                    >
                        <Plus size={10} />
                    </button>
                </div>

                <a
                    href={getWhatsAppLink(`Salam Al Aqsa, I would like to book a ${route.title} trip.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackConversion('other', `pricing_grid_${route.id}_${dbVehicleId}`)}
                    className="block w-full bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-bold py-1.5 px-1 sm:py-2 sm:px-4 rounded text-[10px] sm:text-xs transition-all duration-300 shadow-sm hover:shadow-secondary/25 text-center whitespace-nowrap cursor-pointer"
                >
                    Book Now
                </a>
            </div>
        </div>
    );
};

export default function FleetPricingGrid({
    vehicleId,
    vehicleImage,
    vehicleType,
    title,
    subtitle
}: FleetPricingGridProps) {
    // Generate routes based on pricing.json
    const routes: RouteProduct[] = pricingData.routes
        .filter(r => r.customRates && (r.customRates as any)[vehicleType])
        .map(r => ({
            id: r.id,
            title: r.name,
            price: `${(r.customRates as any)[vehicleType]}.00 SR`,
            image: vehicleImage
        }))
        // Filter out some less common routes for the grid to keep it clean (like train stations)
        .filter(r => !r.title.toLowerCase().includes('train'))
        .filter(r => !r.title.toLowerCase().includes('train')); // Show all routes except train

    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 font-playfair text-secondary">
                        {title || `Affordable ${vehicleType.toUpperCase()} Services`}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {subtitle || `Best value and comfort for your journey. Enjoy a premium ride with our ${vehicleType.toUpperCase()} fleet.`}
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                    {routes.map((route, index) => (
                        <FadeIn key={route.id} delay={index * 0.05} scale>
                            <PricingCard route={route} dbVehicleId={vehicleId} />
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
