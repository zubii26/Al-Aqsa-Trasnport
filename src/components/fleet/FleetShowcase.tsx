'use client';

import styles from './FleetShowcase.module.css';
import { Users, Briefcase, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/common/FadeIn';
import { useSettings } from '@/context/SettingsContext';

export interface Vehicle {
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
    const { settings } = useSettings();

    const calculateDiscountedPrice = (priceString: string) => {
        if (!settings?.discount?.enabled) return null;

        // Check dates
        // Check dates
        const now = new Date();
        const nowCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (settings.discount.startDate) {
            const startDate = new Date(settings.discount.startDate);
            const startCheck = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
            if (startCheck > nowCheck) return null;
        }

        if (settings.discount.endDate) {
            const endDate = new Date(settings.discount.endDate);
            // For end date, we want to include the full end day, so check if now is strictly after end date
            // But usually end date from picker is 00:00. Let's assume end of day?
            // If picker gives 00:00, "End Date: Dec 4" usually means "Until Dec 4 23:59".
            // So we should compare if nowCheck > endCheck.
            const endCheck = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());
            if (nowCheck > endCheck) return null;
        }

        // Extract number from price string (e.g. "From 150 SAR" -> 150)
        const match = priceString.match(/(\d+)/);
        if (!match) return null;

        const originalPrice = parseInt(match[0]);
        let finalPrice = originalPrice;

        if (settings.discount.type === 'percentage') {
            finalPrice = Math.round(originalPrice * (1 - settings.discount.value / 100));
        } else {
            finalPrice = Math.max(0, originalPrice - settings.discount.value);
        }

        return {
            original: originalPrice,
            final: finalPrice,
            formatted: priceString.replace(match[0], finalPrice.toString())
        };
    };

    return (
        <section className={styles.showcase}>
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className={styles.sectionTitle}>Our Premium Fleet</h2>
                    <p className={styles.sectionSubtitle}>Choose from our wide range of luxury vehicles</p>
                </div>
                <div className={styles.grid}>
                    {vehicles.map((vehicle, index) => {
                        const discountInfo = calculateDiscountedPrice(vehicle.price);

                        return (
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
                                        {discountInfo && settings?.discount && (
                                            <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                                {settings.discount.type === 'percentage' ? `-${settings.discount.value}% OFF` : `-${settings.discount.value} SAR`}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.content}>
                                        <div className={styles.header}>
                                            <h3 className={styles.name}>{vehicle.name}</h3>
                                            <div className="flex flex-col items-end">
                                                {discountInfo ? (
                                                    <>
                                                        <span className="text-sm text-slate-400 line-through decoration-amber-500/50">{vehicle.price}</span>
                                                        <span className={`${styles.priceTag} text-amber-600`}>{discountInfo.formatted}</span>
                                                    </>
                                                ) : (
                                                    <span className={styles.priceTag}>{vehicle.price}</span>
                                                )}
                                            </div>
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
                                            Book Now
                                        </Link>
                                    </div>

                                </div>
                            </FadeIn>
                        );
                    })}
                </div>
            </div>
        </section >
    );
}
