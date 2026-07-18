import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { Truck, MapPin, Navigation, ArrowRight, CheckCircle2, Clock } from 'lucide-react';
import RelatedReading from '@/components/blog/RelatedReading';
import RouteVisual from '@/components/services/RouteVisual';
import FAQSection from '@/components/services/FAQSection';
import SchemaInjector from '@/components/SchemaInjector';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import { makkahMadinahServiceSchema, makkahMadinahFAQSchema, makkahMadinahBreadcrumbSchema } from '@/lib/schema/makkah-madinah-taxi-schema';

export const metadata: Metadata = {
    title: "Makkah to Madinah Taxi & VIP Transfers",
    description: "Direct Makkah to Madinah private taxi transfers. Safe, comfortable 4.5-hour journey across 450km. Professional drivers with fares from SAR 300–600.",
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
        canonical: 'https://www.alaqsaumrahtransport.com/services/makkah-madinah-taxi',
    },
    openGraph: {
        title: "Makkah to Madinah Private Taxi & VIP Transfer Services",
        description: "Direct Makkah to Madinah private taxi transfers. Safe, comfortable 4.5-hour journey across 450km. Professional drivers with fares from SAR 300–600.",
        images: [{ url: '/images/routes/makkah-madinah-route-hero.webp', width: 1200, height: 630, alt: 'Makkah to Madinah Highway Scenic View' }]
    }
};

const makkahMadinahFAQs = [
    {
        question: "How long is the journey from Makkah to Madinah?",
        answer: <span>The distance is approximately 450 km. By private taxi (<Link href="/fleet/gmc-yukon-at4" className="text-secondary hover:underline">GMC</Link>/<Link href="/fleet/hyundai-staria" className="text-secondary hover:underline">Staria</Link>), the journey typically takes 4.5 to 5 hours. We can stop at the Miqat (Bir Ali) for 15-30 minutes if you wish to assume Ihram before entering Makkah.</span>,
        plainTextAnswer: "The distance is approximately 450 km. By private taxi (GMC/Staria), the journey typically takes 4.5 to 5 hours. We can stop at the Miqat (Bir Ali) for 15-30 minutes if you wish to assume Ihram before entering Makkah."
    },
    {
        question: "What is the price of a taxi from Makkah to Madinah?",
        answer: "Our prices are fixed and transparent. A private sedan starts from SAR 400, while a luxury GMC Yukon or Hyundai Staria starts from SAR 600-700. Prices may vary slightly during peak seasons like Ramadan or Hajj."
    },
    {
        question: "Do you offer transport from Jeddah Airport to Makkah?",
        answer: <span>Yes, we specialize in <Link href="/services/jeddah-airport-transfer" className="text-secondary hover:underline">Jeddah Airport transfers</Link>. Our driver will meet you at the arrival hall and take you directly to your hotel or the Haram.</span>,
        plainTextAnswer: "Yes, we specialize in Jeddah Airport transfers. Our driver will meet you at the arrival hall and take you directly to your hotel or the Haram."
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
        title: "Makkah to Madinah Private Taxi & VIP Transfer Services",
        subtitle: "Experience a spiritual journey with absolute comfort (راحة تامة). 4-5 hours travel time in luxury GMC Yukon or Hyundai Staria.",
        heroImage: "/images/routes/makkah-madinah-route-hero.webp"
    };

    return (
        <main className="overflow-x-hidden">
            <SchemaInjector schemas={[makkahMadinahServiceSchema, makkahMadinahFAQSchema, makkahMadinahBreadcrumbSchema]} />
            <Hero
                title={content.title}
                subtitle={content.subtitle}
                bgImage={content.heroImage}
                ctaText="Book Now via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs hideJsonLd />}
            />

            {/* Quick Answer Block */}
            <section className="py-8 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Makkah to Madinah Transfer"
                            summary="Al Aqsa Umrah Transport offers direct, express private taxi services between Makkah and Madinah. This door-to-door service avoids the hassle of train station logistics and provides a comfortable, climate-controlled ride via the Hijrah Highway."
                            features={[
                                { label: "Duration & Distance", value: "4.5 hours (approx. 450 km direct route)." },
                                { label: "Pricing", value: "SAR 300 to SAR 600, varying by vehicle size and season." },
                                { label: "Availability", value: "Pre-scheduled departures available 24/7 from all Makkah hotel zones." }
                            ]}
                            ctaText="Book Makkah to Madinah Taxi"
                            ctaLink={whatsappLink}
                        />
                    </div>
                </div>
            </section>

            {/* Trust/Benefits Section */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6  text-slate-800 dark:text-slate-100">
                                Why Choose Our Makkah-Madinah Transfer?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                                The journey between the two Holy Cities (approx. 450km) requires a vehicle that guarantees comfort and safety.
                                Skip the crowded buses and strict train schedules. Whether you are traveling Makkah to Madinah by road via a reliable Hijrah route taxi or seeking VIP GMC transport Madinah, our private taxi service offers premium rides in our <Link href="/fleet/gmc-yukon-at4" className="text-secondary font-medium hover:underline">GMC Yukon</Link> or <Link href="/fleet/hyundai-staria" className="text-secondary font-medium hover:underline">Hyundai Staria</Link>:
                            </p>

                            <div className="mb-6 p-4 bg-secondary/10 dark:bg-secondary/20 rounded-lg border border-secondary/20 dark:border-secondary/30">
                                <p className="text-secondary dark:text-secondary italic font-medium text-center font-serif">
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
                                        <CheckCircle2 className="text-secondary flex-shrink-0" size={20} />
                                        <span className="text-slate-700 dark:text-slate-200">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Clock className="text-secondary" /> Average Travel Time
                            </h3>
                            <p className="mb-6 text-2xl font-bold text-slate-800 dark:text-white">4 Hours 30 Minutes</p>

                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <MapPin className="text-secondary" /> Route Highlights
                            </h3>
                            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
                                <p>• Pickup from your Makkah Hotel</p>
                                <p>• Optional <Link href="/services/ziyarat-tours" className="text-secondary hover:underline">Ziyarat stops</Link> (on request)</p>
                                <p>• Drop-off at Madinah Hotel / Masjid Nabawi</p>
                            </div>
                        </div>
                    </div>

                    {/* Route Visualization - NEW */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-center mb-8 ">Your Journey Map</h2>
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
                    <h2 className="text-2xl font-bold mb-4 ">Compare: Taxi vs. Haramain Train</h2>
                    <p className="text-slate-600 dark:text-slate-400 mb-8">
                        While the train is fast, a private taxi offers unmatched convenience for families.
                        No need to travel to the station, handle luggage multiple times, or worry about ticket availability.
                        Our service picks you up directly from your lobby.
                    </p>
                    <Link href="/booking" className="inline-flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-white px-8 py-3 rounded-full font-bold transition-all">
                        Check Prices & Book <ArrowRight size={20} />
                    </Link>
                </div>
            </section>

            <RelatedReading title="Makkah & Madinah Travel Guides" category="Travel Tips" />
        </main>
    );
}
