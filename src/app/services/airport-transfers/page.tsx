import React from 'react';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import BookingFormWrapper from '@/components/home/BookingFormWrapper';
import { Plane, Clock, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';
import { routeService } from '@/services/routeService';
import AirportInteractiveMap from '@/components/services/airport/AirportInteractiveMap';

export const metadata = {
    title: "Jeddah Airport to Makkah Taxi | KAIA Transfers - Al Aqsa",
    description: "Book reliable Jeddah Airport (KAIA) to Makkah taxi. VIP greeting, flight tracking, and comfortable GMC Yukon transfers for Umrah pilgrims.",
    keywords: ["Jeddah airport to Makkah taxi", "KAIA transfer", "Umrah airport pickup", "Madinah airport taxi", "Jeddah to Makkah bus"]
};

export default async function AirportTransfersPage() {
    // 1. Fetch Data
    const allRoutes = await routeService.getActiveRoutes();

    // 2. Filter for Airport Routes (Origin or Destination contains 'Airport' or 'Jeddah')
    // Adjust logic to be precise on what constitutes an "Airport Transfer" in your system
    const airportRoutes = allRoutes.filter(r =>
        r.origin.toLowerCase().includes('airport') ||
        r.destination.toLowerCase().includes('airport') ||
        r.origin.toLowerCase().includes('jeddah') // Assuming most Jeddah routes are airport related or can be shown
    );

    return (
        <main className="bg-slate-50 dark:bg-slate-950">
            <Hero
                title="VIP Jeddah Airport Transfers"
                subtitle="Experience a seamless arrival with our premium chauffeur service. We track your flight and wait for you at KAIA, ensuring a stress-free journey to Makkah."
                bgImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop" /* Updated to distinct Aviation/Travel image */
                ctaText="Book Transfer Now"
                ctaLink="/booking?service=airport"
            />

            {/* Interactive Map Section */}
            <section className="relative z-10 -mt-10 mb-12">
                <div className="container px-0 sm:px-4">
                    <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-end gap-4 bg-white dark:bg-slate-900">
                            <div>
                                <span className="text-amber-500 font-bold tracking-wider uppercase text-xs mb-2 block">Real-time Connections</span>
                                <h2 className="text-3xl font-bold font-playfair text-slate-900 dark:text-white">
                                    Airport Connectivity Network
                                </h2>
                                <p className="text-muted-foreground mt-2 max-w-xl">
                                    Visualize your journey from King Abdulaziz International Airport (KAIA).
                                    Select your destination to see route details, estimated time, and instant pricing.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                    Live Flight Tracking
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    24/7 Availability
                                </div>
                            </div>
                        </div>

                        {/* The Map Component */}
                        <AirportInteractiveMap routes={airportRoutes} />
                    </div>
                </div>
            </section>

            {/* Vehicle Options */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="container">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Choose Your Vehicle</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FadeIn delay={0.1}>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 h-full flex flex-col">
                                <div className="h-48 relative overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/camry.png"
                                        alt="Standard Sedan"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">Standard Sedan</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Perfect for couples or solo travelers with light luggage.</p>
                                    <ul className="text-sm space-y-2 mb-6 mt-auto">
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Capacity: 2-3 Passengers</li>
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Luggage: 2 Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border-2 border-amber-500/20 relative h-full flex flex-col transform md:-translate-y-4">
                                <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">Most Popular</div>
                                <div className="h-48 relative overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/gmc.png"
                                        alt="GMC Yukon"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">VIP GMC Yukon</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Luxury and space for families. Travel like a VIP.</p>
                                    <ul className="text-sm space-y-2 mb-6 mt-auto">
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Capacity: 7 Passengers</li>
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Luggage: 5 Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-700 h-full flex flex-col">
                                <div className="h-48 relative overflow-hidden group">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/hiace.png"
                                        alt="Toyota Hiace"
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold mb-2">Family Van (Hiace)</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Ideal for large groups or families with extra luggage.</p>
                                    <ul className="text-sm space-y-2 mb-6 mt-auto">
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Capacity: 10 Passengers</li>
                                        <li className="flex items-center gap-2"><MapPin size={14} className="text-amber-500" /> Luggage: 8 Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="container max-w-4xl">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Frequently Asked Questions</h2>
                        <div className="space-y-6">
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">Where will I meet the driver?</h3>
                                <p className="text-muted-foreground">Our driver will be waiting for you at the arrival terminal holding a sign with your name. We also share the driver's contact details via WhatsApp before you land.</p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">What if my flight is delayed?</h3>
                                <p className="text-muted-foreground">We track your flight status in real-time. If your flight is delayed, we adjust the pickup time automatically at no extra charge.</p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-800 rounded-xl p-6">
                                <h3 className="font-bold text-lg mb-2">Can I pay in cash?</h3>
                                <p className="text-muted-foreground">Yes, you can pay the driver in cash (SAR) upon arrival. We also accept online payments if you prefer to prepay.</p>
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>
        </main>
    );
}
