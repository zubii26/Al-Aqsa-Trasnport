import React from 'react';
import { Users, Briefcase, Wifi, Fuel } from 'lucide-react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

interface VehicleOverviewProps {
    title: string;
    description: string;
    modelYear: string;
    passengers: number;
    luggage: string;
    tech: string;
    fuel: string;
    bookLink: string;
    mainImage: string;
    fallbackImage: string;
}

export default function VehicleOverview({
    title,
    description,
    modelYear,
    passengers,
    luggage,
    tech,
    fuel,
    bookLink,
    mainImage,
    fallbackImage
}: VehicleOverviewProps) {
    return (
        <section className="py-16 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group">
                        <FleetFeatureImage
                            src={mainImage}
                            alt={title}
                            fallbackSrc={fallbackImage}
                            className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 bg-secondary text-white px-5 py-2 rounded-full text-sm font-bold shadow-lg">
                            {modelYear} Model
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6  text-slate-800 dark:text-slate-100 leading-tight">
                            {title}
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed text-lg">
                            {description}
                        </p>

                        <div className="grid grid-cols-2 gap-6 mb-10">
                            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                    <Users className="text-secondary" size={24} /> {passengers} Passengers
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                    <Briefcase className="text-secondary" size={24} /> {luggage}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                    <Wifi className="text-secondary" size={24} /> {tech}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                    <Fuel className="text-secondary" size={24} /> {fuel}
                                </div>
                            </div>
                        </div>

                        <div>
                            <Link href={bookLink} className="inline-flex items-center gap-3 bg-slate-900 text-white hover:bg-secondary dark:bg-white dark:text-slate-900 dark:hover:bg-secondary dark:hover:text-white px-8 py-4 rounded-full font-bold transition-all shadow-xl hover:shadow-amber-500/30 text-lg">
                                Book Now <ArrowRight size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
