import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, MapPin, Clock } from 'lucide-react';
import RouteVisual from '@/components/services/RouteVisual';
import FAQSection from '@/components/services/FAQSection';

export const metadata: Metadata = {
    title: "Makkah to Madinah Taxi Price 2025 | VIP Private Transport & GMC",
    description: "Book the most comfortable Makkah to Madinah taxi service. Private GMC Yukon, Hyundai Staria, and VIP buses. Door-to-door transfer, English-speaking drivers, and fixed rates.",
    keywords: [
        "Makkah to Madinah taxi",
        "Makkah to Madinah taxi fare",
        "GMC Yukon Makkah to Madinah",
        "Madinah to Makkah transport",
        "Makkah to Madinah bus VIP",
        "private car Makkah to Madinah",
        "Haramain train alternative",
        "luxury transport Saudi Arabia"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/services/makkah-madinah-taxi',
    }
};

const makkahMadinahFAQs = [
    {
        question: "How long is the journey from Makkah to Madinah?",
        answer: "The distance is approximately 450 km. By private taxi (GMC/Staria), the journey typically takes 4.5 to 5 hours. We can stop at the Miqat (Bir Ali) for 15-30 minutes if you wish to assume Ihram before entering Makkah."
    },
    {
        question: "What is the price of a taxi from Makkah to Madinah?",
        answer: "Our prices are fixed and transparent. A private sedan starts from SAR 400, while a luxury GMC Yukon or Hyundai Staria starts from SAR 600-700. Prices may vary slightly during peak seasons like Ramadan or Hajj."
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
        subtitle: "Experience a spiritual journey with absolute comfort. 4-5 hours travel time in luxury GMC Yukon or Hyundai Staria.",
        heroImage: "https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop"
    };

    return (
        <main className="overflow-x-hidden">
            <Hero
                title={content.title}
                subtitle={content.subtitle}
                bgImage={content.heroImage}
                ctaText="Book Now via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
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
                                Skip the crowded buses and strict train schedules. Our private taxi service offers:
                            </p>
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
                                <p>• Optional Ziyarat stops (on request)</p>
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
