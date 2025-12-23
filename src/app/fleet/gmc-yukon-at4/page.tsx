import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, Wifi, MapPin } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

export const metadata: Metadata = {
    title: "GMC Yukon Umrah Taxi | Luxury 7-Seater for Makkah to Madinah",
    description: "Book 2025 GMC Yukon XL for VIP Umrah transport. Luxury 7-seater SUV for Jeddah Airport to Makkah, Madinah transfers, and Ziyarat. Spacious, comfortable, and reliable.",
    keywords: [
        "GMC Yukon Umrah Taxi",
        "GMC Yukon XL Makkah",
        "Jeddah Airport to Makkah GMC",
        "Makkah to Madinah VIP Transport",
        "Luxury SUV Rental Saudi Arabia",
        "7 Seater Taxi Jeddah",
        "Private Umrah Transport",
        "GMC Taxi Madinah"
    ],
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/fleet/gmc-yukon-at4',
    }
};

const gmcFAQs = [
    {
        question: "How many passengers can fit in the GMC Yukon?",
        answer: "The GMC Yukon XL comfortably seats up to 7 passengers (including children). However, for maximum comfort with luggage, we recommend it for 4-5 adults + 5 large suitcases."
    },
    {
        question: "Is the GMC Yukon suitable for Makkah to Madinah travel?",
        answer: "Absolutely. It is the most popular choice for the 4.5-hour journey between Holy Cities. With its premium suspension, leather seats, and dual AC, it ensures a fatigue-free journey for pilgrims."
    },
    {
        question: "What is the price for GMC Yukon from Jeddah Airport to Makkah?",
        answer: "Our rates are competitive for VIP service. Please use the booking grid to get an instant quote or contact us via WhatsApp for the best seasonal offers."
    },
];

export default async function GmcYukonPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20GMC%20Yukon%20for%20Umrah`;

    // GMC Yukon ID: 692db09834f15bc89b45a5f8
    const gmcId = '692db09834f15bc89b45a5f8';
    const gmcImage = '/images/fleet/gmc.png';

    return (
        <main className="overflow-x-hidden">
            <Hero
                title="GMC Yukon 2025 | VIP Umrah Transport Makkah & Madinah"
                subtitle="Travel in unmatched luxury between Jeddah, Makkah, and Madinah. The preferred 7-seater choice for families and VIP pilgrims."
                bgImage={gmcImage}
                badge="VIP Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
            />

            <FleetPricingGrid
                vehicleId={gmcId}
                vehicleImage={gmcImage}
                vehicleType="gmc"
                title="VIP GMC Yukon Rates | Jeddah, Makkah & Madinah"
                subtitle="The pinnacle of comfort for your spiritual journey. Transparent VIP pricing for all routes."
            />

            {/* Vehicle Highlights */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/gmc-yukon-feature.png"
                                alt="GMC Yukon Denali XL"
                                fallbackSrc={gmcImage}
                                className="object-cover w-full h-full hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute bottom-4 left-4 bg-amber-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                Top Rated Vehicle
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                                Why Choose GMC Yukon for Umrah Travel?
                            </h2>
                            <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                                The GMC Yukon XL defines luxury travel in Saudi Arabia. Perfect for Jeddah Airport pickups and comfortable journeys between Makkah and Madinah,
                                this vehicle offers American luxury, massive space, and top-tier safety for your family.
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Users className="text-amber-500" size={20} /> 7 Passengers
                                    </div>
                                    <p className="text-sm text-slate-500">Spacious seating for the whole family</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Briefcase className="text-amber-500" size={20} /> 5+ Suitcases
                                    </div>
                                    <p className="text-sm text-slate-500">Massive trunk space for luggage</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Wifi className="text-amber-500" size={20} /> Free WiFi
                                    </div>
                                    <p className="text-sm text-slate-500">Stay connected during your journey</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-white">
                                        <Shield className="text-amber-500" size={20} /> 5-Star Safety
                                    </div>
                                    <p className="text-sm text-slate-500">Advanced airbags and stability</p>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link href="/booking" className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-amber-500/20">
                                    Book GMC Yukon Now <ArrowRight size={20} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-16 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12 font-playfair">Perfect For Every Journey</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Makkah to Madinah",
                                desc: "The 450km journey feels like a breeze in the quiet, air-conditioned cabin of the Yukon.",
                                icon: Star
                            },
                            {
                                title: "Jeddah Airport Pickup",
                                desc: "VIP meet and greet. Our driver will fit all your luggage easily, unlike standard taxis.",
                                icon: Briefcase
                            },
                            {
                                title: "Ziyarat Tours",
                                desc: "Visit historical sites in Makkah and Madinah with high elevation views and tinted privacy windows.",
                                icon: MapPin
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-xl shadow-md border-t-4 border-amber-500 transition-all hover:-translate-y-1">
                                <item.icon className="w-10 h-10 text-amber-500 mb-4" />
                                <h3 className="text-xl font-bold mb-2 text-slate-800 dark:text-white">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={gmcFAQs} title="GMC Yukon Rental - Frequently Asked Questions" />
        </main>
    );
}
