import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import Link from 'next/link';
import { ArrowRight, Shield, Star, Briefcase, Users, MapPin, CheckCircle2, Award, Zap } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import FleetPricingGrid from '@/components/fleet/FleetPricingGrid';
import FleetFeatureImage from '@/components/fleet/FleetFeatureImage';

import pricingData from '@/data/pricing.json';

const vehicleData = pricingData.vehicles.find(v => v.id === 'coaster');

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Toyota Coaster Rental Makkah | 22-30 Seater Bus",
    description: vehicleData?.seo?.description || "Rent a Toyota Coaster for large Umrah groups. Seats 22-30 passengers with dedicated AC vents, wide windows, and large luggage capacity.",
    keywords: [
        "Toyota Coaster Makkah",
        "22 seater bus Jeddah",
        "30 seater bus Umrah",
        "group Umrah transport",
        "Ziyarat tours bus",
        "Toyota minibus rental Makkah",
        "Jeddah Airport group transfer",
        "Makkah to Madinah bus",
        "Umrah package bus",
        "تويوتا كوستر للعمرة",
        "باص 30 راكب مكة",
        "توصيل مجموعات مطار جدة",
        "large family Umrah transport",
        "group travel Saudi Arabia"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/fleet/toyota-coaster',
    },
    openGraph: {
        title: "Toyota Coaster | 22-30 Seater Group Transport",
        description: "Reliable, comfortable, and spacious group travel across Saudi Arabia with our Toyota Coaster fleet.",
        images: [{ url: '/images/fleet/coaster.png', width: 1200, height: 630, alt: 'Toyota Coaster 30 Seater Bus' }]
    }
};

const coasterFAQs = [
    {
        question: "How many passengers can the Toyota Coaster accommodate?",
        answer: "The Toyota Coaster offers versatile seating configurations, comfortably accommodating between 22 to 30 passengers, making it the premier choice for large Umrah groups."
    },
    {
        question: "Does the Coaster have adequate air conditioning for all passengers?",
        answer: "Yes, the Coaster is equipped with a powerful central AC system and individual AC vents above all seats to ensure every passenger stays cool during the journey."
    },
    {
        question: "Is there enough room for group luggage?",
        answer: "Absolutely. It features large, dedicated luggage compartments designed specifically to hold the suitcases and belongings of large traveling groups."
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Toyota Coaster Group Rental",
        "image": "https://www.alaqsaumrahtransport.com/images/fleet/coaster.png",
        "description": "Rent a Toyota Coaster in Makkah & Madinah for comfortable and spacious group Umrah transport.",
        "brand": {
            "@type": "Brand",
            "name": "Toyota"
        },
        "offers": {
            "@type": "Offer",
            "price": "650",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "url": "https://www.alaqsaumrahtransport.com/fleet/toyota-coaster"
        },
        "hasCertification": "Nusuk Registered Vehicle"
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": coasterFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
];

export default async function ToyotaCoasterPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Toyota%20Coaster%20for%20Group`;

    const coasterId = 'coaster';
    const coasterImage = '/images/fleet/coaster-hero.png';

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SECTION 1: HERO OVERVIEW */}
            <Hero
                title="Toyota Coaster – Group Umrah Transport"
                subtitle="The benchmark for reliable group travel. Keep your entire congregation together with wide windows, individual AC vents, and comfortable long-route seating."
                bgImage={coasterImage}
                badge="Group Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* SECTION 5: PRICING STRUCTURE (Moved up for conversion optimization) */}
            <FleetPricingGrid
                vehicleId={coasterId}
                vehicleImage="/images/fleet/coaster.png"
                vehicleType="coaster"
                title="Transparent Group Pricing"
                subtitle="Cost-effective, reliable minibus transportation with fixed rates for group transfers."
            />

            {/* SECTION 2: VEHICLE HIGHLIGHTS */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                            Engineered for Group Comfort
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            The Toyota Coaster is designed specifically for large groups, ensuring that every pilgrim travels together safely and comfortably without feeling cramped.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Seating Capacity", desc: "22-30 Passengers" },
                            { icon: Briefcase, title: "Luggage Capacity", desc: "Large Compartments" },
                            { icon: Star, title: "Comfort Features", desc: "High-back Comfortable Seats" },
                            { icon: Shield, title: "Safety Features", desc: "ABS, Dual Airbags" },
                            { icon: Zap, title: "Visibility", desc: "Wide Panoramic Windows" },
                            { icon: Award, title: "Ride Quality", desc: "Heavy-duty Suspension" },
                            { icon: MapPin, title: "Engine Power", desc: "Reliable Toyota Diesel" },
                            { icon: CheckCircle2, title: "Climate Control", desc: "Individual AC Vents" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                                <feature.icon className="text-red-600 mb-4" size={32} />
                                <h3 className="font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SECTION 3: IDEAL USE CASES */}
            <section className="py-20 bg-slate-100 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-3xl md:text-4xl font-bold mb-8 font-playfair text-slate-800 dark:text-white">
                                Ideal For Large Umrah Groups
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Tour Agencies & Groups", desc: "Keep groups of 20-30 people united in one high-capacity vehicle." },
                                    { title: "Extended Families", desc: "Perfect for large, multi-generational families traveling together." },
                                    { title: "City Ziyarat Tours", desc: "Wide windows provide excellent visibility for sightseeing in Makkah and Madinah." },
                                    { title: "Jeddah Airport Arrival", desc: "Efficiently transport large groups directly from the terminal with all luggage." },
                                    { title: "Makkah ↔ Madinah Routes", desc: "Comfortable high-backed seats ensure rest during the long intercity drive." },
                                ].map((useCase, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="bg-red-600/20 p-2 rounded-full mt-1 shrink-0">
                                            <CheckCircle2 className="text-red-600 dark:text-red-400" size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100">{useCase.title}</h4>
                                            <p className="text-slate-600 dark:text-slate-400">{useCase.desc}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="order-1 lg:order-2 relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                            <FleetFeatureImage
                                src="/images/fleet/coaster.png"
                                alt="Toyota Coaster Exterior"
                                fallbackSrc={coasterImage}
                                className="object-contain bg-white w-full h-full p-4"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: DETAILED SPECIFICATIONS TABLE */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-10 font-playfair text-slate-800 dark:text-white">Detailed Specifications</h2>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {[
                                    ['Engine', '4.2L Diesel Engine (High Durability)'],
                                    ['Transmission', '5-Speed Manual / Automatic Options'],
                                    ['Seating', '22 - 30 Passenger Configurations'],
                                    ['Luggage', 'Dedicated Group Luggage Compartments'],
                                    ['AC System', 'Heavy-Duty AC with Individual Roof Vents'],
                                    ['Safety', 'Anti-lock Braking System (ABS), Seatbelts for all'],
                                    ['Entertainment', 'PA System (Microphone for Guide), Radio/CD'],
                                    ['Suspension', 'Double Wishbone (Front) / Leaf Spring (Rear)'],
                                    ['Doors', 'Automatic Folding Passenger Door'],
                                    ['Interior Type', 'Durable Fabric / Vinyl combination'],
                                ].map((row, idx) => (
                                    <tr key={idx} className="border-b border-slate-200 dark:border-slate-700 last:border-0 hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors">
                                        <th className="p-4 font-bold text-slate-700 dark:text-slate-300 w-1/3 bg-slate-100/50 dark:bg-slate-800/50">{row[0]}</th>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{row[1]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* SECTION 6: WHY CHOOSE THIS VEHICLE */}
            <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/pattern-islamic.png')] bg-repeat"></div>
                <div className="container mx-auto px-4 relative z-10 text-center max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-red-500">
                        Why Choose the Toyota Coaster for Umrah?
                    </h2>
                    <p className="text-xl leading-relaxed text-slate-300 mb-10">
                        When organizing an Umrah tour, logistics can be challenging. The Toyota Coaster simplifies group travel by offering unparalleled reliability and massive capacity. Instead of coordinating multiple vans, your entire group stays together, allowing guides to use the onboard PA system to recite Talbiyah and provide spiritual guidance collectively.
                    </p>
                </div>
            </section>

            {/* SECTION 7: BOOKING CTA */}
            <section className="py-16 bg-red-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-playfair">Reserve Your Group Minibus Today</h2>
                    <p className="mb-8 font-medium max-w-2xl mx-auto text-red-50">Book the Toyota Coaster now to ensure your Umrah group travels comfortably, safely, and securely across Saudi Arabia.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Book via WhatsApp <ArrowRight size={20} />
                        </a>
                        <Link href="/booking" className="inline-flex items-center justify-center gap-2 bg-white text-red-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                            Book Online Now
                        </Link>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={coasterFAQs} title="Toyota Coaster Rental - Frequently Asked Questions" />
        </main>
    );
}
