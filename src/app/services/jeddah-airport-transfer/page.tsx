import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import Features from '@/components/home/Features';
import styles from '@/app/page.module.css';
import Link from 'next/link';
import { ArrowRight, Plane, ShieldCheck, UserCheck } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import VehicleCapacityGuide from '@/components/services/VehicleCapacityGuide';

export const metadata: Metadata = {
    title: "Jeddah Airport Taxi to Makkah Price | Meet & Greet Services",
    description: "Reliable transfer from Jeddah Airport (JED) to Makkah hotels. Our driver waits for you at the arrival hall. Fixed prices, no hidden fees, and spacious vehicles for luggage.",
    keywords: [
        "Jeddah airport to Makkah taxi",
        "Jeddah airport taxi price",
        "taxi from Jeddah airport to Makkah cost",
        "Jeddah airport transport to Makkah",
        "Madinah airport taxi services",
        "JED airport pickup",
        "Makkah hotel transfer",
        "Umrah taxi booking"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/services/jeddah-airport-transfer',
    }
};

const jeddahAirportFAQs = [
    {
        question: "Where will the driver meet me?",
        answer: "Our driver will be waiting for you at the arrival hall after you clear customs and baggage claim. They will be holding a sign with your name or 'Al Aqsa Transport'. We track your flight to ensure we are there when you land."
    },
    {
        question: "What if my flight is delayed?",
        answer: "Don't worry. We monitor flight statuses in real-time. If your flight is delayed, we automatically adjust the pickup time. There are no extra charges for flight delays."
    },
    {
        question: "How long does the trip to Makkah take?",
        answer: "The journey from King Abdulaziz International Airport (JED) to Makkah typically takes 60 to 75 minutes, depending on traffic conditions in Jeddah."
    },
    {
        question: "Can I pay in cash?",
        answer: "Yes, you can pay the driver in cash (SAR) upon arrival. However, we recommend booking online to secure your rate and vehicle."
    }
];

import { getSettings } from '@/lib/settings-storage';

export default async function JeddahAirportTransferPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

    const content = {
        title: "Jeddah Airport to Makkah Transfers",
        subtitle: "Start your Umrah with peace of mind. Professional drivers, Meet & Greet service, and direct transfer to your Makkah hotel.",
        heroImage: "/jeddah-airport-hero-v2.png"
    };

    return (
        <main className="overflow-x-hidden">
            <Hero
                title={content.title}
                subtitle={content.subtitle}
                bgImage={content.heroImage}
                ctaText="Book Arrival Transfer"
                ctaLink={whatsappLink}
                layout="center"
            />

            {/* Arrival Guide Section */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4 font-playfair text-slate-800 dark:text-slate-100">
                            Arrival Procedure: What to Expect
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            We know arriving in a new country can be stressful. Here is how we make it easy:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <UserCheck size={40} className="text-amber-500" />,
                                title: "1. Meet & Greet",
                                desc: "Our driver will be waiting at the arrival hall holding a sign with your name. No need to search for a taxi."
                            },
                            {
                                icon: <ShieldCheck size={40} className="text-amber-500" />,
                                title: "2. Luggage Assistance",
                                desc: "Our vehicles (GMC/H1) are chosen for their large luggage capacity. The driver will handle your bags."
                            },
                            {
                                icon: <Plane size={40} className="text-amber-500" />,
                                title: "3. Direct to Hotel",
                                desc: "Relax in a cooled vehicle while we take you directly to your hotel door in Makkah (approx 60-75 mins)."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-100 dark:border-slate-700 text-center">
                                <div className="flex justify-center mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-slate-100">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Terminal Info */}
            <section className="py-12 bg-amber-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4 text-center">
                    <h3 className="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Which Terminal?</h3>
                    <p className="text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6">
                        Most international flights land at <strong>Terminal 1 (New Airport)</strong>.
                        Some regional carriers use the North Terminal.
                        Don't worry, we track your flight number and adjust the pickup location automatically.
                    </p>
                </div>
            </section>

            <VehicleCapacityGuide />

            <Features />
            <FleetCarouselWrapper />

            <FAQSection items={jeddahAirportFAQs} title="Jeddah Airport Transfer FAQs" />

            {/* CTA */}
            <section className="py-16">
                <div className="container mx-auto px-4 text-center">
                    <Link href="/booking" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-1">
                        Check Taxi Fares <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </main>
    );
}
