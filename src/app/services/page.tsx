import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Bus, MapPin, Users, Headphones, ArrowRight, Calendar, CheckCircle, Car } from 'lucide-react';
import styles from './page.module.css';
import FleetCarousel from '@/components/home/FleetCarousel';
import FadeIn from '@/components/common/FadeIn';
import Hero from '@/components/common/Hero';
import FAQSection from '@/components/services/FAQSection';
import { getFleet } from '@/lib/db';



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

export default async function ServicesPage() {
    const vehicles = await getFleet();
    const carouselVehicles = vehicles.slice(0, 6);

    const services = [
        {
            title: 'Pilgrim Transport Makkah and Madinah',
            description: 'Experience the highest level of comfort with our modern fleet of air-conditioned buses and GMC Yukons. Perfect for relaxing after your spiritual duties.',
            icon: <Bus size={32} />,
            link: '/booking?service=luxury'
        },
        {
            title: 'Jeddah Airport to Makkah Transport',
            description: 'Seamless transfers between Makkah, Madinah, and Jeddah airports. We track your arrival to ensure punctual pickup and smooth journey.',
            icon: <MapPin size={32} />,
            link: '/booking?service=transfer'
        },
        {
            title: 'Group Umrah Transport Packages',
            description: 'Tailored solutions for families and large groups. We provide spacious vehicles and coordinate logistics so you can focus on your worship.',
            icon: <Users size={32} />,
            link: '/booking?service=group'
        },
        {
            title: '24/7 Support',
            description: 'Our multilingual support team is always available to assist you. From booking inquiries to on-ground assistance, we are here for you.',
            icon: <Headphones size={32} />,
            link: '/contact'
        }
    ];

    return (
        <main className={styles.main}>
            {/* Hero Section */}
            {/* Hero Section */}
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
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className={`${styles.card} glass-card`}>
                                    <div className={styles.iconWrapper}>
                                        {service.icon}
                                    </div>
                                    <h3 className={styles.cardTitle}>{service.title}</h3>
                                    <p className={styles.cardDesc}>{service.description}</p>
                                    <Link href={service.link} className="text-primary font-semibold flex items-center gap-2 hover:gap-3 transition-all">
                                        Learn More <ArrowRight size={18} />
                                    </Link>
                                </div>
                            </FadeIn>
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
                    <FleetCarousel vehicles={carouselVehicles} />
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
        </main>
    );
}
