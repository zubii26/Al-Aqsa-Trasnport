'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Car, Plane, Building2 } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import ParticleBackground from '@/components/ui/ParticleBackground';
import GoldenWaveDivider from '@/components/ui/GoldenWaveDivider';

/*
  Transport Services Section
  - Intercity Transport
  - Airport Transport
  - Hotel Transfers
  SEO Optimized with semantic HTML and keyword-rich content.
*/

const services = [
    {
        id: 'intercity',
        title: 'Intercity Transport',
        subtitle: 'Makkah • Madinah • Jeddah • Taif',
        description: 'Experience safe, comfortable travel between major Saudi cities. Our premium intercity transport ensures a smooth journey for pilgrims performing Umrah and Ziyarat. Punctual, reliable, and stress-free long-distance travel.',
        image: '/images/services/intercity-transport.png',
        icon: <Car size={32} />,
        link: '/services/intercity-transfer',
        keywords: ['intercity transport Saudi Arabia', 'Makkah to Madinah transport', 'long-distance travel for pilgrims']
    },
    {
        id: 'airport-pickups',
        title: 'Airport Transport',
        subtitle: 'Jeddah (KAIA) • Madinah (Prince Mohammad)',
        description: 'Seamless pickup and drop-off from Jeddah and Madinah airports. We offer real-time flight tracking, professional meet-and-greet service, and luggage assistance for a stress-free arrival in the Holy Land.',
        icon: <Plane size={32} />,
        image: '/images/services/airport-transfer-real.jpg',
        link: '/services/airport-transfers',
        keywords: ['Jeddah Airport pickup', 'Madinah Airport transfer', 'Umrah airport transport']
    },
    {
        id: 'hotel-transfers',
        title: 'Hotel Transfers',
        subtitle: 'Door-to-Door • Makkah & Madinah Hotels',
        description: 'Quick and reliable transfers between your hotel and the Holy Mosques. Enjoy premium comfort and cleanliness, perfectly suitable for families, groups, and elderly pilgrims seeking ease of movement.',
        icon: <Building2 size={32} />,
        image: '/images/services/hotel-transfer-real.jpg',
        link: '/services/hotel-transfers', // Updated link to new dedicated page
        keywords: ['hotel transfer Makkah', 'hotel shuttle Madinah', 'Umrah hotel transport']
    }
];

export default function TransportServices() {
    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            <GoldenWaveDivider position="top" />
            <ParticleBackground />

            <div className="container relative z-10">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-amber-500 font-bold tracking-wider uppercase text-sm mb-3 block">Our Core Services</span>
                        <h2 className="text-3xl md:text-5xl font-bold font-playfair text-slate-900 dark:text-white mb-6">
                            Premium Transport for <span className="text-gradient-gold">Your Spiritual Journey</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400">
                            Comprehensive travel solutions designed for the Guests of Allah. From airport arrivals to intercity travel, we ensure every mile is comfortable and safe.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <FadeIn key={service.id} delay={index * 0.1} scale>
                            <article className="group h-full bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800 flex flex-col">
                                {/* Image Container - Now Clickable */}
                                <Link href={service.link} className="relative h-48 md:h-64 overflow-hidden block">
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                                    <Image
                                        src={service.image}
                                        alt={service.title + " - " + service.keywords[0]}
                                        fill
                                        className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur p-2 rounded-lg shadow-sm text-amber-500">
                                        {service.icon}
                                    </div>
                                </Link>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-4">
                                        <Link href={service.link}>
                                            <h3 className="text-2xl font-bold font-playfair text-slate-900 dark:text-white mb-1 hover:text-amber-600 dark:hover:text-amber-500 transition-colors">
                                                {service.title}
                                            </h3>
                                        </Link>
                                        <p className="text-sm font-medium text-amber-600 dark:text-amber-500">
                                            {service.subtitle}
                                        </p>
                                    </div>

                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 flex-1">
                                        {service.description}
                                    </p>

                                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800 mt-auto">
                                        <Link
                                            href={service.link}
                                            className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-500 font-semibold group-hover:gap-3 transition-all"
                                        >
                                            Book Now <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
