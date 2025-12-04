'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, Check, ArrowRight, Tag } from 'lucide-react';
import styles from './FleetCarousel.module.css';
import GlassButton from '@/components/ui/GlassButton';

export interface Vehicle {
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
    discount?: {
        enabled: boolean;
        type: 'percentage' | 'fixed';
        value: number;
        startDate?: string;
        endDate?: string;
    };
}

export default function FleetCarousel({ vehicles, discount }: FleetCarouselProps) {
    if (vehicles.length === 0) return null;

    // Check if discount is active
    const now = new Date();
    const isDiscountActive = discount?.enabled &&
        (!discount.startDate || new Date(discount.startDate) <= now) &&
        (!discount.endDate || new Date(discount.endDate) > now);

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
                                {isDiscountActive && (
                                    <div className={styles.discountBadge}>
                                        <Tag size={14} className="fill-current" />
                                        <span>
                                            {discount?.type === 'percentage' ? `${discount.value}% OFF` : `${discount?.value} SAR OFF`}
                                        </span>
                                    </div>
                                )}
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

                                <div className="mt-auto">
                                    <GlassButton href="/booking" variant="secondary" className="w-full justify-center gap-2">
                                        Book Now <ArrowRight size={16} />
                                    </GlassButton>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
