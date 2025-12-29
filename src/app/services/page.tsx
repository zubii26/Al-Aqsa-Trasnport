import React, { Suspense } from 'react';
import Link from 'next/link';
import { Bus, MapPin, Users, Headphones, ArrowRight, Calendar, CheckCircle, Car, Check } from 'lucide-react';
import styles from './page.module.css';
import FleetSectionLoader from '@/components/services/FleetSectionLoader';
import FadeIn from '@/components/common/FadeIn';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FAQSection from '@/components/services/FAQSection';
import GlassCard from '@/components/ui/GlassCard';
import TrustAmenities from '@/components/services/TrustAmenities';
import ReviewsSection from '@/components/reviews/ReviewsSection';

export async function generateMetadata() {
    return {
        title: "Professional Umrah Transport Services | VIP & Bus",
        description: "Explore our Umrah transport services: Jeddah to Makkah taxi, Madinah transfers, intercity travel & Ziyarat tours. Premium packages for every pilgrim.",
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
            description: 'Travel between Holy Cities in our luxury fleet. Choose from spacious GMC Yukons or comfortable Hyundai H1 vans for a relaxing 450km journey.',
            image: '/images/routes/makkah-madinah-route-hero.png',
            link: '/services/makkah-madinah-taxi',
            features: ['Door-to-Door Service', 'Luxury Fleet Options', '4.5 Hour Average Time']
        },
        {
            title: 'Jeddah Airport to Makkah Taxi',
            description: 'Reliable and punctual airport transfers. Our driver waits for you at King Abdulaziz International Airport (KAIA) for a seamless start to your Umrah.',
            image: '/images/routes/jeddah-airport-hero-professional.png',
            link: '/services/jeddah-airport-transfer',
            features: ['Flight Tracking', 'Free Meet & Greet', 'Luggage Assistance']
        },
        {
            title: 'VIP Luxury Umrah Transport',
            description: 'Experience premium comfort with our VIP service. Top-of-the-line vehicles (GMC Yukon XL) and private chauffeurs for maximum privacy and ease.',
            image: '/images/fleet/gmc-yukon-hero-professional.png',
            link: '/booking?service=luxury',
            features: ['Private Chauffeur', 'Latest Model Vehicles', 'Privacy Partition']
        },
        {
            title: 'Ziarah Tours & Daily Rentals',
            description: 'Explore historical sites in Makkah and Madinah with our flexible hourly rental packages. Visit Jabal Al-Nour, Quba Mosque, and more.',
            image: '/images/routes/makkah-ziyarat-hero.png',
            link: '/services/ziyarat-tours',
            features: ['Custom Itinerary', 'Expert Local Knowledge', 'Flexible Hours']
        }
    ];

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            <Hero
                title="Dedicated Umrah Transport Services for the Guests of Allah"
                subtitle="Reliable Jeddah airport to Makkah transport, private cars, and group packages for your spiritual journey."
                bgImage="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?q=80&w=2000&auto=format&fit=crop"
                ctaText="Book Your Ride"
                ctaLink="/booking"
                secondaryCtaText="Contact Us"
                secondaryCtaLink="/contact"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* Trust Amenities Section - NEW */}
            <TrustAmenities />

            {/* Services Section */}
            <section className={styles.servicesSection}>
                <div className="container">
                    <FadeIn>
                        <h2 className={styles.sectionTitle}>Our Premium Umrah Transport Services</h2>
                    </FadeIn>
                    <div className="flex flex-col gap-24 px-4 max-w-7xl mx-auto">
                        {services.map((service, index) => {
                            // Zig-Zag Logic:
                            // Index 0 (First): Image Left, Text Right (Image Order 1)
                            // Index 1 (Second): Text Left, Image Right (Image Order 2)
                            const isImageRight = index % 2 !== 0;

                            return (
                                <div key={index} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                                    {/* Image Side */}
                                    <div className={`w-full lg:w-1/2 relative h-[400px] lg:h-[500px] rounded-[2.5rem] overflow-hidden shadow-2xl ${isImageRight ? 'lg:order-2' : 'lg:order-1'}`}>
                                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all duration-500 z-10" />
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover transition-transform duration-700 ease-in-out hover:scale-110"
                                        />
                                    </div>

                                    {/* Content Side */}
                                    <div className={`w-full lg:w-1/2 flex flex-col justify-center ${isImageRight ? 'lg:order-1' : 'lg:order-2'}`}>
                                        <div className="mb-6">
                                            <h3 className="text-3xl lg:text-5xl font-bold font-playfair text-slate-900 dark:text-white mb-6 leading-tight">
                                                {service.title}
                                            </h3>
                                            <div className="h-2 w-24 bg-amber-500 rounded-full" />
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed mb-8">
                                            {service.description}
                                        </p>

                                        {/* Benefits List */}
                                        <ul className="mb-10 space-y-4">
                                            {service.features.map((feat, i) => (
                                                <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-200 font-medium text-lg">
                                                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-red-50 text-red-500 flex items-center justify-center border border-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                                                        <Check size={14} strokeWidth={3} />
                                                    </span>
                                                    {feat}
                                                </li>
                                            ))}
                                        </ul>

                                        <Link
                                            href={service.link}
                                            className="inline-flex items-center gap-2 text-white bg-amber-500 hover:bg-amber-600 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-sm transition-all shadow-lg hover:shadow-amber-500/30 group/link self-start"
                                        >
                                            Learn More
                                            <ArrowRight size={18} className="group-hover/link:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
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

            {/* Reviews Section - NEW */}
            <ReviewsSection />

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
