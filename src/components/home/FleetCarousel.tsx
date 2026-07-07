'use client';

import React from 'react';
import Image from 'next/image';
import { Users, Briefcase, Check, ArrowRight, Tag } from 'lucide-react';
import styles from './FleetCarousel.module.css';
import GlassButton from '@/components/ui/GlassButton';
import { getWhatsAppLink } from '@/lib/whatsapp';

export interface Vehicle {
    id: string;
    name: string;
    image: string;
    passengers: number | string;
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

    // Duplicate list for seamless infinite scroll
    const displayVehicles = [...vehicles, ...vehicles];

    // Check if discount is active
    const now = new Date();
    const isDiscountActive = discount?.enabled &&
        (!discount.startDate || new Date(discount.startDate) <= now) &&
        (!discount.endDate || new Date(discount.endDate) > now);

    return (
        <section className={styles.section}>
            <div className="container px-[10px] md:px-4">
                <div className={styles.header}>
                    <span className="text-amber-600 dark:text-amber-500 font-bold tracking-widest text-sm uppercase mb-3 block">Our Premium Fleet</span>
                    <h2 className={styles.title}>
                        Travel in <span className="text-amber-600 dark:text-amber-500">Absolute Comfort</span>
                    </h2>
                    <p className={styles.subtitle}>
                        Experience VIP comfort specific for Makkah & Madinah travel.
                        <br className="hidden md:block" />
                        Choose from our luxury GMC Yukons and spacious family vans.
                    </p>
                </div>

                <div className="fleet-marquee-wrapper">
                    <div className="fleet-marquee-track">
                        {displayVehicles.map((vehicle, index) => (
                            <div key={`${vehicle.id}-${index}`} className={`${styles.card} glass-card marquee-card`}>
                                <div className={styles.imageWrapper} onDragStart={(e) => e.preventDefault()}>
                                    <Image
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        fill
                                        className={styles.vehicleImage}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        loading="lazy"
                                        draggable={false}
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
                                        <GlassButton
                                            href={`/booking?vehicle=${vehicle.id}`}
                                            variant="secondary"
                                            className="w-full justify-center gap-2 !bg-secondary !bg-none hover:!bg-primary hover:!text-primary-foreground transition-all duration-300"
                                        >
                                            Book {vehicle.name} <ArrowRight size={16} />
                                        </GlassButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
