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
    const scrollContainerRef = React.useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            // Get proper scroll amount based on card width + gap
            const cardWidth = container.firstElementChild?.clientWidth || 350;
            const gap = 16; // Approx gap
            const scrollAmount = direction === 'left' ? -(cardWidth + gap) : (cardWidth + gap);

            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (vehicles.length === 0) return null;

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

                <div className="relative group">
                    <button
                        onClick={() => scroll('left')}
                        className={`${styles.navBtn} ${styles.prevBtn}`}
                        aria-label="Scroll Left"
                    >
                        <ArrowRight className="rotate-180" size={24} />
                    </button>

                    <div
                        ref={scrollContainerRef}
                        className={`${styles.carouselContainer} cursor-grab active:cursor-grabbing select-none`}
                        onMouseDown={(e) => {
                            const slider = scrollContainerRef.current;
                            if (!slider) return;
                            let isDown = true;
                            let startX = e.pageX - slider.offsetLeft;
                            let scrollLeft = slider.scrollLeft;

                            const onMouseLeave = () => {
                                isDown = false;
                                slider.classList.remove('active');
                            };

                            const onMouseUp = () => {
                                isDown = false;
                                slider.classList.remove('active');
                                window.removeEventListener('mouseup', onMouseUp);
                                window.removeEventListener('mousemove', onMouseMove);
                            };

                            const onMouseMove = (e: MouseEvent) => {
                                if (!isDown) return;
                                e.preventDefault();
                                const x = e.pageX - slider.offsetLeft;
                                const walk = (x - startX) * 2; // Scroll-fast
                                slider.scrollLeft = scrollLeft - walk;
                            };

                            window.addEventListener('mouseup', onMouseUp);
                            window.addEventListener('mousemove', onMouseMove);
                        }}
                    >
                        {vehicles.map((vehicle, index) => (
                            <div key={vehicle.id} className={`${styles.card} glass-card`}>
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
                                            href={getWhatsAppLink(`Salam Al Aqsa, I am interested in booking the ${vehicle.name} (${vehicle.passengers} pax).`)}
                                            target="_blank"
                                            variant="secondary"
                                            className="w-full justify-center gap-2 !bg-secondary !bg-none hover:!bg-primary hover:!text-primary-foreground transition-all duration-300"
                                        >
                                            Book via WhatsApp <ArrowRight size={16} />
                                        </GlassButton>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => scroll('right')}
                        className={`${styles.navBtn} ${styles.nextBtn}`}
                        aria-label="Scroll Right"
                    >
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}
