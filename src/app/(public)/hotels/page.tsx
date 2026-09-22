import React from 'react';
import Link from 'next/link';
import { allHotels, topHotels } from '@/data/hotels';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import { Star, MapPin } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Makkah & Madinah Hotels Directory | Al Aqsa Transport',
    description: 'Compare Makkah and Madinah hotels by star rating and distance to the Haram. Book your VIP airport transfer to any of these hotels.',
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/hotels',
    }
};

export default function HotelsDirectory() {
    const makkahHotels = allHotels.filter(h => h.city === 'Makkah');
    const madinahHotels = allHotels.filter(h => h.city === 'Madinah');
    
    // Helper to check if a hotel has a dedicated page (is in topHotels)
    const hasDedicatedPage = (id: string) => topHotels.some(th => th.id === id);

    return (
        <main className="overflow-x-hidden pb-20 bg-slate-50 dark:bg-slate-950">
            <Hero
                title="Makkah & Madinah Hotels"
                subtitle="Book your private VIP transfer from Jeddah or Madinah Airport directly to your hotel."
                bgImage="/images/routes/jeddah-airport-hero-professional.webp"
                breadcrumbs={<Breadcrumbs />}
                layout="center"
            />
            
            <section className="py-16 container mx-auto px-4 max-w-6xl">
                <div className="mb-12">
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Makkah Hotels</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
                        Browse our directory of Makkah hotels. We provide direct private transfers from Jeddah Airport to all hotels listed below.
                    </p>
                    
                    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    <th className="p-4 font-semibold text-sm">Hotel Name</th>
                                    <th className="p-4 font-semibold text-sm">Rating</th>
                                    <th className="p-4 font-semibold text-sm">Distance to Haram</th>
                                    <th className="p-4 font-semibold text-sm">Transfer Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {makkahHotels.map(hotel => (
                                    <tr key={hotel.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{hotel.name}</td>
                                        <td className="p-4">
                                            <div className="flex items-center text-amber-500">
                                                {Array.from({length: hotel.starRating}).map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} /> {hotel.distanceFromHaram}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {hasDedicatedPage(hotel.id) ? (
                                                <Link 
                                                    href={`/transfers/jeddah-airport-to-${hotel.slug}`}
                                                    className="text-secondary font-semibold hover:underline text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            ) : (
                                                <Link 
                                                    href={`/booking?route=jeddah-makkah`}
                                                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-sm"
                                                >
                                                    Book Transfer
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div>
                    <h2 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">Madinah Hotels</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-2xl">
                        Browse our directory of Madinah hotels. We provide direct private transfers from Madinah Airport or Jeddah Airport to all hotels listed below.
                    </p>
                    
                    <div className="overflow-x-auto bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                                    <th className="p-4 font-semibold text-sm">Hotel Name</th>
                                    <th className="p-4 font-semibold text-sm">Rating</th>
                                    <th className="p-4 font-semibold text-sm">Distance to Haram</th>
                                    <th className="p-4 font-semibold text-sm">Transfer Link</th>
                                </tr>
                            </thead>
                            <tbody>
                                {madinahHotels.map(hotel => (
                                    <tr key={hotel.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <td className="p-4 font-medium text-slate-900 dark:text-slate-100">{hotel.name}</td>
                                        <td className="p-4">
                                            <div className="flex items-center text-amber-500">
                                                {Array.from({length: hotel.starRating}).map((_, i) => (
                                                    <Star key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm">
                                            <div className="flex items-center gap-1">
                                                <MapPin size={14} /> {hotel.distanceFromHaram}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            {hasDedicatedPage(hotel.id) ? (
                                                <Link 
                                                    href={`/transfers/jeddah-airport-to-${hotel.slug}`}
                                                    className="text-secondary font-semibold hover:underline text-sm"
                                                >
                                                    View Details
                                                </Link>
                                            ) : (
                                                <Link 
                                                    href={`/booking?route=madinah-airport-to-hotel`}
                                                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline text-sm"
                                                >
                                                    Book Transfer
                                                </Link>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        </main>
    );
}
