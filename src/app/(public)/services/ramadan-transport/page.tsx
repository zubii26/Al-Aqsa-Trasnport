import type { Metadata } from "next";
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FleetCarouselWrapper from '@/components/home/FleetCarouselWrapper';
import dynamic from 'next/dynamic';
const Features = dynamic(() => import('@/components/home/Features'));
import Link from 'next/link';
import { ArrowRight, Moon, Clock, ShieldCheck, MapPin } from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';
import { getSettings } from '@/lib/settings-storage';

export const metadata: Metadata = {
    title: "Ramadan 2026 Umrah Transport Services | Makkah & Madinah Taxi",
    description: "Book reliable Ramadan transport in Makkah & Madinah. Avoid the rush with VIP private car rentals for Tarawih, Qiyam-ul-Layl, and Airport transfers. 24/7 Service.",
    keywords: [
        "Ramadan Umrah Transport",
        "Makkah Taxi Ramadan 2026",
        "Madinah Airport to Makkah Ramadan",
        "Tarawih Transport Services",
        "Laylatul Qadr Taxi Makkah",
        "VIP Umrah Taxi Ramadan",
        "نقل معتمرين رمضان",
        "توصيل مكة في رمضان",
        "تاكسي الحرم رمضان"
    ],
    openGraph: {
        title: "Ramadan 2026 Umrah Transport | VIP Makkah Services",
        description: "Experience spiritual peace with our stress-free Ramadan transport services. Reliable transfers during rush hours.",
        images: [{ url: '/images/hero/masjid-nabawi-dusk.jpg', width: 1200, height: 630, alt: 'Ramadan Umrah Services' }]
    }
};

const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": "Ramadan Umrah Transport Services",
    "alternateName": "خدمات نقل المعتمرين في رمضان",
    "provider": {
        "@type": "LocalBusiness",
        "name": "Al Aqsa Transport",
        "image": "https://alaqsaumrahtransport.com/logo.png"
    },
    "serviceType": "Religious Tourism Transport",
    "areaServed": ["Makkah", "Madinah", "Jeddah"],
    "description": "Specialized transport services for Ramadan 2026, ensuring timely arrival for prayers and Iftar.",
    "availability": "Ramadan 2026",
    "offers": {
        "@type": "Offer",
        "priceCurrency": "SAR",
        "availability": "https://schema.org/InStock"
    },
    "breadcrumb": {
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://alaqsaumrahtransport.com"
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://alaqsaumrahtransport.com/services"
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": "Ramadan Transport",
                "item": "https://alaqsaumrahtransport.com/services/ramadan-transport"
            }
        ]
    }
};

const ramadanFAQs = [
    {
        question: "Is transport available 24/7 during Ramadan?",
        answer: "Yes, we operate 24/7. However, during Maghrib and Isha/Tarawih times, traffic in Makkah is very heavy. We recommend booking at least 3 hours in advance."
    },
    {
        question: "Do you offer transport for Qiyam-ul-Layl?",
        answer: "Absolutely. We provide dedicated late-night transfers for Qiyam-ul-Layl prayers to and from the Haram."
    },
    {
        question: "Are prices higher during Ramadan?",
        answer: "Ramadan is a peak season, and while market rates generally rise, we strive to offer competitive, fixed rates when you book in advance. No last-minute surge pricing if booked ahead."
    },
    {
        question: "Can we stop for Iftar during the journey?",
        answer: "Yes, our drivers are happy to accommodate a brief stop for Iftar. We recommend planning your trip to arrive before Maghrib to avoid road closures near the Haram."
    }
];

export default async function RamadanTransportPage() {
    const settings = await getSettings();
    const phoneNumber = settings.contact.phone;
    const whatsappLink = `https://wa.me/${phoneNumber.replace(/[^0-9]/g, '')}`;

    return (
        <main className="overflow-x-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <Hero
                title="Blessed Journeys in the Holy Month"
                subtitle="Reliable, comfortable, and punctual transport services for your Ramadan Umrah. Focus on your worship; let us handle the roads."
                bgImage="/images/hero/ramadan-transport-hero.png" // Updated to generated Ramadan hero image
                ctaText="Book Your Ramadan Ride"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* Introduction */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <div className="flex justify-center mb-6">
                        <Moon className="w-12 h-12 text-amber-500 fill-amber-500/20" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6 font-playfair text-slate-800 dark:text-slate-100">
                        Experience a Stress-Free Ramadan 2026
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        Ramadan in Makkah and Madinah is a spiritually uplifting experience, but the logistics can be challenging.
                        With millions of pilgrims, finding reliable transport can be difficult. Al Aqsa Transport ensures you arrive
                        fresh and on time for your prayers, Ziyarat, and airport transfers.
                    </p>
                </div>
            </section>

            {/* Why Choose Us for Ramadan */}
            <section className="py-12 bg-amber-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12 font-playfair">Why Book With Us This Ramadan?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <Clock size={40} className="text-amber-500" />,
                                title: "Punctuality Matters",
                                desc: "We know every minute of Ramadan is precious. Our drivers know the best routes to avoid congestion during rush hours."
                            },
                            {
                                icon: <ShieldCheck size={40} className="text-amber-500" />,
                                title: "Guaranteed Availability",
                                desc: "Pre-book your rides to secure your vehicle. Don't waste time waiting for taxis on the street."
                            },
                            {
                                icon: <MapPin size={40} className="text-amber-500" />,
                                title: "Door-to-Door Service",
                                desc: "We pick you up from your hotel lobby and drop you as close as possible to the Haram boundaries allowed by traffic police."
                            }
                        ].map((item, idx) => (
                            <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-amber-100 dark:border-slate-700 text-center">
                                <div className="flex justify-center mb-4">{item.icon}</div>
                                <h3 className="text-xl font-bold mb-3 text-slate-800 dark:text-slate-100">{item.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <Features />
            <FleetCarouselWrapper />

            <FAQSection items={ramadanFAQs} title="Ramadan Transport FAQs" />

            {/* CTA */}
            <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-5 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 font-playfair">Plan Your Spiritual Journey Now</h2>
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        Slots for the last 10 days of Ramadan fill up quickly. Secure your booking today.
                    </p>
                    <Link href={whatsappLink} target="_blank" className="inline-flex items-center gap-3 bg-amber-500 hover:bg-amber-600 text-white px-10 py-5 rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-amber-500/25 hover:-translate-y-1">
                        Book via WhatsApp <ArrowRight size={20} />
                    </Link>
                </div>
            </section>
        </main >
    );
}
