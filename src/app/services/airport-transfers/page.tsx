import React from 'react';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import BookingFormWrapper from '@/components/home/BookingFormWrapper';
import { Plane, Clock, ShieldCheck, MapPin } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
    title: "Jeddah Airport to Makkah Taxi | KAIA Transfers - Al Aqsa",
    description: "Book reliable Jeddah Airport (KAIA) to Makkah taxi. VIP greeting, flight tracking, and comfortable GMC Yukon transfers for Umrah pilgrims.",
    keywords: ["Jeddah airport to Makkah taxi", "KAIA transfer", "Umrah airport pickup", "Madinah airport taxi", "Jeddah to Makkah bus"]
};

export default function AirportTransfersPage() {
    return (
        <main>
            <Hero
                title="VIP Jeddah Airport Transfers"
                subtitle="Experience a seamless arrival with our premium chauffeur service. We track your flight and wait for you at KAIA, ensuring a stress-free journey to Makkah."
                bgImage="https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Transfer Now"
                ctaLink="/booking?service=airport"
            />

            {/* Introduction & Benefits */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container">
                    <div className="grid lg:grid-cols-2 gap-12 items-start">
                        <FadeIn>
                            <div className="prose dark:prose-invert max-w-none">
                                <h2 className="text-3xl font-bold font-playfair mb-6 text-secondary">
                                    Arrive in Comfort & Style
                                </h2>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                    Arriving for Umrah doesn't have to be stressful. Our premium <strong>Jeddah Airport to Makkah taxi service</strong> ensures that a professional driver is waiting for you the moment you land. We monitor flight arrivals to accommodate delays, ensuring you are never left waiting.
                                </p>
                                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                                    Our fleet includes spacious <strong>GMC Yukons</strong> and <strong>Toyota Hiace</strong> customized for pilgrim comfort, with ample space for luggage. Whether you are a solo traveler or a large group, we provide a smooth, safe, and spiritually focused ride to the Holy City.
                                </p>

                                <h3 className="text-xl font-bold mb-4">Why Choose Al Aqsa?</h3>
                                <div className="grid sm:grid-cols-2 gap-6 mb-8">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Plane className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Flight Tracking</h4>
                                            <p className="text-sm text-muted-foreground">We monitor your landing time.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <Clock className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">24/7 Availability</h4>
                                            <p className="text-sm text-muted-foreground">Late night arrival? No problem.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <ShieldCheck className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Licensed Chauffeurs</h4>
                                            <p className="text-sm text-muted-foreground">Experienced & English speaking.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                                            <MapPin className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold mb-1">Door-to-Door</h4>
                                            <p className="text-sm text-muted-foreground">Direct hotel drop-off in Makkah.</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/booking?service=airport" className="btn btn-primary">
                                    Check Rates & Book
                                </Link>
                            </div>
                        </FadeIn>

                        <div className="relative sticky top-24">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-amber-600 rounded-3xl transform rotate-1 opacity-10 blur-xl" />
                            <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-1">
                                <BookingFormWrapper className="shadow-none border-0" title="Book Airport Transfer" subtitle="Instant Confirmation" />
                            </div>
                        </div>
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
