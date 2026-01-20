import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, LayoutGrid } from 'lucide-react';
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

const vehicleData = pricingData.vehicles.find(v => v.id === 'starex');

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": vehicleData?.seo?.title || "Hyundai H1 Starex Van Rental",
    "image": "https://alaqsaumrahtransport.com/images/fleet/starex-hero-professional.png",
    "description": vehicleData?.seo?.description || "Rent Hyundai H1 Starex 7-seater van in Makkah. Spacious family transport for Umrah.",
    "brand": { "@type": "Brand", "name": "Hyundai" },
    "offers": { "@type": "Offer", "price": "250", "priceCurrency": "SAR", "availability": "https://schema.org/InStock" }
};

export const metadata: Metadata = {
    title: vehicleData?.seo?.title,
    description: vehicleData?.seo?.description,
    keywords: vehicleData?.seo?.keywords,
    alternates: { canonical: 'https://alaqsaumrahtransport.com/fleet/hyundai-starex' },
    openGraph: {
        title: vehicleData?.seo?.title,
        description: vehicleData?.seo?.description,
        images: [{ url: '/images/fleet/starex-hero-professional.png', width: 1200, height: 630, alt: 'Hyundai H1 Starex' }]
    }
};

const starexFAQs = [
    {
        question: "How many passengers fits in Hyundai H1 Starex?",
        answer: "The Hyundai H1 Starex is spacious and seats up to 7 passengers comfortably, making it an excellent choice for medium-sized families or groups."
    },
    {
        question: "Is there enough space for luggage?",
        answer: "Yes, the H1 has a generous cargo area that can easily accommodate 5-6 standard suitcases along with the passengers."
    },
    {
        question: "Is this vehicle suitable for long distance travel in Saudi Arabia?",
        answer: "Absolutely. The H1 is built for long journeys, offering good legroom, dual air conditioning, and a stable ride on highways between Jeddah, Makkah, and Madinah."
    },
];

export default async function HyundaiStarexPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Hyundai%20H1%20Starex%20for%20Umrah`;

    // Hyundai Starex ID: 692db09834f15bc89b45a5fa
    const starexId = '692db09834f15bc89b45a5fa';
    const starexImage = '/images/fleet/starex-hero-professional.png';

    return (
        <main className="overflow-x-hidden">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            <Hero
                title="Hyundai H1 Starex | Best Family Van for Umrah"
                subtitle="The practical choice for family travel between Jeddah, Makkah, and Madinah. Reliable, spacious, and perfect for groups."
                bgImage={starexImage}
                badge="Family Favorite"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={starexId}
                vehicleImage="/images/fleet/starex.png"
                vehicleType="starex"
                title="Hyundai Starex Rates | Jeddah, Makkah, Madinah"
                subtitle="Affordable comfort for up to 7 passengers. Great value for group travel."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/starex-feature.png"
                                alt="Hyundai H1 Starex Interior"
                                fallbackSrc={starexImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Value Choice
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Book Hyundai Starex for Makkah Travel?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                The Hyundai H1 (Starex) is the top choice for families performing Umrah. It offers excellent value for trips from Jeddah Airport to Makkah and
                                provides a comfortable ride for Ziyarat tours in the Holy Cities.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-teal-500" size={20} /> 7 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Ample room for full families</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-teal-500" size={20} /> 6 Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Large rear cargo capacity</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <LayoutGrid className="text-teal-500" size={20} /> High Roof
                                    </div>
                                    <p className="text-sm text-slate-500">Easy movement inside cabin</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-teal-500" size={20} /> Dual AC
                                    </div>
                                    <p className="text-sm text-slate-500">Dedicated vents for rear seats</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-teal-500/20">
                                    Book Hyundai H1 Now <ArrowRight size={20} />
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
                            <p className="font-bold text-xl text-slate-900 dark:text-white">2.4L MPi</p>
                            <p className="text-sm text-slate-400">Reliable Performance</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Climate Control</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Dual AC System</p>
                            <p className="text-sm text-slate-400">Front & Rear Control</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Space Layout</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Swivel Seats</p>
                            <p className="text-sm text-slate-400">Flexible Configuration</p>
                        </div>
                        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <h3 className="font-bold text-slate-500 uppercase text-xs tracking-wider mb-2">Convenience</h3>
                            <p className="font-bold text-xl text-slate-900 dark:text-white">Dual Sliding Doors</p>
                            <p className="text-sm text-slate-400">Easy Access</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 360 Interior Preview (Placeholder) */}
            <section className="py-16 bg-slate-900 text-white overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-10"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <span className="text-teal-500 font-bold tracking-widest uppercase text-sm mb-4 block">Budget Friendly Comfort</span>
                    <h2 className="text-3xl md:text-5xl font-bold font-playfair mb-8">Step Inside</h2>

                    <div className="max-w-6xl mx-auto">
                        <Interior360Viewer
                            imageUrl="/images/fleet/starex-interior-360.jpg"
                            title="Hyundai H1 Starex Interior"
                        />
                    </div>
                    <p className="text-slate-400 mt-6 text-sm">Interactive 360° Interior View not available on mobile devices in low-data mode.</p>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Reliability for Every Trip</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Airport Transfers",
                                desc: "The perfect size for a family and all their luggage arriving at Jeddah or Madinah.",
                                icon: Briefcase
                            },
                            {
                                title: "Full Day Ziyarat",
                                desc: "Private, air-conditioned, and flexible for visiting holy sites at your own pace.",
                                icon: Star
                            },
                            {
                                title: "Intercity Highway",
                                desc: "Stable and comfortable for the long highway stretch between Makker and Madinah.",
                                icon: Shield
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-teal-500 transition-all hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-teal-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={starexFAQs} title="Hyundai H1 Starex - Frequently Asked Questions" />
        </main>
    );
}
