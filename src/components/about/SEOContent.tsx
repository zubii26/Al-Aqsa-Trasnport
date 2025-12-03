'use client';

import React from 'react';
import styles from './SEOContent.module.css';
import { MapPin, Plane, Star, Clock, ShieldCheck, HeartHandshake } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function SEOContent() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.header}>
                        <h2 className={styles.title}>Comprehensive Umrah Transport Services</h2>
                        <p className={styles.subtitle}>
                            Your trusted partner for seamless travel between Jeddah, Makkah, and Madinah. We specialize in providing comfort, reliability, and spiritual peace of mind.
                        </p>
                    </div>
                </FadeIn>

                <div className={styles.grid}>
                    <FadeIn delay={0.1}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Plane className="text-[#d4af37]" size={24} />
                                Jeddah Airport to Makkah Taxi
                            </h3>
                            <p className={styles.cardText}>
                                Start your spiritual journey with ease. Our <span className={styles.highlight}>Jeddah Airport to Makkah taxi service</span> ensures a smooth pickup from King Abdulaziz International Airport (KAIA). We track your flight to guarantee timely arrival, offering a stress-free transfer directly to your hotel in Makkah.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.2}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <MapPin className="text-[#d4af37]" size={24} />
                                Makkah to Madinah Taxi
                            </h3>
                            <p className={styles.cardText}>
                                Travel between the two Holy Cities in ultimate comfort. Our <span className={styles.highlight}>Makkah to Madinah taxi</span> service offers a scenic and relaxing drive. Choose from our fleet of GMC Yukons, Hyundai Starias, or Toyota Hiaces for a private and convenient inter-city transfer.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.3}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Star className="text-[#d4af37]" size={24} />
                                VIP & Luxury Transport
                            </h3>
                            <p className={styles.cardText}>
                                Experience the pinnacle of travel with our <span className={styles.highlight}>VIP Umrah transport</span>. We offer premium vehicles like the GMC Yukon XL and Lexus ES, driven by professional chauffeurs who understand the needs of VIP pilgrims. Perfect for those seeking privacy and luxury.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.4}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <Clock className="text-[#d4af37]" size={24} />
                                Ziyarat Tours in Makkah & Madinah
                            </h3>
                            <p className={styles.cardText}>
                                Explore the historical sites of Islam. We provide comprehensive <span className={styles.highlight}>Ziyarat taxi services</span> in both Makkah and Madinah. Visit Jabal al-Nour, Masjid Quba, Mount Uhud, and more with knowledgeable drivers who can guide you to these blessed locations.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.5}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <ShieldCheck className="text-[#d4af37]" size={24} />
                                Safe & Licensed Drivers
                            </h3>
                            <p className={styles.cardText}>
                                Safety is our priority. All our drivers are fully licensed, experienced, and trained to serve Hajj and Umrah pilgrims. Our vehicles undergo regular maintenance checks to ensure a safe journey for you and your family across Saudi Arabia.
                            </p>
                        </div>
                    </FadeIn>

                    <FadeIn delay={0.6}>
                        <div className={styles.card}>
                            <h3 className={styles.cardTitle}>
                                <HeartHandshake className="text-[#d4af37]" size={24} />
                                Affordable Umrah Taxi Rates
                            </h3>
                            <p className={styles.cardText}>
                                We believe in transparent pricing. Get the best <span className={styles.highlight}>Umrah taxi rates</span> with no hidden fees. Whether you need a budget-friendly sedan or a spacious bus for a group, we offer competitive packages tailored to your needs.
                            </p>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
