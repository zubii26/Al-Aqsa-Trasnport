import React from 'react';
import { Metadata } from 'next';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import { Building2, Clock, MapPin, ShieldCheck, Star, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';

export const metadata: Metadata = {
    title: 'Hotel Transfers Makkah & Madinah | Al Aqsa Umrah Transport',
    description: 'Reliable door-to-door hotel transfers in Makkah and Madinah. 24/7 comfortable transport between your hotel and the Holy Harams. Book your ride now.',
    keywords: ['hotel transfer Makkah', 'hotel transfer Madinah', 'Umrah hotel shuttle', 'family transport Makkah', 'VIP hotel transfer Saudi Arabia'],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/services/hotel-transfers',
    }
};

const hotelFAQs = [
    { question: "Do you provide hotel-to-hotel transfers between Makkah and Madinah?", answer: "Yes, we offer direct hotel-to-hotel transfers between Makkah and Madinah for a seamless and comfortable journey." },
    { question: "Can the driver pick us up directly from the hotel lobby?", answer: "Absolutely. Our driver will meet you at the hotel lobby or the designated pickup area of your hotel." },
    { question: "Are the prices per vehicle or per person?", answer: "All our transfer prices are per vehicle, which makes it very cost-effective for families and groups." },
    { question: "What types of vehicles do you offer for hotel transfers?", answer: "We offer a range of vehicles including standard sedans (Toyota Camry), VIP SUVs (GMC Yukon), and family vans (Toyota Hiace/Hyundai H1)." },
    { question: "How far in advance should I book my hotel transfer?", answer: "We recommend booking at least 24 hours in advance to guarantee vehicle availability, especially during peak seasons like Ramadan." }
];

export default function HotelTransferPage() {
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Hotel Transfers Makkah & Madinah",
            "serviceType": "Hotel Transfer",
            "provider": {
                "@type": "Organization",
                "name": "Al Aqsa Umrah Transport"
            },
            "description": "Reliable door-to-door hotel transfers in Makkah and Madinah. 24/7 comfortable transport between your hotel and the Holy Harams.",
            "areaServed": [
                { "@type": "City", "name": "Makkah" },
                { "@type": "City", "name": "Madinah" }
            ],
            "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": "150",
                "url": "https://www.alaqsaumrahtransport.com/services/hotel-transfers"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": hotelFAQs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                    "@type": "Answer",
                    "text": faq.answer
                }
            }))
        }
    ];

    return (
        <main className="bg-slate-50 dark:bg-slate-950 min-h-screen">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {/* Hero Section */}
            <Hero
                title="Premium Hotel Transfers"
                subtitle="Seamless door-to-door transport between your hotel and the Holy Mosques in Makkah & Madinah."
                bgImage="/images/services/hotel-transfer-real.webp"
                bgImagePosition="object-center"
                ctaText="Book Your Ride"
                ctaLink="/booking"
                layout="center"
            />

            {/* Introduction Section */}
            <section className="py-16 container mx-auto px-4">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-3 block">Comfort & Convenience</span>
                        <h2 className="text-3xl md:text-4xl font-bold  text-slate-900 dark:text-white mb-6">
                            Stress-Free Travel <span className="text-amber-500">To Your Doorstep</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                            Arrive refreshed and on time. Whether you are heading to the Haram for prayers or returning to your hotel after Umrah, our dedicated drivers ensure a smooth, comfortable, and private journey for you and your family.
                        </p>
                    </div>
                </FadeIn>

                {/* Key Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {[
                        {
                            icon: <MapPin className="text-amber-500" size={32} />,
                            title: "Door-to-Door Service",
                            desc: "Direct pickup from your hotel lobby and drop-off at the closest accessible point to the Haram."
                        },
                        {
                            icon: <Clock className="text-amber-500" size={32} />,
                            title: "24/7 Availability",
                            desc: "Round-the-clock service to align with your prayer times, Ziyarat plans, and flight schedules."
                        },
                        {
                            icon: <Users className="text-amber-500" size={32} />,
                            title: "Family Friendly",
                            desc: "Spacious vehicles (GMC, H1, HiAce) perfect for families with children, elderly, and luggage."
                        }
                    ].map((feature, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <div className="card-premium h-full">
                                <div className="bg-amber-50 dark:bg-amber-900/20 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{feature.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* Service Areas */}
            <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="flex-1 relative h-[400px] w-full rounded-3xl overflow-hidden shadow-2xl">
                            <Image
                                src="/images/services/intercity-transport.webp" // Fallback/Shared image for context
                                alt="Makkah Hotel Transport"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                                <div>
                                    <h3 className="text-3xl font-bold text-white mb-2">Makkah & Madinah</h3>
                                    <p className="text-slate-200">Serving all major hotels in the Holy Cities.</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-8">
                            <FadeIn direction="right">
                                <h3 className="text-3xl font-bold  text-slate-900 dark:text-white">
                                    We Cover All Major Zones
                                </h3>
                                <div className="space-y-6 mt-6">
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                            <Building2 className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Makkah Hotels</h4>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1">Clock Tower (Abraj Al Bait), Jabal Omar, Ajyad, Aziziyah, and more.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                            <Building2 className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Madinah Hotels</h4>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1">Central Area (Markazia), Qibla, and hotels near Masjid An Nabawi.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1 bg-amber-100 dark:bg-amber-900/30 p-2 rounded-full">
                                            <ShieldCheck className="text-amber-600 dark:text-amber-500" size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-semibold text-slate-900 dark:text-white">Reliable & Safe</h4>
                                            <p className="text-slate-600 dark:text-slate-400 mt-1">Licensed drivers and well-maintained vehicles for your peace of mind.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-10">
                                    <Link
                                        href="/booking"
                                        className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-amber-500/20"
                                    >
                                        Book Your Hotel Transfer
                                        <ArrowRight size={20} />
                                    </Link>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>
            <FAQSection items={hotelFAQs} />
        </main>
    );
}
