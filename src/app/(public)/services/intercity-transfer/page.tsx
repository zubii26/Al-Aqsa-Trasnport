import React from 'react';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FadeIn from '@/components/common/FadeIn';
import Link from 'next/link';
import InteractiveMapSection from '@/components/services/intercity/InteractiveMapSection';
import AnimatedMapBackground from '@/components/ui/AnimatedMapBackground';
import { routeService } from '@/services/routeService';
import { ShieldCheck, Star, UserCheck, Timer } from 'lucide-react';
import { RouteWithPrices } from '@/services/routeService';
import FAQSection from '@/components/services/FAQSection';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';

export const metadata = {
    title: "Intercity Transfers | Makkah, Madinah & Jeddah",
    description: "Private intercity transfers across Saudi Arabia. VIP taxi services connecting Jeddah, Makkah, and Madinah. Fixed fares, no hidden fees, and door-to-door comfort.",
    keywords: ["Makkah to Madinah taxi", "Madinah to Makkah transport", "Haramain transport", "VIP intercity taxi", "Jeddah to Madinah taxi", "KSA intercity transfer"],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/services/intercity-transfer',
    },
    openGraph: {
        title: "Saudi Arabia Intercity Transfers | Makkah, Madinah & Jeddah",
        description: "Private intercity transfers across Saudi Arabia. VIP taxi services connecting Jeddah, Makkah, and Madinah. Fixed fares, no hidden fees, and door-to-door comfort.",
        images: [{ url: '/images/routes/routes-network-hero.webp', width: 1200, height: 630, alt: 'Saudi Arabia Intercity Transport Network' }]
    }
};

const intercityFAQs = [
    { question: "How long is the journey between Makkah and Madinah?", answer: "Makkah to Madinah takes approximately 4.5 hours on the smooth Hijrah Highway. We adjust speed for your comfort and safety." },
    { question: "Is the Miqat stop included?", answer: "Yes! If you are traveling from Madinah to Makkah, we will stop at Miqat Dhul Hulayfah (Abyar Ali) for 15-20 minutes for you to assume Ihram." },
    { question: "Are there hidden fees?", answer: "No. The price quoted is per vehicle, all-inclusive of fuel, driver, and taxes. No per-person charges." }
];

// Fallback data
const MOCK_ROUTES = [
    {
        id: 'mock-1',
        origin: 'Makkah Hotel',
        destination: 'Madinah Hotel',
        distance: '450 km',
        duration: '4 hrs 30 min',
        category: 'Intercity',
        isActive: true,
        prices: [{ vehicleId: 'v1', price: 450 }]
    },
    {
        id: 'mock-2',
        origin: 'Jeddah Airport',
        destination: 'Madinah Hotel',
        distance: '400 km',
        duration: '4 hrs',
        category: 'Intercity',
        isActive: true,
        prices: [{ vehicleId: 'v1', price: 400 }]
    },
    {
        id: 'mock-3',
        origin: 'Madinah Airport',
        destination: 'Makkah Hotel',
        distance: '460 km',
        duration: '4 hrs 45 min',
        category: 'Intercity',
        isActive: true,
        prices: [{ vehicleId: 'v1', price: 460 }]
    },
    {
        id: 'mock-4',
        origin: 'Jeddah City',
        destination: 'Makkah Hotel',
        distance: '85 km',
        duration: '1 hr 15 min',
        category: 'Intercity',
        isActive: true,
        prices: [{ vehicleId: 'v1', price: 200 }]
    }
];

export const revalidate = 3600;

export default async function IntercityTransferPage() {
    let routes: RouteWithPrices[] = [];

    try {
        routes = await routeService.getActiveRoutes();
    } catch (error) {
        console.error("Failed to fetch routes:", error);
    }

    const effectiveRoutes = routes.length > 0 ? routes : (process.env.NODE_ENV === 'development' || routes.length === 0 ? MOCK_ROUTES : []) as unknown as RouteWithPrices[];

    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Intercity Transport Service",
            "serviceType": "Ground Transport",
            "provider": {
                "@type": "Organization",
                "name": "Al Aqsa Umrah Transport"
            },
            "description": "Luxury intercity transfers between Makkah, Madinah, and Jeddah.",
            "areaServed": [
                { "@type": "City", "name": "Makkah" },
                { "@type": "City", "name": "Madinah" },
                { "@type": "City", "name": "Jeddah" }
            ],
            "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": "450",
                "url": "https://www.alaqsaumrahtransport.com/services/intercity-transfer"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": intercityFAQs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        }
    ];

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title="Saudi Arabia Intercity Transfers"
                subtitle="Journey between the Holy Cities via our interactive premium network. Explore routes and book your VIP transfer instantly."
                bgImage="/images/routes/routes-network-hero.webp"
                ctaText="Start Exploring"
                ctaLink="#interactive-map"
                backgroundChildren={<AnimatedMapBackground />}
                breadcrumbs={<Breadcrumbs />}
            />

            {/* Quick Answer Block */}
            <section className="py-8 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Intercity Transfers"
                            summary="Reliable, premium private transport between Saudi Arabia's major holy cities and airports. A comfortable, private alternative to public transportation networks."
                            features={[
                                { label: "Routes Covered", value: "Makkah ↔ Jeddah, Makkah ↔ Madinah, and Jeddah ↔ Madinah." },
                                { label: "Pricing", value: "Transparent, flat-rate pricing per route based on the selected vehicle class." },
                                { label: "Availability", value: "On-demand and pre-scheduled bookings available daily; door-to-door service included." }
                            ]}
                            ctaText="Book Intercity Travel"
                            ctaLink="/booking"
                        />
                    </div>
                </div>
            </section>

            <section className="py-16 md:py-24 bg-white dark:bg-slate-950 relative overflow-hidden">
                <div className="container relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-start mb-20">
                        <FadeIn>
                            <div className="prose dark:prose-invert max-w-none">
                                <span className="text-secondary dark:text-secondary font-bold tracking-wider text-sm uppercase mb-2 block">The Sacred Route</span>
                                <h2 className="text-3xl md:text-4xl font-bold  mb-6 text-slate-900 dark:text-white leading-tight">
                                    Travel with Peace of Mind <br />
                                    <span className="text-secondary">Between The Two Harams</span>
                                </h2>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                                    Whether you need Madinah to Makkah transport or a reliable Haramain transport alternative, the journey between Makkah and Madinah is more than just travel; it is a transition between two sacred sanctuaries. We honor this journey by providing a KSA intercity transfer service that prioritizes your rest and reverence.
                                </p>
                                <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                                    Forget the hassle of crowded buses. Our <strong>private intercity taxis</strong> allow you to travel on your own schedule, stop at Miqats (Dhul Hulayfah) for intention, and enjoy the scenic Hijrah route in the privacy of a premium vehicle.
                                </p>

                                <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary shrink-0">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Safety First</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Professional drivers familiar with the Hijrah Highway.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary shrink-0">
                                            <Star size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">VIP Fleet</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Late-model GMC Yukons and H1 Vans.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary shrink-0">
                                            <UserCheck size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">Door-to-Door</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Hotel pickup and drop-off in Makkah/Madinah.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-4 items-start">
                                        <div className="p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-secondary shrink-0">
                                            <Timer size={24} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 dark:text-white mb-1">On Your Time</h4>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Depart when you are ready. No waiting.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>

                        <div className="relative sticky top-32">
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-blue-600/20 rounded-full blur-3xl transform scale-90 opacity-40 translate-y-10" />
                            <div className="relative">
                                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-xl text-center">
                                    <h3 className="text-2xl font-bold  text-slate-900 dark:text-white mb-4">Book Your Transfer</h3>
                                    <p className="text-slate-600 dark:text-slate-400 mb-8">Best Rates & Immediate Confirmation</p>
                                    <Link
                                        href="/booking"
                                        className="inline-block w-full py-4 px-6 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                    >
                                        Book Now
                                    </Link>
                                    <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500">
                                        <div className="flex items-center justify-center gap-2">
                                            <ShieldCheck size={16} className="text-green-500" />
                                            <span>No Hidden Fees</span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2">
                                            <Star size={16} className="text-secondary" />
                                            <span>4.9/5 Customer Rating</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Interactive Map Section - FULL WIDTH */}
            <section id="interactive-map" className="py-0 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
                <div className="w-full">
                    <InteractiveMapSection routes={effectiveRoutes} />
                </div>
            </section>

            <FAQSection items={intercityFAQs} />
        </main>
    );
}
