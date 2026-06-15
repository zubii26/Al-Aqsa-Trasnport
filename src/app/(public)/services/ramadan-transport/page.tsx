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
import SchemaInjector from '@/components/SchemaInjector';
import QuickAnswerBox from '@/components/services/QuickAnswerBox';
import { ramadanServiceSchema, ramadanFaqSchema } from '@/lib/schema/ramadan-schema';

export const metadata: Metadata = {
    title: "Ramadan 2026 Umrah Transport & Private Makkah Taxi",
    description: "Secure your Ramadan 2026 Umrah transport. VIP private taxi for Tarawih, Qiyam-ul-Layl, and airport transfers in Makkah & Madinah. 24/7 service.",
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
        title: "Ramadan 2026 Umrah Transport & Private Makkah Taxi",
        description: "Secure your Ramadan 2026 Umrah transport. VIP private taxi for Tarawih, Qiyam-ul-Layl, and airport transfers in Makkah & Madinah. 24/7 service.",
        images: [{ url: '/images/hero/masjid-nabawi-dusk.jpg', width: 1200, height: 630, alt: 'Ramadan Umrah Services' }]
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
            <SchemaInjector schemas={[ramadanServiceSchema, ramadanFaqSchema]} />
            <Hero
                title="Ramadan 2026 Umrah Transport & Private Makkah Taxi"
                subtitle="Reliable, comfortable, and punctual transport services for your Ramadan Umrah. Focus on your worship; let us handle the roads."
                bgImage="/images/hero/ramadan-transport-hero.webp" // Updated to generated Ramadan hero image
                ctaText="Book Your Ramadan Ride"
                ctaLink={whatsappLink}
                layout="center"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* Quick Answer Block */}
            <section className="py-8 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <QuickAnswerBox
                            title="Ramadan 2026 Transport"
                            summary="Specialized Umrah transport services during the holy month of Ramadan. We provide reliable rides despite heavy traffic and road closures in Makkah and Madinah."
                            features={[
                                { label: "Services", value: "Airport transfers, Tarawih/Qiyam-ul-Layl drop-offs, and intercity travel." },
                                { label: "Pricing", value: "Fixed seasonal rates with no hidden surge pricing if booked in advance." },
                                { label: "Availability", value: "Highly limited during the last 10 days (Laylatul Qadr); advance booking strictly required." }
                            ]}
                            ctaText="Secure Ramadan Transport"
                            ctaLink={whatsappLink}
                        />
                    </div>
                </div>
            </section>

            {/* Introduction */}
            <section className="py-16 bg-white dark:bg-slate-900">
                <div className="container mx-auto px-4 text-center max-w-4xl">
                    <div className="flex justify-center mb-6">
                        <Moon className="w-12 h-12 text-amber-500 fill-amber-500/20" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6  text-slate-800 dark:text-slate-100">
                        Experience a Stress-Free Ramadan 2026
                    </h2>
                    <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                        Ramadan in Makkah and Madinah is a spiritually uplifting experience, but the logistics can be challenging.
                        Whether you need Madinah Airport to Makkah Ramadan transfers or a dedicated Laylatul Qadr taxi Makkah, finding reliable Ramadan Umrah transport can be difficult with millions of pilgrims. Al Aqsa Transport ensures you arrive
                        fresh and on time for your prayers, Ziyarat, and airport transfers.
                    </p>
                </div>
            </section>

            {/* Why Choose Us for Ramadan */}
            <section className="py-12 bg-amber-50 dark:bg-slate-800/50">
                <div className="container mx-auto px-4">
                    <h2 className="text-2xl font-bold text-center mb-12 ">Why Book With Us This Ramadan?</h2>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-6 ">Plan Your Spiritual Journey Now</h2>
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
