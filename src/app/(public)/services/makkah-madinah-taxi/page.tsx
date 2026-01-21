import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Clock } from 'lucide-react';
import RouteVisual from '@/components/services/RouteVisual';
import FAQSection from '@/components/services/FAQSection';

export const metadata: Metadata = {
    title: "Taxi Makkah to Madinah Price 2025 | VIP Private Car Cost",
    description: "Book private taxi from Makkah to Madinah. 4-hour luxury transfer in GMC Yukon or Hyundai Staria. Door-to-door service with Miqat option (احرام).",
    keywords: [
        "Taxi Makkah to Madinah",
        "Makkah to Madinah Taxi Price",
        "Private Car Makkah to Madinah",
        "Distance Makkah to Madinah Taxi Time",
        "VIP Transport Makkah Madinah",
        "تاكسي مكة المدينة",
        "سعر التوصيل من مكة للمدينة",
        "حجز جمس من مكة الى المدينة",
        "نقل معتمرين بين المدن",
        "مشوار مكة المدينة"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/services/makkah-madinah-taxi',
    },
    openGraph: {
        title: "Taxi Makkah to Madinah Price 2025 | VIP Private Transport",
        description: "Book the most comfortable Makkah to Madinah taxi service. Private GMC Yukon, Hyundai Staria, and VIP buses.",
        images: [{ url: '/images/routes/makkah-madinah-route-hero.png', width: 1200, height: 630, alt: 'Makkah to Madinah Highway Scenic View' }]
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Makkah to Madinah Taxi Service",
    "alternateName": "تاكسي مكة المدينة",
    "provider": {
        "@type": "LocalBusiness",
        "name": "Al Aqsa Transport",
        "image": "https://alaqsaumrahtransport.com/logo.png"
    },
    "serviceType": "Intercity Transfer",
    "areaServed": {
        "@type": "Country",
        "name": "Saudi Arabia"
    },
    "description": "Premium private transport between Makkah and Madinah in GMC Yukon or Staria.",
    "offers": {
        "@type": "Offer",
        "price": "400",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
    },
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://alaqsaumrahtransport.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://alaqsaumrahtransport.com/services"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Makkah to Madinah Taxi",
                "item": "https://alaqsaumrahtransport.com/services/makkah-madinah-taxi"
            }
        ]
    }
};

const makkahMadinahFAQs = [
    {
        question: "How long is the journey from Makkah to Madinah?",
        answer: <span>The distance is approximately 450 km. By private taxi (<Link href="/fleet/gmc-yukon-at4" className="text-amber-600 hover:underline">GMC</Link>/<Link href="/fleet/hyundai-staria" className="text-amber-600 hover:underline">Staria</Link>), the journey typically takes 4.5 to 5 hours. We can stop at the Miqat (Bir Ali) for 15-30 minutes if you wish to assume Ihram before entering Makkah.</span>
    },
    {
        question: "What is the price of a taxi from Makkah to Madinah?",
        answer: "Our prices are fixed and transparent. A private sedan starts from SAR 400, while a luxury GMC Yukon or Hyundai Staria starts from SAR 600-700. Prices may vary slightly during peak seasons like Ramadan or Hajj."
    },
    {
        question: "Do you offer transport from Jeddah Airport to Makkah?",
        answer: <span>Yes, we specialize in <Link href="/services/jeddah-airport-transfer" className="text-amber-600 hover:underline">Jeddah Airport transfers</Link>. Our driver will meet you at the arrival hall and take you directly to your hotel or the Haram.</span>
    },
    {
        question: "Is it better than the Haramain Train?",
        answer: "While the train is fast, a private taxi offers door-to-door convenience. You don't need to arrange transport to the train station, handle luggage transfers, or strictly adhere to a schedule. We pick you up from your hotel lobby and drop you at your next hotel."
    },
    {
        question: "Can we stop for Ziyarat on the way?",
        answer: "Yes! Unlike buses or trains, a private taxi allows for flexibility. We can stop at historical sites like Badr or key Ziyarat spots within Madinah upon arrival (additional charges may apply depending on time)."
    }
];

import { getSettings } from '@/lib/settings-storage';

export default async function MakkahMadinahTaxiPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

    const content = {
        title: "VIP Makkah to Madinah Taxi Services",
        subtitle: "Experience a spiritual journey with absolute comfort (راحة تامة). 4-5 hours travel time in luxury GMC Yukon or Hyundai Staria.",
        heroImage: "/images/routes/makkah-madinah-route-hero.png"
    };

    return (
        <main className="overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title={content.title}
                subtitle={content.subtitle}
                bgImage={content.heroImage}
                ctaText="Book Now via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            {/* Trust/Benefits Section */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Choose Our Makkah-Madinah Transfer?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                The journey between the two Holy Cities (approx. 450km) requires a vehicle that guarantees comfort and safety.
                                Skip the crowded buses and strict train schedules. Our private taxi service offers premium rides in our <Link href="/fleet/gmc-yukon-at4" className="text-amber-600 font-medium hover:underline">GMC Yukon</Link> or <Link href="/fleet/hyundai-staria" className="text-amber-600 font-medium hover:underline">Hyundai Staria</Link>:
                            </p>

                            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-100 dark:border-amber-800/30">
                                <p className="text-amber-800 dark:text-amber-200 italic font-medium text-center font-serif">
                                    "Welcome to the City of the Prophet ﷺ – May your journey be blessed."
                                </p>
                            </div>

                            <ul className="space-y-4">
                                {[
                                    "Door-to-Door Service (Hotel to Hotel)",
                                    "No Luggage Limits (Within vehicle capacity)",
                                    "Stop at Miqat (Bir Ali) for Ihram",
                                    "Flexible Departure Times (24/7)",
                                    "New Model Vehicles (2024-2025)"
                                ].map((item, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <CheckCircle2 className="text-amber-500 flex-shrink-0" size={20} />
                                        <span className="text-slate-700 dark:text-slate-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="text-amber-500" /> Average Travel Time
                            </h3>
                            <p className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">4 Hours 30 Minutes</p>

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-amber-500" /> Route Highlights
                            </h3>
                            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                <p>• Pickup from your Makkah Hotel</p>
                                <p>• Optional <Link href="/services/ziyarat-tours" className="text-amber-600 hover:underline">Ziyarat stops</Link> (on request)</p>
                                <p>• Drop-off at Madinah Hotel / Masjid Nabawi</p>
                            </div>
                        </div>
                    </div>

                    {/* Route Visualization - NEW */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-center mb-8 font-playfair">Your Journey Map</h2>
                        <RouteVisual />
                    </div>
                </div>
            </section>

            {/* Fleet Section Reuse */}
            <FleetCarouselWrapper />

            <Features />

            {/* FAQ Section - NEW */}
            <FAQSection items={makkahMadinahFAQs} title="Frequently Asked Questions" />

            {/* SEO Content Block */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4 max-w-4xl text-center">
                    <h2 className="text-2xl font-bold mb-4 font-playfair">Compare: Taxi vs. Haramain Train</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        While the train is fast, a private taxi offers unmatched convenience for families.
                        No need to travel to the station, handle luggage multiple times, or worry about ticket availability.
                        Our service picks you up directly from your lobby.
                    </p>
                    <Link href="/booking" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-bold transition-all">
                        Check Prices & Book <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
