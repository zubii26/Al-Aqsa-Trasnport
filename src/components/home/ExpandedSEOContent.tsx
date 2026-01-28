'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/common/FadeIn';
import ServiceLocationsGrid from './ServiceLocationsGrid';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { POPULAR_ROUTES, VEHICLE_KEYWORDS } from '@/data/seo-keywords';

export default function ExpandedSEOContent() {

    // Generate JSON-LD for local business with extensive detail
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "TransportationService",
        "name": "Al Aqsa Umrah Transport Services",
        "url": "https://alaqsaumrahtransport.com",
        "logo": "https://alaqsaumrahtransport.com/logo.png",
        "areaServed": [
            { "@type": "City", "name": "Makkah" },
            { "@type": "City", "name": "Madinah" },
            { "@type": "City", "name": "Jeddah" },
            { "@type": "Place", "name": "King Abdulaziz International Airport" },
            { "@type": "Place", "name": "Prince Mohammad bin Abdulaziz International Airport" }
        ],
        "makesOffer": POPULAR_ROUTES.map(route => ({
            "@type": "Offer",
            "itemOffered": {
                "@type": "Service",
                "name": `${route.from} to ${route.to} Taxi`,
                "description": `Private transfer from ${route.from} to ${route.to}. Approx distance: ${route.distance}.`
            }
        })),
        "vehicle": VEHICLE_KEYWORDS.map(vehicle => ({
            "@type": "Vehicle",
            "name": vehicle
        }))
    };

    return (
        <section className="py-16 md:py-24 bg-slate-50 dark:bg-[#0B1221] relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none" />

            <div className="container relative z-10 px-4 md:px-6 mx-auto">
                <FadeIn>
                    <div className="max-w-5xl mx-auto space-y-16">

                        {/* Header Section */}
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-5xl font-bold font-playfair text-secondary">
                                Complete Umrah Transport Guide (2025/2026)
                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Everything you need to know about traveling between Jeddah, Makkah, and Madinah. Prices, distances, and insider tips.
                            </p>
                        </div>

                        {/* Semantic FAQ Section */}
                        <div className="grid md:grid-cols-2 gap-8 items-start">
                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold font-playfair mb-4">Frequently Asked Questions</h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-1">
                                        <AccordionTrigger>How much is a taxi from Jeddah Airport to Makkah?</AccordionTrigger>
                                        <AccordionContent>
                                            Prices vary by vehicle. A standard sedan (Camry) starts around <strong>200-250 SAR</strong>, while a luxury GMC Yukon XL is typically <strong>350-450 SAR</strong>. Prices may increase during Ramadan and Hajj seasons.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-2">
                                        <AccordionTrigger>How long does it take to travel from Makkah to Madinah?</AccordionTrigger>
                                        <AccordionContent>
                                            The journey typically takes <strong>4 to 4.5 hours</strong> by car (approx. 450 km). Our professional drivers ensure a smooth ride with optional stops at rest areas (Sasco) for prayers and food.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-3">
                                        <AccordionTrigger>Do you offer Ziyarat tours in Makkah and Madinah?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes! We provide comprehensive Ziyarat tours to historical sites like <strong>Masjid Quba, Mount Uhud, Cave Hira, and Cave Thawr</strong>. Our drivers are knowledgeable about these locations and can guide you.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-4">
                                        <AccordionTrigger>Is the transport suitable for elderly pilgrims?</AccordionTrigger>
                                        <AccordionContent>
                                            Absolutely. We specialize in <strong>elderly-friendly transport</strong>. Our GMC Yukons have easy access, and our drivers provide door-to-door assistance, including wheelchair handling and luggage support.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-2xl font-bold font-playfair mb-4">Route & Vehicle Information</h3>
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="item-5">
                                        <AccordionTrigger>What vehicles are available for large families?</AccordionTrigger>
                                        <AccordionContent>
                                            For large groups (7-10 people), we recommend the <strong>Toyota Hiace</strong> or <strong>Hyundai H1</strong>. For extra luxury and comfort (up to 7 people), the <strong>GMC Yukon XL</strong> is the best choice. For larger groups (up to 21), we offer the <strong>Toyota Coaster</strong>.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-6">
                                        <AccordionTrigger>Can I book a transfer from Madinah Airport to Makkah?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, we offer direct transfers from Madinah Airport to Makkah hotels. The journey takes approximately 4.5 hours. Alternatively, you can stay in Madinah first and book your Makkah transfer for a later date.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-7">
                                        <AccordionTrigger>How do I book specific hotels like Fairmont or Hilton?</AccordionTrigger>
                                        <AccordionContent>
                                            We serve all major hotels in the Clock Tower complex (Abraj Al Bait) and Jabal Omar. Simply mention your hotel name when booking via WhatsApp, and our drivers will drop you at the nearest drop-off point allowed by traffic police.
                                        </AccordionContent>
                                    </AccordionItem>
                                    <AccordionItem value="item-8">
                                        <AccordionTrigger>Is there transport during Ramadan?</AccordionTrigger>
                                        <AccordionContent>
                                            Yes, we operate 24/7 during Ramadan. However, due to high demand and road closures near the Haram, we strongly advise <strong>pre-booking your ride</strong> at least 24 hours in advance to guarantee availability.
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                        </div>

                        {/* Narrative Content Block (Global SEO Optimized) */}
                        <div className="bg-white/50 dark:bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-border/50 text-left space-y-12">

                            {/* Intro Section with Image */}
                            <div className="grid lg:grid-cols-2 gap-8 items-center">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-bold font-playfair text-secondary mb-4">
                                        Al Aqsa Umrah Transport – Trusted Global Umrah Travel Partner
                                    </h2>
                                    <p className="text-lg text-muted-foreground leading-relaxed">
                                        Welcome to Al Aqsa Umrah Transport, your trusted partner for safe, affordable, and spiritually fulfilling journeys to the holy cities. We specialize in providing reliable <strong>Umrah transport services</strong> for pilgrims worldwide, offering buses, taxis, and group packages tailored to your needs. With a commitment to comfort, professionalism, and faith, Al Aqsa Umrah Transport ensures every step of your pilgrimage is supported with care. Whether you are traveling individually or with a group, our <strong>pilgrimage transport solutions</strong> are designed to make your Umrah experience seamless and memorable.
                                    </p>
                                </div>
                                <div className="relative h-64 md:h-80 w-full rounded-2xl overflow-hidden shadow-xl border border-border/50">
                                    <Image
                                        src="/images/fleet/gmc-yukon-hero-professional.png"
                                        alt="Luxury GMC Yukon for Umrah Transport"
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                </div>
                            </div>

                            {/* Service Highlights */}
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold text-primary dark:text-white mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Reliable Umrah Transport Services
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        As a premier <strong>Umrah travel agency</strong> and transport provider, we understand the diverse needs of the Guests of Allah. Our fleet includes luxury <strong>Umrah taxi services</strong> for families, private GMC Yukons for VIPs, and spacious buses for <strong>Umrah group transport</strong>. We prioritize safety and affordability, offering transparent pricing with no hidden fees. From Jeddah Airport pickups to intercity transfers between Makkah and Madinah, our professional drivers ensure a punctual and stress-free journey.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-primary dark:text-white mb-3 flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                        Why Choose Al Aqsa?
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        We combine spiritual understanding with logistical excellence. Our <strong>affordable Umrah transport</strong> packages are designed to fit every budget without compromising quality. We offer 24/7 customer support, English and Arabic-speaking drivers, and a seamless booking process that makes us the preferred choice for <strong>international Umrah pilgrims</strong> from the UK, USA, Pakistan, Hijaz, and beyond.
                                    </p>
                                </div>
                            </div>

                            {/* Global Reach & CTA */}
                            <div>
                                <h3 className="text-xl font-bold text-primary dark:text-white mb-3">
                                    Serving Pilgrims Worldwide
                                </h3>
                                <p className="text-muted-foreground leading-relaxed mb-6">
                                    Our mission extends beyond borders. We are proud to serve as a <strong>trusted Umrah travel partner</strong> for agencies and individual pilgrims globally. Whether you are arriving for your first Umrah or are a returning visitor, our <strong>Umrah packages worldwide</strong> standard ensures consistent, high-quality service. We handle the logistics so you can focus entirely on your Ibadah.
                                </p>

                                <div className="bg-primary/5 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 border border-primary/10">
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Ready for a Blessed Journey?</h4>
                                        <p className="text-sm text-muted-foreground">
                                            Book your <strong>Umrah bus service</strong> or private transfer today. Experience the peace of mind that comes with traveling with Al Aqsa.
                                        </p>
                                    </div>
                                    <Link
                                        href="/contact"
                                        className="whitespace-nowrap px-6 py-3 bg-secondary text-white font-bold rounded-xl hover:bg-secondary/90 transition-colors shadow-lg shadow-secondary/20"
                                    >
                                        Inquire Now
                                    </Link>
                                </div>
                            </div>

                        </div>

                        {/* Service Locations Directory */}
                        <ServiceLocationsGrid />

                        {/* Footer SEO Text */}
                        <div className="text-center text-sm text-muted-foreground pt-8 border-t border-border/50">
                            <p>
                                Al Aqsa Umrah Transport is a licensed private transportation provider in Saudi Arabia. We serve all pilgrims visiting the Two Holy Mosques for Umrah and Hajj.
                                Operating in Jeddah, Makkah, Madinah, and Taif.
                            </p>
                        </div>

                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
