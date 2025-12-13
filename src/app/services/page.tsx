import React, { Suspense } from 'react';
import Link from 'next/link';
import { Bus, MapPin, Users, Headphones, ArrowRight, Calendar, CheckCircle, Car } from 'lucide-react';
import styles from './page.module.css';
import FleetSectionLoader from '@/components/services/FleetSectionLoader';
import FadeIn from '@/components/common/FadeIn';
import Hero from '@/components/common/Hero';
import FAQSection from '@/components/services/FAQSection';
import GlassCard from '@/components/ui/GlassCard';

export async function generateMetadata() {
    return {
        title: "Best Umrah Transport Services | Jeddah Airport to Makkah Taxi",
        description: "Book the top-rated Umrah transport services in Saudi Arabia. We provide luxury GMC Yukon transfers, reliable Jeddah airport pickup, and comfortable Makkah to Madinah bus options.",
        alternates: {
            canonical: 'https://alaqsaumrahtransport.com/services',
        },
    };
}

const processSteps = [
    {
        title: "Book Online",
        description: "Select your vehicle and schedule your pickup in just a few clicks.",
        icon: <Calendar size={24} />
    },
    {
        title: "Get Confirmation",
        description: "Receive instant confirmation with driver details and tracking link.",
        icon: <CheckCircle size={24} />
    },
    {
        title: "Enjoy the Ride",
        description: "Travel in comfort and safety to your destination.",
        icon: <Car size={24} />
    }
];

export default function ServicesPage() {
    const services = [
        {
            title: 'Makkah to Madinah Transport',
            description: 'Travel between Holy Cities in our luxury fleet. Choose from spacious GMC Yukons or comfortable Hyundai H1 vans for a relaxing 4-hour journey.',
            icon: <Bus size={32} />,
            link: '/booking?service=transfer' // Fixed link query
        },
        {
            title: 'Jeddah Airport to Makkah Taxi',
            description: 'Reliable and punctual airport transfers. Our driver waits for you at King Abdulaziz International Airport (KAIA) for a seamless start to your Umrah.',
            icon: <MapPin size={32} />,
            link: '/booking?service=airport'
        },
        {
            title: 'VIP Luxury Umrah Transport',
            description: 'Experience premium comfort with our VIP service. Top-of-the-line vehicles (GMC Yukon XL) and private chauffeurs for maximum privacy and ease.',
            icon: <Users size={32} />,
            link: '/booking?service=luxury'
        },
        {
            title: 'Ziarah Tours & Daily Rentals',
            description: 'Explore historical sites in Makkah and Madinah with our flexible hourly rental packages. Visit Jabal Al-Nour, Quba Mosque, and more.',
            icon: <Headphones size={32} />, // Keeping Headphones for support/custom requests context or switch to MapPin? Sticking to existing structure
            link: '/contact'
        }
    ];

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <Hero
                title="Dedicated Service for the Guests of Allah"
                subtitle="Reliable Jeddah airport to Makkah transport and group packages for your spiritual journey."
                bgImage="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Your Ride"
                ctaLink="/booking"
                secondaryCtaText="Contact Us"
                secondaryCtaLink="/contact"
            />

            {/* Services Section */}
            <section className={styles.servicesSection}>
                <div className="container">
                    <FadeIn>
                        <h2 className={styles.sectionTitle}>Our Professional Services</h2>
                    </FadeIn>
                    <div className={styles.grid}>
                        {services.map((service, index) => (
                            <GlassCard key={index} delay={index * 0.1} className="flex flex-col h-full">
                                <div className={styles.iconWrapper}>
                                    {service.icon}
                                </div>
                                <h3 className={styles.cardTitle}>{service.title}</h3>
                                <p className={styles.cardDesc}>{service.description}</p>
                                <Link href={service.link} className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all mt-auto">
                                    Learn More <ArrowRight size={18} />
                                </Link>
                            </GlassCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className={styles.processSection}>
                <div className="container">
                    <FadeIn>
                        <h2 className={styles.sectionTitle}>How It Works</h2>
                    </FadeIn>
                    <div className={styles.processGrid}>
                        {processSteps.map((step, index) => (
                            <FadeIn key={index} delay={index * 0.2} direction="up">
                                <div className={styles.processStep}>
                                    <div className={styles.stepNumber}>
                                        {index + 1}
                                    </div>
                                    <h3 className={styles.stepTitle}>{step.title}</h3>
                                    <p className={styles.stepDesc}>{step.description}</p>
                                </div>
                            </FadeIn>
                        ))}
                    </div>
                </div>
            </section>

            {/* Fleet Showcase */}
            <section className={styles.fleetSection}>
                <FadeIn>
                    <Suspense fallback={<div className="h-[600px] w-full bg-gray-100 animate-pulse rounded-xl" />}>
                        <FleetSectionLoader />
                    </Suspense>
                </FadeIn>
            </section>

            {/* FAQ Section */}
            <FAQSection />

            {/* Booking CTA */}
            <section className={styles.ctaSection}>
                <div className={styles.ctaBackground} />
                <div className={styles.ctaContent}>
                    <FadeIn>
                        <blockquote className={styles.quote}>
                            &ldquo;Your journey of faith deserves comfort and care.&rdquo;
                        </blockquote>
                        <Link href="/booking" className={styles.ctaButton}>
                            Book Your Ride Now <ArrowRight size={20} />
                        </Link>
                    </FadeIn>
                </div>
            </section>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Service",
                        "serviceType": "Umrah Transport",
                        "provider": {
                            "@type": "TravelAgency",
                            "name": "Al Aqsa Transport"
                        },
                        "areaServed": {
                            "@type": "Place",
                            "name": "Saudi Arabia"
                        },
                        "hasOfferCatalog": {
                            "@type": "OfferCatalog",
                            "name": "Transport Services",
                            "itemListElement": [
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Pilgrim Transport Makkah and Madinah"
                                    }
                                },
                                {
                                    "@type": "Offer",
                                    "itemOffered": {
                                        "@type": "Service",
                                        "name": "Jeddah Airport to Makkah Transport"
                                    }
                                }
                            ]
                        }
                    })
                }}
            />
        </main>
    );
}
