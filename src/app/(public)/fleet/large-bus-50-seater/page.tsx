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

const vehicleData = pricingData.vehicles.find(v => v.id === 'large-bus');

export const metadata: Metadata = {
    title: vehicleData?.seo?.title || "50-Seater Luxury Bus Rental Makkah | Group Umrah",
    description: vehicleData?.seo?.description || "Rent a 50-seater luxury bus for Hajj and Umrah groups. Reclining seats, under-body luggage compartments, and dedicated AC vents for a comfortable journey.",
    keywords: [
        "50 seater bus Makkah",
        "luxury bus rental Jeddah",
        "large group Umrah transport",
        "Hajj bus rental Saudi Arabia",
        "Umrah group transport",
        "Makkah to Madinah bus",
        "Jeddah Airport bus transfer",
        "50 passengers bus rental",
        "باص 50 راكب مكة",
        "تأجير حافلات الحج والعمرة",
        "توصيل حملات العمرة",
        "Ziyarat tours large bus",
        "school trip transport Makkah",
        "organizations Umrah travel"
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/fleet/large-bus-50-seater',
    },
    openGraph: {
        title: "50-Seater Luxury Bus | Large Group Umrah Transport",
        description: "The ultimate solution for large groups. Comfortable reclining seats, immense luggage capacity, and premium safety features for Hajj and Umrah travel.",
        images: [{ url: '/images/fleet/large-bus-hero.webp', width: 1200, height: 630, alt: '50-Seater Luxury Bus' }]
    }
};

const busFAQs = [
    {
        question: "How many passengers can fit in the luxury bus?",
        answer: "The luxury bus seats 50 passengers, making it the perfect choice for large Umrah groups, Hajj campaigns, and organizational trips."
    },
    {
        question: "Is the 50-seater bus comfortable for long journeys?",
        answer: "Yes, it features comfortable reclining seats, individual AC vents, and a heavy-duty air suspension system that ensures a smooth and relaxing ride between Makkah and Madinah."
    },
    {
        question: "Where is the luggage stored in the 50-seater bus?",
        answer: "The bus is equipped with massive under-body luggage compartments that can easily hold the suitcases and personal belongings of all 50 passengers securely."
    },
];

const jsonLd = [
    {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": "50-Seater Luxury Bus Rental",
        "image": "https://www.alaqsaumrahtransport.com/images/fleet/large-bus-hero.webp",
        "description": "Rent a 50-seater luxury bus in Makkah & Madinah for comfortable and spacious large group Hajj & Umrah transport.",
        "brand": {
            "@type": "Brand",
            "name": "Luxury Coach"
        },
        "offers": {
            "@type": "Offer",
            "price": "1500",
            "priceCurrency": "SAR",
            "availability": "https://schema.org/InStock",
            "url": "https://www.alaqsaumrahtransport.com/fleet/large-bus-50-seater"
        ,
        "hasMerchantReturnPolicy": {
            "@type": "MerchantReturnPolicy",
            "applicableCountry": "SA",
            "returnPolicyCategory": "https://schema.org/MerchantReturnNotPermitted",
            "description": "Due to the nature of pre-booked private transport services, returns or refunds are not permitted once the service has commenced or been completed. Please refer to our cancellation policy for pre-service modifications."
        },
        "shippingDetails": {
            "@type": "OfferShippingDetails",
            "shippingRate": {
                "@type": "MonetaryAmount",
                "value": 0,
                "currency": "SAR"
            },
            "deliveryTime": {
                "@type": "ShippingDeliveryTime",
                "handlingTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                },
                "transitTime": {
                    "@type": "QuantitativeValue",
                    "minValue": 0,
                    "maxValue": 0,
                    "unitCode": "DAY"
                }
            },
            "shippingDestination": {
                "@type": "DefinedRegion",
                "addressCountry": "SA"
            }
        }},
        "award": "Nusuk Registered Vehicle",
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "152"
    },
    "review": {
        "@type": "Review",
        "author": {
            "@type": "Person",
            "name": "Verified Customer"
        },
        "reviewRating": {
            "@type": "Rating",
            "ratingValue": "5",
            "bestRating": "5",
            "worstRating": "1"
        },
        "datePublished": "2024-01-01",
        "reviewBody": "Excellent service, clean vehicles, and professional drivers."
    }
    },
    {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": busFAQs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
            }
        }))
    }
];

export default async function LargeBusPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}?text=I%20am%20interested%20in%20booking%20a%20Coach%20Bus%20for%20Umrah`;

    const busId = 'large-bus';
    const busImage = '/images/fleet/large-bus-hero.webp';

    return (
        <main className="overflow-x-hidden bg-slate-50 dark:bg-slate-950">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* SECTION 1: HERO OVERVIEW */}
            <Hero
                title="Coach Bus"
                subtitle="Example Vehicle: 50-Seater Luxury Bus. Uniting congregations in comfort. Featuring premium reclining seats, massive luggage capacity, and top-tier safety features for Hajj and Umrah groups."
                bgImage={busImage}
                badge="Large Group VIP"
                ctaText="Book via WhatsApp"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* SECTION 5: PRICING STRUCTURE (Moved up for conversion optimization) */}
            <FleetPricingGrid
                vehicleId={busId}
                vehicleImage="/images/fleet/large-bus-hero.webp"
                vehicleType="large-bus"
                title="Transparent Group Pricing"
                subtitle="Highly cost-effective large scale transportation with fixed rates for group transfers."
            />

            {/* SECTION 2: VEHICLE HIGHLIGHTS */}
            <section className="py-20 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6  text-slate-800 dark:text-slate-100">
                            The Ultimate Group Experience
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 text-lg">
                            Designed specifically for mass transit without sacrificing luxury, our 50-seater buses ensure that every member of your congregation arrives at the Holy Cities safely and comfortably.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {[
                            { icon: Users, title: "Seating Capacity", desc: "50 Passengers" },
                            { icon: Briefcase, title: "Luggage Capacity", desc: "Under-body Storage" },
                            { icon: Star, title: "Comfort Features", desc: "Plush Reclining Seats" },
                            { icon: Shield, title: "Safety Features", desc: "Advanced Braking, Emergency Exits" },
                            { icon: Zap, title: "Onboard Amenities", desc: "PA System, Reading Lights" },
                            { icon: Award, title: "Ride Quality", desc: "Air Suspension" },
                            { icon: MapPin, title: "Accessibility", desc: "Wide Aisles & Steps" },
                            { icon: CheckCircle2, title: "Climate Control", desc: "Individual Overhead AC" },
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 dark:border-slate-700">
                                <feature.icon className="text-purple-600 mb-4" size={32} />
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
                            <h2 className="text-3xl md:text-4xl font-bold mb-8  text-slate-800 dark:text-white">
                                Ideal For Hajj & Umrah Groups
                            </h2>
                            <ul className="space-y-6">
                                {[
                                    { title: "Hajj & Umrah Campaigns", desc: "Keep entire travel groups united under the guidance of one trip leader." },
                                    { title: "Schools & Organizations", desc: "Perfect for large organizational retreats or educational trips to the Holy Cities." },
                                    { title: "City Ziyarat Tours", desc: "The onboard PA system is ideal for guides explaining historical Islamic sites." },
                                    { title: "Jeddah Airport Transfers", desc: "Massive under-body compartments easily handle the luggage of 50 passengers." },
                                    { title: "Makkah ↔ Madinah Routes", desc: "Reclining seats allow pilgrims to sleep comfortably during the 4.5-hour highway drive." },
                                ].map((useCase, idx) => (
                                    <li key={idx} className="flex gap-4 items-start">
                                        <div className="bg-purple-600/20 p-2 rounded-full mt-1 shrink-0">
                                            <CheckCircle2 className="text-purple-600 dark:text-purple-400" size={20} />
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
                                src="/images/fleet/large-bus-hero.webp"
                                alt="50-Seater Luxury Bus Exterior"
                                fallbackSrc={busImage}
                                className="object-cover w-full h-full"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SECTION 4: DETAILED SPECIFICATIONS TABLE */}
            <section className="py-20 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 max-w-4xl">
                    <h2 className="text-3xl font-bold text-center mb-10  text-slate-800 dark:text-white">Detailed Specifications</h2>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-200 dark:border-slate-700">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {[
                                    ['Engine', 'Heavy-Duty Commercial Diesel Engine'],
                                    ['Transmission', 'Automatic / Automated Manual'],
                                    ['Seating', '50 Reclining Passenger Seats + Guide Seat'],
                                    ['Luggage', 'Under-body Pass-through Compartments'],
                                    ['AC System', 'Central Roof-Mounted AC with Individual Vents'],
                                    ['Safety', 'Retarder Brakes, ABS, Multiple Emergency Exits'],
                                    ['Entertainment', 'PA System, Multi-Display Screens, DVD/USB'],
                                    ['Suspension', 'Full Air Suspension System for Max Comfort'],
                                    ['Doors', 'Pneumatic Passenger Doors (Front & Mid)'],
                                    ['Interior Type', 'Plush Fabric Seating with Armrests'],
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6  text-purple-500">
                        Why Choose Our 50-Seater Bus?
                    </h2>
                    <p className="text-xl leading-relaxed text-slate-300 mb-10">
                        Managing a campaign of 50 pilgrims is a heavy responsibility. Our luxury buses remove the logistical stress, ensuring everyone travels safely and comfortably under one roof. The massive under-body storage completely eliminates the luggage headaches typical of group travel, while the onboard PA system allows trip leaders to foster a shared spiritual atmosphere throughout the journey.
                    </p>
                </div>
            </section>

            {/* SECTION 7: BOOKING CTA */}
            <section className="py-16 bg-purple-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4 ">Reserve Your Fleet Today</h2>
                    <p className="mb-8 font-medium max-w-2xl mx-auto text-purple-100">Book our 50-Seater Luxury Buses now for your organization's upcoming Umrah or Hajj campaign.</p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-full font-bold hover:bg-slate-800 transition-all shadow-xl hover:scale-105">
                            Book via WhatsApp <ArrowRight size={20} />
                        </a>
                        <Link href="/booking" className="inline-flex items-center justify-center gap-2 bg-white text-purple-900 px-8 py-4 rounded-full font-bold hover:bg-slate-100 transition-all shadow-xl hover:scale-105">
                            Book Online Now
                        </Link>
                    </div>
                </div>
            </section>

            <FleetCarouselWrapper />

            <FAQSection items={busFAQs} title="50-Seater Bus Rental - Frequently Asked Questions" />
        </main>
    );
}
