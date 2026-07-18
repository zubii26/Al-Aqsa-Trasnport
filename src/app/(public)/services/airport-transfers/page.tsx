import React from 'react';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import { Plane, Clock, ShieldCheck, MapPin, UserCheck, Smartphone, CheckCircle2, Star } from 'lucide-react';
import Link from 'next/link';
import { routeService } from '@/services/routeService';
import AirportInteractiveMap from '@/components/services/airport/AirportInteractiveMap';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Airport Transfers | Umrah Taxi Services",
    description: "Reliable 24/7 airport transfers for Jeddah (KAIA) and Madinah (MED). Professional meet & greet, flight tracking, and private Umrah taxi services.",
    keywords: [
        "Jeddah airport to Makkah taxi", "KAIA transfer", "Umrah airport pickup", "Madinah airport taxi",
        "VIP Umrah Transport", "Jeddah Airport Shuttle", "Makkah Private Taxi",
        "توصيل مطار جدة", "تاكسي مطار المدينة", "استقبال المعتمرين",
        "نقل من مطار الملك عبدالعزيز", "حجز تاكسي الحرم", "خدمات المعتمرين"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/services/airport-transfers',
    },
    openGraph: {
        title: "Saudi Arabia Airport Transfers | Umrah Taxi Services",
        description: "Reliable 24/7 airport transfers for Jeddah (KAIA) and Madinah (MED). Professional meet & greet, flight tracking, and private Umrah taxi services.",
        images: ["/images/fleet/gmc.webp"],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Saudi Arabia Airport Transfers | Umrah Taxi Services",
        description: "Reliable 24/7 airport transfers for Jeddah (KAIA) and Madinah (MED). Professional meet & greet, flight tracking, and private Umrah taxi services.",
        images: ["/images/fleet/gmc.webp"],
    }
};

const airportFAQs = [
    { q: "Where will I meet the driver?", a: "Our driver will be waiting for you at the arrival terminal holding a sign with your name. We also share the driver's contact details via WhatsApp before you land." },
    { q: "What if my flight is delayed?", a: "We monitor flight schedules in real-time. If your flight is delayed, our driver will adjust the pickup time accordingly, free of charge." },
    { q: "Do you provide child seats?", a: "Yes, child seats are available upon request. Please mention this requirement in the booking notes so we can arrange it for you." },
    { q: "How long does the journey take?", a: "The journey from Jeddah Airport to Makkah typically takes about 60-90 minutes, depending on traffic conditions." },
    { q: "Can I pay in cash?", a: "Yes, you can pay the driver in cash (SAR) upon arrival. We also accept online payments if you prefer to prepay." },
    { q: "Is the price per person or per vehicle?", a: "Our prices are per vehicle, not per person. The price you see is for the entire car including luggage spaces." }
];

export default async function AirportTransfersPage() {
    const allRoutes = await routeService.getActiveRoutes();
    const airportRoutes = allRoutes.filter(r =>
        r.origin?.toLowerCase().includes('airport') ||
        r.destination?.toLowerCase().includes('airport') ||
        r.origin?.toLowerCase().includes('jeddah')
    );

    // Schema.org Structured Data
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Jeddah Airport Transfer to Makkah",
            "alternateName": "توصيل من مطار جدة الى مكة",
            "serviceType": "Private VIP Transfer",
            "provider": {
                "@type": "Organization",
                "name": "Al Aqsa Umrah Transport"
            },
            "description": "Premium airport transfer service from King Abdulaziz International Airport (KAIA) to Makkah. خدمة نقل فاخرة من مطار الملك عبدالعزيز الى مكة.",
            "areaServed": [
                { "@type": "City", "name": "Jeddah" },
                { "@type": "City", "name": "Makkah" },
                { "@type": "City", "name": "Madinah" }
            ],
            "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": "250",
                "url": "https://www.alaqsaumrahtransport.com/services/airport-transfers"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": airportFAQs.map(faq => ({
                "@type": "Question",
                "name": faq.q,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.a
                }
            }))
        }
    ];

    return (
        <main className="bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title="Saudi Arabia Airport Transfers | Umrah Taxi Services"
                subtitle="Experience a seamless arrival with our premium chauffeur service. We track your flight and wait for you at KAIA, ensuring a stress-free journey to Makkah."
                bgImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Transfer Now"
                ctaLink="/booking?service=airport"
                alt="Jeddah Airport Arrival Lounge Private Chauffeur Transfer"
            />

            {/* Quick Answer Block */}
            <section className="py-8 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="General Airport Transfers"
                            summary="Comprehensive Meet & Greet airport transfer services for pilgrims arriving at King Abdulaziz International Airport (Jeddah) or Prince Mohammad Bin Abdulaziz Airport (Madinah)."
                            features={[
                                { label: "Locations", value: "Jeddah (KAIA) and Madinah (MED) airports to all major hotels." },
                                { label: "Key Features", value: "Complimentary flight tracking, 24/7 availability, and luggage assistance." },
                                { label: "Fleet", value: "Ranging from standard sedans to VIP GMC Yukons and 10-seater family vans." }
                            ]}
                            ctaText="View Airport Routes"
                            ctaLink="/booking?service=airport"
                        />
                    </div>
                </div>
            </section>

            {/* Interactive Map Section */}
            <section className="relative z-10 -mt-10 mb-12">
                <div className="container px-0 sm:px-4">
                    <div className="bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-6 sm:p-8 border-b border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-end gap-4 bg-white dark:bg-slate-900">
                            <div>
                                <span className="text-secondary font-bold tracking-wider uppercase text-xs mb-2 block">Real-time Connections</span>
                                <h1 className="text-3xl font-bold  text-slate-900 dark:text-white">
                                    Airport Connectivity Network
                                </h1>
                                <p className="text-muted-foreground mt-2 max-w-xl">
                                    Visualize your journey from King Abdulaziz International Airport (KAIA).
                                    Select your destination to see route details, estimated time, and instant pricing.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
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

            {/* Why Choose Us - Enhanced */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <span className="text-secondary font-medium tracking-wider uppercase text-sm">Our Commitment</span>
                            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 ">Why Book Your Airport Transfer With Us?</h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Whether you need a direct KAIA transfer, a dedicated Umrah airport pickup, or premium VIP Umrah Transport, we go beyond just transport. We offer comprehensive service ensuring your peace of mind from the moment you land.
                            </p>
                        </div>
                    </FadeIn>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { icon: Clock, title: "Flight Tracking", desc: "We monitor your flight status. Delayed? We wait for free." },
                            { icon: UserCheck, title: "Meet & Greet", desc: "Professional driver waiting with a name sign at arrivals." },
                            { icon: ShieldCheck, title: "Secure & Safe", desc: "Fully licensed vehicles and vetted professional drivers." },
                            { icon: Star, title: "Fixed Pricing", desc: "No hidden fees. Steps are clear and prices are all-inclusive." }
                        ].map((item, idx) => (
                            <FadeIn key={idx} delay={idx * 0.1}>
                                <div className="card-premium text-center">
                                    <div className="bg-secondary/10 dark:bg-secondary/20 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6 text-secondary">
                                        <item.icon size={28} />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                        {item.desc}
                                    </p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="container">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center mb-16 ">Seamless Journey in 4 Steps</h2>
                        <div className="grid md:grid-cols-4 gap-8 relative">
                            {/* Connector Line (Desktop) */}
                            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-slate-200 dark:bg-slate-700 -z-10" />

                            {[
                                { icon: Smartphone, title: "1. Book Online", desc: "Select your ride and enter flight details." },
                                { icon: CheckCircle2, title: "2. Confirmation", desc: "Receive instant confirmation with driver details." },
                                { icon: Plane, title: "3. We Track", desc: "We allow for flight delays and track your arrival time." },
                                { icon: UserCheck, title: "4. Meet & Ride", desc: "Driver meets you at arrivals for a smooth ride." }
                            ].map((step, idx) => (
                                <div key={idx} className="flex flex-col items-center text-center bg-transparent">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 border-4 border-slate-50 dark:border-slate-900 shadow-sm rounded-full flex items-center justify-center mb-6 z-10">
                                        <step.icon size={32} className="text-secondary" />
                                    </div>
                                    <h3 className="font-bold text-xl mb-2">{step.title}</h3>
                                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Vehicle Options */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="container">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold  mb-4">Choose Your Vehicle</h2>
                            <p className="text-muted-foreground">Select the perfect vehicle for your group size and comfort preferences.</p>
                        </div>
                    </FadeIn>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FadeIn delay={0.1}>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                                <div className="h-56 relative overflow-hidden group bg-white dark:bg-slate-800 flex items-center justify-center p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/camry.webp"
                                        alt="Toyota Camry Standard Sedan for Affordable Makkah Airport Transfer"
                                        className="w-auto h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold mb-2">Standard Sedan</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Perfect for couples or solo travelers with light luggage.</p>
                                    <ul className="text-sm space-y-3 mb-6 mt-auto text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Comfortable for 2-3 Passengers</li>
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Space for 2 Standard Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border-2 border-secondary relative h-full flex flex-col transform md:-translate-y-4">
                                <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10">Most Popular</div>
                                <div className="h-56 relative overflow-hidden group bg-white dark:bg-slate-800 flex items-center justify-center p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/gmc.webp"
                                        alt="GMC Yukon XL VIP Luxury SUV for Jeddah Airport Pickup"
                                        className="w-auto h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold mb-2">VIP GMC Yukon</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Luxury and space for families. Travel like a VIP.</p>
                                    <ul className="text-sm space-y-3 mb-6 mt-auto text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Luxury seating for 7 Passengers</li>
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Large boot for 5-6 Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-800 h-full flex flex-col">
                                <div className="h-56 relative overflow-hidden group bg-white dark:bg-slate-800 flex items-center justify-center p-4">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/images/fleet/hiace.webp"
                                        alt="Toyota Hiace 10-Seater Family Van for Airport Group Transport"
                                        className="w-auto h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6 flex-1 flex flex-col border-t border-slate-100 dark:border-slate-800">
                                    <h3 className="text-xl font-bold mb-2">Family Van (Hiace)</h3>
                                    <p className="text-muted-foreground text-sm mb-4">Ideal for large groups or families with extra luggage.</p>
                                    <ul className="text-sm space-y-3 mb-6 mt-auto text-slate-600 dark:text-slate-400">
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Spacious for 10 Passengers</li>
                                        <li className="flex items-center gap-3"><MapPin size={16} className="text-secondary" /> Capacity for 8-10 Suitcases</li>
                                    </ul>
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50">
                <div className="container max-w-4xl">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center mb-12 ">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {airportFAQs.map((faq, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">{faq.q}</h3>
                                    <p className="text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-secondary text-white text-center">
                <div className="container">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 ">Ready for a Comfortable Journey?</h2>
                    <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">Book your trusted Makkah transport today and let us handle the logistics while you focus on your worship.</p>
                    <Link
                        href="/booking?service=airport"
                        className="inline-flex items-center gap-2 bg-white text-secondary font-bold py-4 px-8 rounded-full hover:bg-slate-100 transition-colors shadow-lg"
                    >
                        Book Your Transfer Now
                        <Plane className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
