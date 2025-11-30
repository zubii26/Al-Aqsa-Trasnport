'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './FleetShowcase.module.css';
import { Users, Briefcase, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/common/FadeIn';

interface Vehicle {
    id: string;
    name: string;
    price: string;
    passengers: number;
    luggage: number;
    features: string[];
    image: string;
}

interface FleetShowcaseProps {
    vehicles: Vehicle[];
}

export default function FleetShowcase({ vehicles }: FleetShowcaseProps) {
    const { t } = useLanguage();

    return (
        <section className={styles.showcase}>
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className={styles.sectionTitle}>{t('fleet.showcase.title') || 'Our Premium Fleet'}</h2>
                    <p className={styles.sectionSubtitle}>{t('fleet.showcase.subtitle') || 'Choose from our wide range of luxury vehicles'}</p>
                </div>
                <div className={styles.grid}>
                    {vehicles.map((vehicle, index) => (
                        <FadeIn key={vehicle.id} delay={index * 0.1}>
                            <div className={`${styles.card} glass-card`}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        fill
                                        className={styles.vehicleImage}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>

                                <div className={styles.content}>
                                    <div className={styles.header}>
                                        <h3 className={styles.name}>{vehicle.name}</h3>
                                        <span className={styles.priceTag}>{vehicle.price}</span>
                                    </div>

                                    <div className={styles.specs}>
                                        <div className={styles.spec}>
                                            <Users size={18} className="text-primary" />
                                            <span>{vehicle.passengers} Passengers</span>
                                        </div>
                                        <div className={styles.spec}>
                                            <Briefcase size={18} className="text-primary" />
                                            <span>{vehicle.luggage} Bags</span>
                                        </div>
                                    </div>

                                    <div className={styles.features}>
                                        {vehicle.features.map((feature: string, i: number) => (
                                            <div key={i} className={styles.featureItem}>
                                                <Check size={14} className="text-accent" />
                                                <span>{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <Link href="/booking" className={`${styles.bookBtn} btn-primary`}>
                                        {t('fleet.showcase.bookNow')}
                                    </Link>
                                </div>

                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section >
    );
}
