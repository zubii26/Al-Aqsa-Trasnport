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

const vehicleData = pricingData.vehicles.find(v => v.id === 'mercedes');

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "Mercedes S-Class VIP Rental Makkah | Luxury Umrah",
    description: vehicleData?.seo?.description || "Book Mercedes-Benz S-Class for VIP Umrah. Ultimate luxury, silent cabin, executive transport from Jeddah Airport to Makkah/Madinah. Premium Umrah transport.",
    keywords: [
        "Mercedes S-Class Makkah",
        "VIP car rental Jeddah",
        "luxury Umrah transport",
        "Jeddah Airport VIP transfer",
        "Makkah to Madinah luxury taxi",
        "Umrah executive travel",
        "Premium Umrah transport service",
        "Mercedes Benz Umrah taxi",
        "Chauffeur service Makkah",
        "مرسيدس يخت توصيل",
        "توصيل VIP مكة",
        "VIP Ziyarat tour Makkah",
        "Madinah airport VIP transport",
        "luxury family travel Umrah",
        "VIP pilgrims transport"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/fleet/mercedes-s-class',
    },
    openGraph: {
        title: "Mercedes-Benz S-Class | Premium Umrah Transport Service",
        description: "Experience the ultimate VIP transport in Saudi Arabia with our Mercedes-Benz S-Class chauffeur service for Makkah, Madinah, and Jeddah Airport.",
        images: [{ url: '/images/fleet/mercedes-s-class-hero.png', width: 1200, height: 630, alt: 'Mercedes-Benz S-Class VIP Transport' }]
    }
};

const mercedesFAQs = [
    {
        question: "How many passengers can fit in the Mercedes-Benz S-Class?",
        answer: "The Mercedes-Benz S-Class comfortably seats 3 adult passengers. It is ideal for VIP pilgrims, couples, scholars, and executives seeking the highest level of executive comfort."
    },
    {
        question: "Is the Mercedes S-Class suitable for Makkah to Madinah travel?",
        answer: "Absolutely. With its ultra-luxury interior, AIRMATIC air suspension, and silent cabin, the S-Class ensures an incredibly relaxing, fatigue-free 4.5-hour spiritual journey between the Holy Cities."
    },
    {
        question: "Does the S-Class have enough luggage space?",
        answer: "The trunk can accommodate 2 to 3 large bags. For VIP pilgrims traveling with extensive luggage, we can arrange a supplementary luggage vehicle."
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "Mercedes-Benz S-Class VIP Rental",
        "image": "https://www.alaqsaumrahtransport.com/images/fleet/mercedes-s-class-hero.png",
        "description": "Rent a luxury Mercedes S-Class in Makkah & Madinah for VIP Umrah transport. Ultimate comfort for your spiritual journey.",
        "brand": {
            "@type": "Brand",
            "name": "Mercedes-Benz"
        },
        "offers": {
            "@type": "Offer",
            "price": "1200",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "url": "https://www.alaqsaumrahtransport.com/fleet/mercedes-s-class"
        },
        "hasCertification": "Nusuk Registered Vehicle"
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": mercedesFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
];

export default async function MercedesSClassPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20Mercedes%20S-Class%20for%20VIP%20Umrah`;

    const mercedesId = 'mercedes';
    const mercedesImage = '/images/fleet/mercedes-s-class-hero.png';

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SECTION 1: HERO OVERVIEW */}
            <Hero
                title="Mercedes-Benz S-Class – Premium Umrah Transport Service"
                subtitle="Step into unparalleled serenity and executive comfort. Experience a spiritual journey defined by safety, reliability, and ultra-luxury as you travel between the Holy Cities."
                bgImage={mercedesImage}
                badge="VIP Luxury Choice"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* SECTION 5: PRICING STRUCTURE (Moved up for conversion optimization) */}
            <FleetPricingGrid
                vehicleId={mercedesId}
                vehicleImage="/images/fleet/mercedes.png"
                vehicleType="mercedes"
                title="Transparent VIP Pricing"
                subtitle="Executive class transportation with fixed rates for per trip and per route transfers."
            />

            {/* SECTION 2: VEHICLE HIGHLIGHTS */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                            Uncompromising Luxury & Technology
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            The Mercedes-Benz S-Class sets the global standard for VIP transport, ensuring that your Umrah pilgrimage is physically effortless and spiritually focused.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Seating Capacity", desc: "3 Passengers" },
                            { icon: Briefcase, title: "Luggage Capacity", desc: "2-3 Large Bags" },
                            { icon: Star, title: "Comfort Features", desc: "Nappa Leather, Massage Seats" },
                            { icon: Shield, title: "Safety Features", desc: "Pre-Safe® Technology" },
                            { icon: Zap, title: "Technology", desc: "MBUX, 3D Surround Sound" },
                            { icon: Award, title: "Ride Quality", desc: "Silent Cabin, AIRMATIC Suspension" },
                            { icon: MapPin, title: "Fuel Efficiency", desc: "Hybrid & V6 Options" },
                            { icon: CheckCircle2, title: "Climate Control", desc: "4-Zone Thermotronic" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                                <feature.icon className="text-amber-500 mb-4" size={32} />
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
                                Ideal For VIP Pilgrims & Executives
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "VIP Pilgrims & Scholars", desc: "Ensure absolute privacy and dignity during spiritual travel." },
                                    { title: "Couples & Small Families", desc: "Perfect for a husband and wife seeking an intimate, luxurious journey." },
                                    { title: "Jeddah Airport Pickup", desc: "Start your Umrah with a premium meet-and-greet executive transfer." },
                                    { title: "Makkah ↔ Madinah Routes", desc: "Transform a 4.5-hour highway drive into a restful, silent retreat." },
                                    { title: "Exclusive Ziyarat Tours", desc: "Visit historical Islamic sites in Makkah and Madinah with ultimate prestige." },
                                ].map((useCase, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="bg-amber-500/20 p-2 rounded-full mt-1 shrink-0">
                                            <CheckCircle2 className="text-amber-600 dark:text-amber-400" size={20} />
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
                                src="/images/fleet/mercedes-s-class-hero.png"
                                alt="Mercedes S-Class VIP Interior"
                                fallbackSrc={mercedesImage}
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
                                    ['Engine', '3.0L V6 Turbocharged / V8 Options'],
                                    ['Transmission', '9G-TRONIC 9-Speed Automatic'],
                                    ['Seating', '3 Adult Passengers (Executive Configuration)'],
                                    ['Luggage', '2-3 Large Bags (500L Trunk Space)'],
                                    ['AC System', '4-Zone Automatic Climate Control (Thermotronic)'],
                                    ['Safety', 'Pre-Safe®, Active Distance Assist, 9 Airbags'],
                                    ['Entertainment', 'MBUX Tablet, Burmester® 3D Surround Sound'],
                                    ['Suspension', 'AIRMATIC Air Suspension with Adaptive Damping'],
                                    ['Doors', '4 Doors with Soft-Close Function'],
                                    ['Interior Type', 'Exclusive Nappa Leather with Ambient Lighting'],
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair text-amber-500">
                        Why Choose the S-Class for Umrah?
                    </h2>
                    <p className="text-xl leading-relaxed text-slate-300 mb-10">
                        The physical demands of Umrah require periods of profound rest. The Mercedes-Benz S-Class provides an unmatched sanctuary of peace. Its legendary silent cabin blocks out highway noise, while the advanced air suspension glides over road imperfections. For VIPs and families seeking ultimate reliability, comfort, and a smooth long-route performance across Saudi Arabia, there is simply no alternative.
                    </p>
                </div>
            </section>

            {/* SECTION 7: BOOKING CTA */}
            <section className="py-16 bg-amber-500 text-slate-900">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 font-playfair">Reserve Your VIP Experience Today</h2>
                    <p className="mb-8 font-medium max-w-2xl mx-auto">Book the Mercedes-Benz S-Class now for your upcoming Umrah journey. Available for Jeddah airport pickups and intercity transfers.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Book via WhatsApp <ArrowRight size={20} />
                        </a>
                        <Link href="/booking" className="inline-flex items-center justify-center gap-2 bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                            Book Online Now
                        </Link>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={mercedesFAQs} title="Mercedes S-Class VIP Rental - Frequently Asked Questions" />
        </main>
    );
}
