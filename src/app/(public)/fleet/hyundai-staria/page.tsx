import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, Fuel } from 'lucide-react';
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

const vehicleData = pricingData.vehicles.find(v => v.id === 'staria');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicleData?.seo?.title || "Hyundai Staria 2024 Luxury Van",
    "image": "https://alaqsaumrahtransport.com/images/fleet/staria-hero-professional.png",
    "description": vehicleData?.seo?.description || "Rent premium Hyundai Staria 2024 in Makkah. Luxury 7-seater van with panoramic views for VIP families.",
    "brand": { "@type": "Brand", "name": "Hyundai" },
    "offers": { "@type": "Offer", "price": "450", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" }
};

export const metadata: Metadata = {
    title: "Hyundai Staria Rental Saudi Arabia | Family Umrah Taxi",
    description: "Rent Hyundai Staria 2025 in Makkah. Spacious 7-passenger luxury van for Umrah families. Modern comfort for Jeddah to Madinah trips.",
    keywords: [
        "Hyundai Staria Rental Makkah",
        "Family Van for Umrah",
        "Hyundai Staria Jeddah Airport",
        "7 Seater Taxi Makkah",
        "Luxury Van Rental Saudi Arabia",
        "هيونداي ستاريا مكة",
        "تاكسي عائلي جدة",
        "سيارة عائلية للعمرة"
    ],
    alternates: { canonical: 'https://alaqsaumrahtransport.com/fleet/hyundai-staria' },
    openGraph: {
        title: "Hyundai Staria Rental Saudi Arabia | Family Umrah Taxi",
        description: "Rent Hyundai Staria 2025 in Makkah. Spacious 7-passenger luxury van for Umrah families. Modern comfort for Jeddah to Madinah trips.",
        images: [{ url: '/images/fleet/staria-hero-professional.png', width: 1200, height: 630, alt: 'Hyundai Staria VIP Van' }]
    }
};

const stariaFAQs = [
    {
        question: "Is the Hyundai Staria comfortable for long distances?",
        answer: "Yes, the Staria is designed as a 'Spaceship' for the road. It offers expansive windows, ample legroom, and modern suspension, making the 4-5 hour Makkah-Madinah journey very pleasant."
    },
    {
        question: "How much luggage fits in the Staria?",
        answer: "The Staria excels in cargo space. It can easily accommodate 6-7 large suitcases along with 6-7 passengers, making it superior to standard sedans."
    },
    {
        question: "What is the difference between Staria and H1?",
        answer: "The Staria is the modern successor to the H1. It features better safety tech, more comfortable seating, and a more spacious futuristic interior."
    },
];

export default async function HyundaiStariaPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20Staria%20for%20Umrah`;

    // Hyundai Staria ID: 692db09834f15bc89b45a5f9
    const stariaId = '692db09834f15bc89b45a5f9';
    const stariaImage = '/images/fleet/staria-hero-professional.png';

    return (
        <main className="overflow-x-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Hero
                title="Hyundai Staria 2024 | Premium Umrah Transport"
                subtitle="The future of travel in Saudi Arabia. Spacious and luxurious 7-seater van for families visiting Makkah and Madinah."
                bgImage={stariaImage}
                badge="Futuristic Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            <FleetPricingGrid
                vehicleId={stariaId}
                vehicleImage="/images/fleet/staria.png"
                vehicleType="staria"
                title="Hyundai Staria Rates | Jeddah, Makkah, Madinah"
                subtitle="The perfect balance of modern luxury and group capacity. Ideal for families and small groups."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/staria-feature.png"
                                alt="Hyundai Staria Exterior"
                                fallbackSrc={stariaImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Next-Gen Van
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Experience Luxury: Hyundai Staria in Makkah
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                Enjoy panoramic views of the Holy Lands with the Hyundai Staria. Its lounge-style seating makes the journey between Jeddah, Makkah, and Madinah
                                incredibly relaxing for pilgrims seeking a premium travel experience.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-blue-500" size={20} /> 7 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Ample legroom for all rows</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-blue-500" size={20} /> 6 Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Expansive vertical cargo space</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-blue-500" size={20} /> USB Chargers
                                    </div>
                                    <p className="text-sm text-slate-500">Available at every seat</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-blue-500" size={20} /> Smart Safety
                                    </div>
                                    <p className="text-sm text-slate-500">Advanced 360 collision detection</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all border border-blue-500/20 shadow-lg shadow-blue-500/10">
                                    Book Hyundai Staria <ArrowRight size={20} />
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
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Engine & Power</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">3.5L V6 MPi</p>
                            <p className="text-sm text-slate-400">272 Horsepower</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Comfort Control</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Diffused Air Vents</p>
                            <p className="text-sm text-slate-400">Roof-mounted AC</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Luggage Capacity</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Flexible Space</p>
                            <p className="text-sm text-slate-400">Foldable Rear Seats</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Safety Tech</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Smart Sense</p>
                            <p className="text-sm text-slate-400">ADAS Suite Included</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 360 Interior Preview (Placeholder) */}
            <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4 block">Future of Travel</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-8">Step Inside</h2>

                    <div className="max-w-6xl mx-auto">
                        <Interior360Viewer
                            imageUrl="/images/fleet/staria-interior-360.jpg"
                            title="Hyundai Staria Premium Interior"
                        />
                    </div>
                    <p className="text-slate-400 mt-6 text-sm">Interactive 360° Interior View not available on mobile devices in low-data mode.</p>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Why Families Love The Staria</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Panoramic Views",
                                desc: "Large windows let you enjoy the scenic mountains and desert landscapes between Makkah and Madinah.",
                                icon: Star
                            },
                            {
                                title: "Easy Entry/Exit",
                                desc: "Dual electronic sliding doors and lower floor height make it perfect for elderly pilgrims.",
                                icon: Users
                            },
                            {
                                title: "Futuristic Design",
                                desc: "Arrive at your hotel in style with the most eye-catching van on the Saudi highways.",
                                icon: Shield
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-blue-500 transition-transform hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-blue-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={stariaFAQs} title="Hyundai Staria - Frequently Asked Questions" />
        </main>
    );
}

