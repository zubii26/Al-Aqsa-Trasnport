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

const vehicleData = pricingData.vehicles.find(v => v.id === 'xpander');

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Mitsubishi Xpander 7-Seater Rental Makkah | Family Van",
    description: vehicleData?.seo?.description || "Rent Mitsubishi Xpander 7-seater for family Umrah trips. Spacious interior, smooth suspension, ideal for Makkah to Madinah transport.",
    keywords: [
        "Mitsubishi Xpander Makkah",
        "7 seater family car",
        "affordable umrah van",
        "Jeddah Airport family transport",
        "Makkah to Madinah 7 seater",
        "family Umrah travel",
        "spacious Umrah car",
        "Mitsubishi van rental Jeddah",
        "ميتسوبيشي اكسباندر توصيل",
        "توصيل عائلات مكة",
        "سيارة عائلية 7 راكب للعمرة",
        "Jeddah to Makkah family taxi",
        "Umrah group of 6 transport",
        "Mitsubishi Xpander rental KSA"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/fleet/mitsubishi-xpander',
    },
    openGraph: {
        title: "Mitsubishi Xpander | 7-Seater Family Transport",
        description: "Comfortable, spacious, and affordable 7-seater family transport across Saudi Arabia with our Mitsubishi Xpander fleet.",
        images: [{ url: '/images/fleet/mitsubishi-xpander-hero.png', width: 1200, height: 630, alt: 'Mitsubishi Xpander 7-Seater' }]
    }
};

const xpanderFAQs = [
    {
        question: "How many passengers can fit in the Mitsubishi Xpander?",
        answer: "The Mitsubishi Xpander is a 7-seater vehicle. It is perfect for medium-sized families (up to 6 passengers plus the driver) traveling together."
    },
    {
        question: "Is the Xpander comfortable for long trips like Makkah to Madinah?",
        answer: "Yes, the Xpander features a very spacious cabin, flexible seating, and a smooth suspension system designed to handle long-distance family road trips comfortably."
    },
    {
        question: "How much luggage can the Xpander carry?",
        answer: "When configured for 5-6 passengers, the rear cargo area and folded rear seats can comfortably hold 3 to 4 large suitcases."
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Mitsubishi Xpander 7-Seater Rental",
        "image": "https://www.alaqsaumrahtransport.com/images/fleet/mitsubishi-xpander-hero.png",
        "description": "Rent a Mitsubishi Xpander 7-seater in Makkah & Madinah for affordable, comfortable family Umrah transport.",
        "brand": {
            "@type": "Brand",
            "name": "Mitsubishi"
        },
        "offers": {
            "@type": "Offer",
            "price": "400",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "url": "https://www.alaqsaumrahtransport.com/fleet/mitsubishi-xpander"
        },
        "hasCertification": "Nusuk Registered Vehicle"
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": xpanderFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
];

export default async function MitsubishiXpanderPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Mitsubishi%20Xpander%20for%20Family`;

    const xpanderId = 'xpander';
    const xpanderImage = '/images/fleet/mitsubishi-xpander-hero.png';

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SECTION 1: HERO OVERVIEW */}
            <Hero
                title="Mitsubishi Xpander – Premium 7-Seater Family Transport"
                subtitle="The ultimate family vehicle for your spiritual journey. Enjoy exceptional spaciousness, a smooth ride, and peace of mind as your family travels across the Holy Cities in complete comfort."
                bgImage={xpanderImage}
                badge="Family Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* SECTION 5: PRICING STRUCTURE (Moved up for conversion optimization) */}
            <FleetPricingGrid
                vehicleId={xpanderId}
                vehicleImage="/images/fleet/xpander.png"
                vehicleType="xpander"
                title="Transparent Family Pricing"
                subtitle="Affordable, family-friendly transportation with fixed rates for all major Umrah routes."
            />

            {/* SECTION 2: VEHICLE HIGHLIGHTS */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                            Designed for Family Harmony
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            The Mitsubishi Xpander is built from the ground up for families. It provides an exceptionally quiet, spacious, and highly configurable interior, ensuring everyone from toddlers to grandparents travels in comfort.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Seating Capacity", desc: "6-7 Passengers" },
                            { icon: Briefcase, title: "Luggage Capacity", desc: "3-4 Large Bags" },
                            { icon: Star, title: "Comfort Features", desc: "Flexible Seating Layouts" },
                            { icon: Shield, title: "Safety Features", desc: "Dual Airbags, ABS, ASC" },
                            { icon: Zap, title: "Technology", desc: "Multiple Power Outlets" },
                            { icon: Award, title: "Ride Quality", desc: "Smooth Family Suspension" },
                            { icon: MapPin, title: "Fuel Efficiency", desc: "Economical 1.5L Engine" },
                            { icon: CheckCircle2, title: "Climate Control", desc: "Front & Rear AC Vents" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                                <feature.icon className="text-emerald-500 mb-4" size={32} />
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
                                Ideal For Families with Children
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Medium to Large Families", desc: "Keep your entire family together in one spacious vehicle." },
                                    { title: "Traveling with Children", desc: "Ample room for kids to be comfortable and entertained." },
                                    { title: "Jeddah Airport Pickup", desc: "Easily accommodate your family and luggage straight from the flight." },
                                    { title: "Makkah ↔ Madinah Routes", desc: "A smooth, relaxing 4.5-hour journey allowing the family to rest." },
                                    { title: "City Ziyarat Tours", desc: "Conveniently hop in and out during tours of Islamic historical sites." },
                                ].map((useCase, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="bg-emerald-500/20 p-2 rounded-full mt-1 shrink-0">
                                            <CheckCircle2 className="text-emerald-600 dark:text-emerald-400" size={20} />
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
                                src="/images/fleet/mitsubishi-xpander-hero.png"
                                alt="Mitsubishi Xpander Family Interior"
                                fallbackSrc={xpanderImage}
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
                                    ['Engine', '1.5L MIVEC DOHC 16-Valve'],
                                    ['Transmission', '4-Speed Automatic'],
                                    ['Seating', '7 Seats (3 Rows)'],
                                    ['Luggage', '3-4 Large Bags (Configurable Seating)'],
                                    ['AC System', 'Manual AC with Rear Climate Control Vents'],
                                    ['Safety', 'Anti-lock Braking System (ABS), Active Stability Control'],
                                    ['Entertainment', '7-inch Smartphone-link Display Audio (SDA)'],
                                    ['Suspension', 'MacPherson Strut (Front) / Torsion Beam (Rear)'],
                                    ['Doors', '5 Doors (Including Rear Hatch)'],
                                    ['Interior Type', 'High-Grade Fabric Seating'],
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-emerald-500">
                        Why Choose the Xpander for Family Umrah?
                    </h2>
                    <p className="text-xl leading-relaxed text-slate-300 mb-10">
                        Traveling for Umrah with a family requires space, patience, and reliability. The Mitsubishi Xpander excels in all three. Its exceptional suspension smooths out highway vibrations, while the dedicated rear AC vents keep everyone cool in the Saudi heat. It eliminates the need for families to split into multiple cars, keeping your group together in harmony throughout the spiritual journey.
                    </p>
                </div>
            </section>

            {/* SECTION 7: BOOKING CTA */}
            <section className="py-16 bg-emerald-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-playfair">Reserve Your Family Transport Today</h2>
                    <p className="mb-8 font-medium max-w-2xl mx-auto text-emerald-50">Book the Mitsubishi Xpander now to ensure your family travels comfortably and securely for your upcoming Umrah.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Book via WhatsApp <ArrowRight size={20} />
                        </a>
                        <Link href="/booking" className="inline-flex items-center justify-center gap-2 bg-white text-emerald-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                            Book Online Now
                        </Link>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={xpanderFAQs} title="Mitsubishi Xpander Rental - Frequently Asked Questions" />
        </main>
    );
}
