import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Fuel, MapPin, Wifi } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';
import dynamic from 'next/dynamic';

const Interior360Viewer = dynamic(() => import('@/components/fleet/Interior360Viewer'), {
    loading: () => <div className="h-[500px] w-full bg-slate-900 rounded-3xl animate-pulse flex items-center justify-center text-slate-500">Loading 3D View...</div>
});

import pricingData from '@/data/pricing.json';

const vehicleData = pricingData.vehicles.find(v => v.id === 'coaster');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicleData?.seo?.title || "Toyota Coaster 21-Seater Minibus",
    "image": "https://alaqsaumrahtransport.com/images/fleet/coaster-hero-professional.png",
    "description": vehicleData?.seo?.description || "Rent Toyota Coaster minibus in Makkah. Comfortable 21-seater transport for large Umrah groups.",
    "brand": { "@type": "Brand", "name": "Toyota" },
    "offers": { "@type": "Offer", "price": "550", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" }
};

export const metadata: Metadata = {
    title: "Toyota Coaster Bus Rental Makkah | 25 Pax Transport",
    description: "Book Toyota Coaster minibus for large Umrah groups. Comfortable 21-seater transport from Jeddah Airport to Makkah & Madinah. Spacious & reliable.",
    keywords: [
        "Toyota Coaster Rental Makkah",
        "20 Seater Bus Makkah",
        "Group Umrah Transport",
        "Coaster bus Jeddah to Makkah",
        "Minibus rental Saudi Arabia",
        "تأجير باص كوستر",
        "نقل معتمرين مجموعات",
        "باص 20 راكب"
    ],
    alternates: { canonical: 'https://alaqsaumrahtransport.com/fleet/toyota-coaster' },
    openGraph: {
        title: "Toyota Coaster Bus Rental Makkah | 25 Pax Transport",
        description: "Book Toyota Coaster minibus for large Umrah groups. Comfortable 21-seater transport from Jeddah Airport to Makkah & Madinah. Spacious & reliable.",
        images: [{ url: '/images/fleet/coaster-hero-professional.png', width: 1200, height: 630, alt: 'Toyota Coaster Bus' }]
    }
};

const coasterFAQs = [
    {
        question: "How many passengers can fit in a Toyota Coaster?",
        answer: "The Toyota Coaster comfortably seats up to 21 passengers with luggage. For groups with minimal luggage, it can accommodate up to 25 passengers."
    },
    {
        question: "Is there luggage space in the Coaster?",
        answer: "Yes, the Coaster has dedicated luggage capacity. However, for 20+ passengers with full luggage, we may recommend a luggage van or ensuring you book the standard 21-seater configuration which retains luggage space."
    },
    {
        question: "Is the Coaster comfortable for long distances?",
        answer: "Absolutely. The Coaster is designed for intercity travel with high ceilings, large windows, and comfortable reclining seats. It's ideal for the Makkah to Madinah journey."
    },
];

export default async function ToyotaCoasterPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Coaster%20for%20Large%20Group`;

    // Toyota Coaster ID from pricing.json (assuming inferred or verified) - double check pricing.json
    // In pricing.json view: Coaster id is "coaster"
    const coasterId = 'coaster';
    const coasterImage = '/images/fleet/coaster-hero-professional.png';

    return (
        <main className="overflow-x-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Hero
                title="Toyota Coaster 2025 | Large Group Umrah Transport"
                subtitle="The ultimate solution for large groups. Combining capacity with comfort for your journey between Holy Cities."
                bgImage={coasterImage}
                badge="Best for Groups"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={coasterId}
                vehicleImage="/images/fleet/coaster.png"
                vehicleType="coaster"
                title="Toyota Coaster Rates | Jeddah, Makkah, Madinah"
                subtitle="Best value for groups of 15-25 passengers."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/coaster-feature.png"
                                alt="Toyota Coaster Minibus"
                                fallbackSrc={coasterImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Group Favorite
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Choose Toyota Coaster?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Traveling with a large group? The Toyota Coaster ensures everyone stays together.
                                Ideal for <Link href="/services/ziyarat-tours" className="text-blue-600 font-medium hover:underline">Group Ziyarat Tours</Link> and airport transfers.
                                With its high roof and wide body, it offers a spacious and airy environment that prevents travel fatigue.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-blue-500" size={20} /> 21-25 Seats
                                    </div>
                                    <p className="text-sm text-slate-500">Keep your entire group together</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-blue-500" size={20} /> Ample Luggage
                                    </div>
                                    <p className="text-sm text-slate-500">Rear boot + Interior racks</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-blue-500" size={20} /> Safe & Stable
                                    </div>
                                    <p className="text-sm text-slate-500">Designed for passenger safety</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-blue-500" size={20} /> AC & Mic
                                    </div>
                                    <p className="text-sm text-slate-500">Public address system for guides</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-blue-500/20">
                                    Book Toyota Coaster <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Detailed Specifications */}
            <section className="py-12 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-10 font-playfair text-slate-900 dark:text-white">Technical Specifications</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Engine</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">4.0L Diesel</p>
                            <p className="text-sm text-slate-400">Reliable Power</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Climate</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Roof Ducts</p>
                            <p className="text-sm text-slate-400">Individual Vents</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Doors</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Auto Glider</p>
                            <p className="text-sm text-slate-400">Easy Entry/Exit</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Comfort</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">High Ceiling</p>
                            <p className="text-sm text-slate-400">Walk-through aisle</p>
                        </div>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={coasterFAQs} title="Toyota Coaster Rental - Frequently Asked Questions" />
        </main>
    );
}
