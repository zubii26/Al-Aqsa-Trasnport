'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, Check, ArrowRight } from 'lucide-react';
import styles from './FleetCarousel.module.css';
import Link from 'next/link';

interface Vehicle {
    id: string;
    name: string;
    image: string;
    passengers: number;
    luggage: number;
    features: string[];
    price: string;
}

interface FleetCarouselProps {
    vehicles: Vehicle[];
}

export default function FleetCarousel({ vehicles }: FleetCarouselProps) {
    if (vehicles.length === 0) return null;

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Premium Fleet</h2>
                    <p className={styles.subtitle}>Experience comfort and luxury with our diverse range of vehicles</p>
                </div>

                <div className={styles.carouselContainer}>
                    {vehicles.map((vehicle, index) => (
                        <div key={vehicle.id} className={`${styles.card} glass-card`}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={vehicle.image}
                                    alt={vehicle.name}
                                    fill
                                    className={styles.vehicleImage}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    priority={index < 2}
                                />
                            </div>
                            <div className={styles.content}>
                                <div className={styles.cardHeader}>
                                    <h3 className={styles.vehicleName}>{vehicle.name}</h3>
                                    <span className={styles.priceTag}>{vehicle.price}</span>
                                </div>

                                <div className={styles.specs}>
                                    <div className={styles.specItem}>
                                        <Users size={18} className="text-primary" />
                                        <span>{vehicle.passengers} Passengers</span>
                                    </div>
                                    <div className={styles.specItem}>
                                        <Briefcase size={18} className="text-primary" />
                                        <span>{vehicle.luggage} Bags</span>
                                    </div>
                                </div>

                                <div className={styles.features}>
                                    {vehicle.features.slice(0, 3).map((feature, i) => (
                                        <div key={i} className={styles.featureItem}>
                                            <Check size={14} className="text-accent" />
                                            <span>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Link href="/booking" className={`${styles.bookBtn} btn-primary`}>
                                    Book Now <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
