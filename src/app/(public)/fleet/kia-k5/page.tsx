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

const vehicleData = pricingData.vehicles.find(v => v.id === 'kia');

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Kia K5 Sedan Rental Makkah | Modern Transport",
    description: vehicleData?.seo?.description || "Rent Kia K5 sedan for comfortable, efficient Umrah travel. Ideal for small families and couples. Clean, modern design.",
    keywords: [
        "Kia K5 Makkah",
        "modern sedan Jeddah",
        "comfortable umrah taxi",
        "Jeddah Airport transfer",
        "Makkah hotels taxi",
        "Madinah hotels taxi",
        "fuel efficient Umrah transport",
        "small family Umrah travel",
        "couples Umrah transport",
        "كيا K5 توصيل",
        "توصيل فنادق مكة",
        "توصيل مطار جدة كيا",
        "Kia sedan rental Makkah",
        "affordable Umrah taxi",
        "modern Umrah transport"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/fleet/kia-k5',
    },
    openGraph: {
        title: "Kia K5 Sedan | Comfortable Umrah Transport",
        description: "Experience modern, smooth, and fuel-efficient travel across Saudi Arabia with our Kia K5 fleet, ideal for small families and couples.",
        images: [{ url: '/images/fleet/kia-k5-hero.png', width: 1200, height: 630, alt: 'Kia K5 Modern Sedan' }]
    }
};

const kiaFAQs = [
    {
        question: "How many passengers can fit in the Kia K5?",
        answer: "The Kia K5 comfortably seats 3 to 4 passengers, making it an excellent choice for couples or small families traveling for Umrah."
    },
    {
        question: "Is the Kia K5 comfortable for the Makkah to Madinah trip?",
        answer: "Yes, the K5 offers a modern suspension system, comfortable seating, and excellent climate control, ensuring the 4.5-hour intercity journey is smooth and pleasant."
    },
    {
        question: "How much luggage can the Kia K5 hold?",
        answer: "The trunk can easily accommodate 2 to 3 large suitcases along with some smaller carry-on bags."
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Kia K5 Modern Sedan Rental",
        "image": "https://www.alaqsaumrahtransport.com/images/fleet/kia-k5-hero.png",
        "description": "Rent a modern Kia K5 in Makkah & Madinah for comfortable and efficient Umrah transport.",
        "brand": {
            "@type": "Brand",
            "name": "Kia"
        },
        "offers": {
            "@type": "Offer",
            "price": "300",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "url": "https://www.alaqsaumrahtransport.com/fleet/kia-k5"
        },
        "hasCertification": "Nusuk Registered Vehicle"
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": kiaFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
];

export default async function KiaK5Page() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Kia%20K5%20for%20Umrah`;

    const kiaId = 'kia';
    const kiaImage = '/images/fleet/kia-k5-hero.png';

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SECTION 1: HERO OVERVIEW */}
            <Hero
                title="Kia K5 Sedan – Comfortable Umrah Transport"
                subtitle="A perfect blend of modern design, smooth ride quality, and excellent fuel efficiency. Ensuring a reliable and peaceful journey for you and your family."
                bgImage={kiaImage}
                badge="Modern & Efficient"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* SECTION 5: PRICING STRUCTURE (Moved up for conversion optimization) */}
            <FleetPricingGrid
                vehicleId={kiaId}
                vehicleImage="/images/fleet/kia.png"
                vehicleType="kia"
                title="Transparent Kia K5 Pricing"
                subtitle="Affordable, modern transportation with fixed rates for per trip and per route transfers."
            />

            {/* SECTION 2: VEHICLE HIGHLIGHTS */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                            Engineered for Comfort & Efficiency
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            The Kia K5 redefines the modern sedan experience, offering advanced technology and a spacious interior that makes every spiritual journey across Saudi Arabia completely stress-free.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Seating Capacity", desc: "3-4 Passengers" },
                            { icon: Briefcase, title: "Luggage Capacity", desc: "2-3 Large Bags" },
                            { icon: Star, title: "Comfort Features", desc: "Ergonomic Seats, Ample Legroom" },
                            { icon: Shield, title: "Safety Features", desc: "Advanced Driver Assistance" },
                            { icon: Zap, title: "Technology", desc: "Modern Infotainment System" },
                            { icon: Award, title: "Ride Quality", desc: "Smooth & Stable Suspension" },
                            { icon: MapPin, title: "Fuel Efficiency", desc: "Excellent MPG for Long Routes" },
                            { icon: CheckCircle2, title: "Climate Control", desc: "Dual-Zone AC" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                                <feature.icon className="text-blue-500 mb-4" size={32} />
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
                                Ideal For Couples & Small Families
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Small Families", desc: "Spacious enough to keep the family comfortable during transfers." },
                                    { title: "Couples & Individuals", desc: "A sleek, modern, and private ride for two." },
                                    { title: "Jeddah Airport Pickup", desc: "Efficient and prompt transfers from the terminal directly to your Makkah hotel." },
                                    { title: "Makkah ↔ Madinah Routes", desc: "Smooth highway cruising ensuring you arrive rested for your prayers." },
                                    { title: "Hotel Transfers", desc: "Navigate Makkah and Madinah city traffic with ease and style." },
                                ].map((useCase, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="bg-blue-500/20 p-2 rounded-full mt-1 shrink-0">
                                            <CheckCircle2 className="text-blue-600 dark:text-blue-400" size={20} />
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
                                src="/images/fleet/kia-k5-hero.png"
                                alt="Kia K5 Exterior"
                                fallbackSrc={kiaImage}
                                className="object-cover w-full h-full"
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
                                    ['Engine', '2.5L 4-Cylinder (Highly Efficient)'],
                                    ['Transmission', '8-Speed Automatic'],
                                    ['Seating', '3-4 Passengers'],
                                    ['Luggage', '2-3 Large Bags (Generous Trunk Space)'],
                                    ['AC System', 'Dual-Zone Automatic Climate Control'],
                                    ['Safety', 'Forward Collision-Avoidance, Lane Keeping Assist'],
                                    ['Entertainment', 'Touchscreen Display, Bluetooth, USB Ports'],
                                    ['Suspension', 'MacPherson Strut (Front) / Multi-link (Rear)'],
                                    ['Doors', '4 Doors'],
                                    ['Interior Type', 'Premium Cloth / Synthetic Leather Options'],
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-blue-500">
                        Why Choose the Kia K5 for Umrah?
                    </h2>
                    <p className="text-xl leading-relaxed text-slate-300 mb-10">
                        The Kia K5 represents the smart choice for modern pilgrims. It strikes the perfect balance between affordability, striking modern design, and robust reliability. Its exceptional fuel efficiency makes it cost-effective, while its spacious cabin and smooth suspension ensure your family remains comfortable and relaxed during the long, spiritual routes across the Kingdom.
                    </p>
                </div>
            </section>

            {/* SECTION 7: BOOKING CTA */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-playfair">Reserve Your Kia K5 Today</h2>
                    <p className="mb-8 font-medium max-w-2xl mx-auto text-blue-100">Book the Kia K5 now for your upcoming Umrah journey. Reliable, modern, and perfectly suited for your transport needs.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Book via WhatsApp <ArrowRight size={20} />
                        </a>
                        <Link href="/booking" className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                            Book Online Now
                        </Link>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={kiaFAQs} title="Kia K5 Sedan Rental - Frequently Asked Questions" />
        </main>
    );
}
