import React from 'react';
import { Metadata } from 'next';
import Hero from '@/components/common/Hero';
import FadeIn from '@/components/common/FadeIn';
import Image from 'next/image';
import Link from 'next/link';
import { 
    Clock, ShieldCheck, MapPin, CheckCircle2, Train, 
    Star, Users, Shield, ArrowRight, ThumbsUp, CalendarCheck,
    MessageSquare, Check, X, Phone
} from 'lucide-react';
import FAQSection from '@/components/services/FAQSection';

export const metadata: Metadata = {
    title: 'Haramain Train Station Transfer | Private Makkah & Madinah Taxi',
    description: 'Premium Haramain Train Station transfers in Saudi Arabia. 24/7 private taxi pickups for Makkah, Madinah, and Jeddah stations. Fixed prices & VIP service.',
    keywords: [
        'Haramain Train Station Transfer', 'Haramain High Speed Train Taxi', 
        'Makkah Train Station Transfer', 'Madinah Train Station Transfer', 
        'Jeddah Train Station Transfer', 'Train Station Taxi Saudi Arabia', 
        'Haramain Railway Transfer', 'Private Train Transfer', 
        'Haramain Express Taxi', 'VIP Train Transfer'
    ],
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/services/train-station-transfer',
    },
    openGraph: {
        title: 'Haramain Train Station Transfer | Private Taxi',
        description: 'Premium Haramain Train Station transfers. 24/7 private taxi pickups for Makkah, Madinah, and Jeddah stations.',
        images: ['/images/services/haramain-train.png'],
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Haramain Train Station Transfer | Private Taxi',
        description: 'Premium Haramain Train Station transfers. 24/7 private taxi pickups for Makkah, Madinah, and Jeddah stations.',
        images: ['/images/services/haramain-train.png'],
    }
};

const trainFAQs = [
    { question: "How do I book a Haramain Train Station transfer?", answer: "You can easily book online through our website by selecting 'Train Station' as your pickup or drop-off location, or contact us directly via WhatsApp for instant booking." },
    { question: "Does the driver wait if my train is delayed?", answer: "Yes! We track Haramain train schedules in real-time. If your train is delayed, our driver will adjust the pickup time accordingly, free of charge." },
    { question: "Can you pick us up from Makkah Haramain Station?", answer: "Absolutely. Our driver will meet you at the designated arrival area at the Makkah Haramain High-Speed Railway Station holding a name board." },
    { question: "Can you drop us at Madinah Station?", answer: "Yes, we provide comfortable drop-offs directly at the Madinah Haramain Station entrance, ensuring you arrive with plenty of time before your train departs." },
    { question: "Can I book for a family?", answer: "Yes, we have a diverse fleet including GMC Yukons, Hyundai Staria, and Toyota Hiace vans, which are perfect for families with extensive luggage." },
    { question: "Can I pay online?", answer: "Yes, you can pay online securely using a credit card, or choose to pay cash to the driver upon arrival." },
    { question: "Do you provide child seats?", answer: "Yes, complimentary child seats are available upon request. Please mention this requirement in your booking notes." },
    { question: "Do you provide group transfers?", answer: "Yes, for large groups, we offer spacious Coaster buses and luxury coaches capable of transporting up to 50 passengers with luggage." },
    { question: "Can I book from Jeddah Airport Train Station?", answer: "Yes, we provide transfers connecting the Jeddah Airport (KAIA) Train Station to Makkah, Madinah, or Jeddah city hotels." },
    { question: "Is luggage included?", answer: "Yes, our vehicle prices cover the vehicle and standard luggage capacity. There are no hidden fees or extra charges for luggage." }
];

export default function TrainStationTransferPage() {
    const jsonLd = [
        {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Haramain Train Station Transfer",
            "serviceType": "Private Taxi Transfer",
            "provider": {
                "@type": "Organization",
                "name": "Al Aqsa Umrah Transport"
            },
            "description": "Premium Haramain Train Station transfers in Saudi Arabia. 24/7 private taxi pickups for Makkah, Madinah, and Jeddah stations.",
            "areaServed": [
                { "@type": "City", "name": "Makkah" },
                { "@type": "City", "name": "Madinah" },
                { "@type": "City", "name": "Jeddah" }
            ],
            "offers": {
                "@type": "Offer",
                "priceCurrency": "SAR",
                "price": "100", // Starting price
                "url": "https://www.alaqsaumrahtransport.com/services/train-station-transfer"
            }
        },
        {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": trainFAQs.map(faq => ({
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
            
            {/* 1. Hero Section */}
            <Hero
                title="Haramain Train Station Transfer"
                subtitle="Private Transfers Between Hotels, Airports & Haramain Railway Stations"
                bgImage="/images/services/haramain-train.png"
                bgImagePosition="object-center"
                ctaText="Book Your Transfer"
                ctaLink="/booking"
                layout="center"
            />
            
            {/* 2. Trust Badges (Horizontal Scroll) */}
            <div className="bg-slate-900 border-b border-slate-800 py-4 overflow-x-auto custom-scrollbar">
                <div className="container mx-auto px-4 flex items-center justify-start md:justify-center gap-6 md:gap-8 min-w-max">
                    {[
                        "Available 24/7", "Licensed Drivers", "Meet & Greet", 
                        "Train Tracking", "Luxury Fleet", "Fixed Prices", 
                        "Family Friendly", "Multilingual Drivers"
                    ].map((badge, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                            <CheckCircle2 className="text-secondary shrink-0" size={16} />
                            {badge}
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. Why Choose Al Aqsa */}
            <section className="py-16 md:py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-3 block">Premium Standards</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                            Why Choose Al Aqsa for Train Transfers?
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            We bridge the gap between high-speed rail travel and your final destination with unmatched luxury and reliability.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { icon: <Clock />, title: "Always On Time", desc: "Drivers arrive 15 minutes early." },
                        { icon: <Star />, title: "Luxury Vehicles", desc: "Immaculate, latest model cars." },
                        { icon: <ShieldCheck />, title: "Experienced Drivers", desc: "Safe, licensed, route experts." },
                        { icon: <CheckCircle2 />, title: "No Hidden Charges", desc: "Fixed pricing, no surprises." }
                    ].map((feature, idx) => (
                        <FadeIn key={idx} delay={idx * 0.1}>
                            <div className="card-premium h-full">
                                <div className="bg-secondary/10 dark:bg-secondary/20 w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-secondary">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                                <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* 4. Train Stations Covered */}
            <section className="py-16 bg-white dark:bg-slate-900 border-y border-slate-100 dark:border-slate-800">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Train Stations Covered</h2>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            "Makkah Haramain Station", 
                            "Madinah Haramain Station", 
                            "Jeddah Airport Station (KAIA)", 
                            "Jeddah Al Sulaymaniyah Station"
                        ].map((station, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="group relative h-48 rounded-2xl overflow-hidden bg-slate-800 flex items-center justify-center p-6 text-center border border-slate-700">
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 to-slate-800/50 z-10"></div>
                                    <Train className="absolute opacity-5 w-32 h-32 text-white -right-4 -bottom-4 transform -rotate-12 transition-transform group-hover:scale-110" />
                                    <div className="relative z-20">
                                        <MapPin className="text-secondary mx-auto mb-3" size={28} />
                                        <h3 className="text-lg font-bold text-white">{station}</h3>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* 5. Popular Routes */}
            <section className="py-16 md:py-24 container mx-auto px-4">
                <FadeIn>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Popular Connection Routes</h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Seamless connections between Haramain stations and major landmarks.</p>
                    </div>
                </FadeIn>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                        { route: "Makkah Hotel ↔ Haramain Station", time: "~15-30 mins" },
                        { route: "Madinah Hotel ↔ Haramain Station", time: "~20-35 mins" },
                        { route: "Jeddah Airport ↔ Haramain Station", time: "Direct Connection" },
                        { route: "Haramain Station ↔ Makkah Haram", time: "~20 mins" },
                        { route: "Haramain Station ↔ Madinah Haram", time: "~25 mins" },
                        { route: "Makkah ↔ Jeddah Airport Station", time: "~75 mins" }
                    ].map((item, i) => (
                        <FadeIn key={i} delay={i * 0.05}>
                            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col items-center text-center">
                                <div className="flex items-center justify-center gap-3 w-full mb-3">
                                    <div className="h-[1px] bg-slate-300 dark:bg-slate-600 flex-1"></div>
                                    <Train size={20} className="text-secondary" />
                                    <div className="h-[1px] bg-slate-300 dark:bg-slate-600 flex-1"></div>
                                </div>
                                <h4 className="font-bold text-slate-900 dark:text-white mb-2">{item.route}</h4>
                                <span className="text-xs font-medium bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
                                    Est. Time: {item.time}
                                </span>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </section>

            {/* 6. Our Vehicles */}
            <section className="py-16 bg-slate-900 text-white border-y border-slate-800">
                <div className="container mx-auto px-4">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Premium Fleet</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Luxury vehicles tailored for individuals, families, and large groups traveling to or from the train station.</p>
                        </div>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Toyota Camry", pax: 3, bags: 2, desc: "Private Standard Sedan", img: "/images/fleet/camry.webp" },
                            { name: "Hyundai Staria", pax: 7, bags: 6, desc: "Luxury Family MPV", img: "/images/fleet/staria.webp" },
                            { name: "GMC Yukon XL", pax: 7, bags: 6, desc: "VIP Luxury SUV", img: "/images/fleet/gmc.webp" },
                            { name: "Toyota Hiace", pax: 10, bags: 10, desc: "Spacious Group Van", img: "/images/fleet/hiace.webp" }
                        ].map((car, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 h-full flex flex-col group">
                                    <div className="h-40 bg-white relative p-4 flex items-center justify-center">
                                        <Image src={car.img} alt={car.name} width={250} height={150} className="object-contain group-hover:scale-105 transition-transform" />
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="font-bold text-lg mb-1">{car.name}</h3>
                                        <p className="text-xs text-secondary mb-4 uppercase tracking-wider font-bold">{car.desc}</p>
                                        <div className="space-y-2 text-sm text-slate-300 mt-auto">
                                            <div className="flex justify-between border-b border-slate-700 pb-2">
                                                <span className="flex items-center gap-2"><Users size={14}/> Passengers</span>
                                                <span>Up to {car.pax}</span>
                                            </div>
                                            <div className="flex justify-between pt-1">
                                                <span className="flex items-center gap-2"><Shield size={14}/> Luggage</span>
                                                <span>{car.bags} Suitcases</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* 7. Meet & Greet & 8. Booking Process */}
            <section className="py-16 md:py-24 container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Meet & Greet */}
                    <FadeIn>
                        <div>
                            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-3 block">Premium Hospitality</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">VIP Meet & Greet Service</h2>
                            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                                Navigating busy train stations can be overwhelming, especially with luggage and family. Our VIP Meet & Greet service ensures you are welcomed the moment you step off the train.
                            </p>
                            <ul className="space-y-4">
                                {[
                                    "Driver waits at the arrival exit.",
                                    "Personalized name board for easy identification.",
                                    "Professional luggage assistance.",
                                    "Safe escort to your luxury vehicle.",
                                    "Perfect for international pilgrims."
                                ].map((point, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                                        <CheckCircle2 className="text-emerald-500 shrink-0 mt-0.5" size={20} />
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </FadeIn>

                    {/* Booking Process Timeline */}
                    <FadeIn direction="up">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">Simple Booking Process</h3>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-4 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-amber-500 before:via-amber-500/20 before:to-transparent">
                                {[
                                    { title: "Choose Route", desc: "Select pickup & destination" },
                                    { title: "Select Date", desc: "Pick your date & time" },
                                    { title: "Choose Vehicle", desc: "Pick a car that fits your group" },
                                    { title: "Confirm Booking", desc: "Get instant confirmation" },
                                    { title: "Driver Contacts", desc: "Driver messages via WhatsApp" },
                                    { title: "Enjoy Journey", desc: "Smooth & comfortable ride" }
                                ].map((step, i) => (
                                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full border-4 border-white dark:border-slate-900 bg-secondary text-slate-900 font-bold text-xs shadow shrink-0 md:order-1 md:group-odd:-ml-4 md:group-even:-mr-4 z-10 ml-0 md:ml-auto md:mr-auto">
                                            {i + 1}
                                        </div>
                                        <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 ml-4 md:ml-0 shadow-sm">
                                            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1">{step.title}</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 9. Comparison Table */}
            <section className="py-16 bg-slate-50 dark:bg-slate-900/50 border-y border-slate-200 dark:border-slate-800">
                <div className="container mx-auto px-4 max-w-5xl">
                    <FadeIn>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Book Private Instead of Local Taxi?</h2>
                        </div>
                        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl bg-white dark:bg-slate-900">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold w-1/3">Feature</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold w-1/3 text-secondary dark:text-secondary text-center bg-secondary/10 dark:bg-amber-900/10">Private Transfer (Al Aqsa)</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-700 font-bold w-1/3 text-center text-slate-500">Local Taxi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { feature: "Pricing", pro: "Fixed Price", con: "Variable pricing / Metered" },
                                        { feature: "Driver", pro: "Professional & Vetted", con: "Unknown" },
                                        { feature: "Communication", pro: "English Speaking / WhatsApp", con: "Limited communication" },
                                        { feature: "Booking", pro: "Advance Booking Guarantee", con: "No booking guarantee" },
                                        { feature: "Vehicles", pro: "Luxury, Clean & Insured", con: "Standard, varies wildly" },
                                        { feature: "Service", pro: "Meet & Greet, Luggage Help", con: "No luggage assistance" },
                                        { feature: "Support", pro: "24/7 Customer Support", con: "No customer support" }
                                    ].map((row, i) => (
                                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                            <td className="p-4 text-slate-700 dark:text-slate-300 font-medium">{row.feature}</td>
                                            <td className="p-4 text-center bg-secondary/10/50 dark:bg-amber-900/5">
                                                <span className="inline-flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium text-sm w-full">
                                                    <Check size={16} /> {row.pro}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className="inline-flex items-center justify-center gap-2 text-slate-400 text-sm w-full">
                                                    <X size={16} /> {row.con}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 10. FAQ Section */}
            <section className="py-16 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 max-w-4xl">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Frequently Asked Questions</h2>
                        <div className="space-y-4">
                            {trainFAQs.map((faq, i) => (
                                <div key={i} className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
                                    <h3 className="font-bold text-lg mb-2 text-slate-800 dark:text-slate-200">{faq.question}</h3>
                                    <p className="text-slate-600 dark:text-slate-400">{faq.answer}</p>
                                </div>
                            ))}
                        </div>
                    </FadeIn>
                </div>
            </section>

            {/* 11. Customer Reviews */}
            <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-[0.05] mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <FadeIn>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Pilgrims Worldwide</h2>
                            <p className="text-slate-400 max-w-2xl mx-auto">Read what our international clients say about our train station transfer services.</p>
                        </div>
                    </FadeIn>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { name: "Ahmed Khan", country: "United Kingdom", review: "Incredible service. Driver was waiting exactly where promised at Makkah station. Highly recommended for families." },
                            { name: "Siti Nurhaliza", country: "Malaysia", review: "Booked a Hyundai Staria from Jeddah Airport Station. The car was spotless, AC was cold, and driver helped with all our heavy bags." },
                            { name: "Budi Santoso", country: "Indonesia", review: "Very professional. Fixed price gave us peace of mind, no haggling with local taxis outside Madinah station." },
                            { name: "Usman Ali", country: "Pakistan", review: "Seamless transfer from Makkah hotel to Haramain Station. Driver contacted via WhatsApp before pickup. 5 stars!" }
                        ].map((review, i) => (
                            <FadeIn key={i} delay={i * 0.1}>
                                <div className="bg-slate-800/80 backdrop-blur border border-slate-700 p-6 rounded-2xl shadow-xl h-full flex flex-col relative">
                                    <div className="flex text-amber-400 mb-4">
                                        {[...Array(5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                                    </div>
                                    <p className="text-slate-300 text-sm italic mb-6 flex-1">"{review.review}"</p>
                                    <div className="flex items-center gap-3 mt-auto border-t border-slate-700 pt-4">
                                        <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold">
                                            {review.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-sm text-white">{review.name}</h4>
                                            <span className="text-xs text-secondary">{review.country}</span>
                                        </div>
                                    </div>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* 12. SEO Content Section */}
            <section className="py-16 md:py-24 bg-white dark:bg-slate-950">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="prose prose-lg dark:prose-invert prose-slate prose-headings:text-slate-900 dark:prose-headings:text-white prose-a:text-secondary max-w-none">
                        <h2>The Ultimate Haramain High Speed Railway Transfer Experience</h2>
                        <p>
                            The <strong>Haramain High Speed Railway</strong> has revolutionized travel for Umrah and Hajj pilgrims, seamlessly connecting the Holy Cities of Makkah and Madinah with Jeddah and King Abdullah Economic City. However, navigating from the train station to your final destination—whether it's a luxury hotel facing the Haram or a flight out of Jeddah Airport—requires a reliable transportation partner. 
                        </p>
                        <p>
                            At <Link href="/">Al Aqsa Umrah Transport</Link>, we provide the premier <strong>Train Station Transfer</strong> service in Saudi Arabia. We understand that after a lightning-fast 300km/h train ride, the last thing you want is to struggle with luggage, haggle over taxi fares, or wait in long queues. Our private taxi service ensures your spiritual journey remains uninterrupted and completely stress-free.
                        </p>

                        <h3>Comprehensive Train Station Transfers</h3>
                        <p>
                            We cover every major hub on the Haramain rail network. Whether you need a pickup from the bustling <strong>Makkah Train Station</strong>, a drop-off at the spiritually serene <strong>Madinah Train Station</strong>, or a direct link from the <strong>Jeddah Airport Train Station (KAIA)</strong>, our fleet is positioned for immediate dispatch.
                        </p>
                        
                        <h4>Hotel Pickup & Drop-Off</h4>
                        <p>
                            Booking our <Link href="/services/hotel-transfers">Hotel Pickup service</Link> alongside your train transfer guarantees door-to-door convenience. Our professional drivers navigate the complex road networks around the Holy Mosques with ease, ensuring you are dropped off at the closest legal point to your accommodation.
                        </p>

                        <h3>Luxury Transport for Every Pilgrim</h3>
                        <p>
                            Whether you are traveling for business, embarking on a solo Umrah, or coordinating a large family Hajj journey, our diverse fleet of <strong>Luxury Vehicles</strong> accommodates every requirement:
                        </p>
                        <ul>
                            <li><strong>Business Travel & Solo Pilgrims:</strong> Enjoy the quiet comfort of a private Toyota Camry sedan.</li>
                            <li><strong>Family Travel:</strong> Experience the VIP space of a <Link href="/services/vip-transport">Luxury GMC Yukon</Link> or the modern Hyundai Staria, offering ample legroom and expansive luggage capacity.</li>
                            <li><strong>Group Transfers:</strong> Our Toyota Hiace and luxury Coaster buses keep your group together safely and comfortably.</li>
                        </ul>

                        <h3>Luggage Assistance & Meet and Greet</h3>
                        <p>
                            Our commitment to excellence shines through our complimentary Meet & Greet protocol. Your driver will be waiting at the designated arrival area holding a personalized sign. Furthermore, our <strong>Luggage Assistance</strong> ensures you never have to lift a heavy bag after your train journey. 
                        </p>

                        <h3>Safe, Reliable, and Spiritually Respectful</h3>
                        <p>
                            As a leading name in <strong>Saudi Arabia Transportation</strong>, we pride ourselves on maintaining a fleet of clean, insured, and thoroughly inspected vehicles. Our drivers are not only skilled navigators but also professionally trained to treat international pilgrims with the utmost spiritual respect and hospitality.
                        </p>

                        <h3>Connecting Your Entire Journey</h3>
                        <p>
                            Our Train Station Transfer integrates perfectly with our other premium services. Need to go straight from your flight to the train? Book our <Link href="/services/airport-transfers">Jeddah Airport Transfer</Link> or <Link href="/services/airport-transfers">Madinah Airport Transfer</Link>. Prefer to travel by road instead of rail? Discover our highly rated <Link href="/services/intercity-transfer">Makkah to Madinah Taxi</Link> service for a private, scenic journey.
                        </p>
                    </div>
                </div>
            </section>

            {/* 13 & 14. Call To Action */}
            <section className="py-20 bg-secondary text-slate-900 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/pattern-grid.png')] opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready for Your Haramain Train Transfer?</h2>
                    <p className="text-lg md:text-xl mb-10 font-medium max-w-3xl mx-auto opacity-90">
                        Book your private luxury transfer today and enjoy a smooth, comfortable, and stress-free journey between train stations, airports, hotels, and the Holy Cities.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/booking"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold py-4 px-8 rounded-full hover:bg-slate-800 transition-colors shadow-xl"
                        >
                            Book Transfer Now
                            <ArrowRight size={20} />
                        </Link>
                        <a
                            href="https://wa.me/96600000000"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-bold py-4 px-8 rounded-full hover:bg-slate-50 transition-colors shadow-xl"
                        >
                            <Phone size={20} className="text-emerald-500" />
                            WhatsApp Support
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
