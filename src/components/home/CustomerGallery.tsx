'use client';

import React, { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './CustomerGallery.module.css';
import FadeIn from '@/components/common/FadeIn';



interface GalleryItem {
    _id: string;
    image: string;
    caption: string;
    location: string;
}

export default function CustomerGallery() {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('/api/gallery');
                const data = await res.json();
                if (data && data.length > 0) {
                    setItems(data);
                }
            } catch (error) {
                console.error('Failed to fetch gallery items:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 400; // Approx card width
            const currentScroll = scrollContainerRef.current.scrollLeft;
            const targetScroll = direction === 'left'
                ? currentScroll - scrollAmount
                : currentScroll + scrollAmount;

            scrollContainerRef.current.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };

    if (!loading && items.length === 0) return null;

    return (
        <section id="visitor-gallery" className={styles.section}>
            <div className="container mx-auto relative">
                <div className={styles.header}>
                    <FadeIn>
                        <h2 className={styles.title}>Our Happy Pilgrims</h2>
                        <p className={styles.subtitle}>
                            Moments of joy and spiritual fulfillment captured by our valued guests.
                        </p>
                    </FadeIn>
                </div>

                {/* Navigation Buttons */}
                <button
                    onClick={() => scroll('left')}
                    className={`${styles.navButton} ${styles.prevButton}`}
                    aria-label="Previous slide"
                >
                    <ChevronLeft size={24} />
                </button>
                <button
                    onClick={() => scroll('right')}
                    className={`${styles.navButton} ${styles.nextButton}`}
                    aria-label="Next slide"
                >
                    <ChevronRight size={24} />
                </button>

                <div
                    className={styles.grid}
                    ref={scrollContainerRef}
                >
                    {items.map((item, index) => (
                        <FadeIn key={item._id} delay={index * 0.1} className={styles.cardWrapper}>
                            <div className={styles.card}>
                                <Image
                                    src={item.image}
                                    alt={item.caption}
                                    fill
                                    className={styles.image}
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                                <div className={styles.overlay}>
                                    <h3 className={styles.caption}>{item.caption}</h3>
                                    <span className={styles.location}>
                                        <MapPin size={14} /> {item.location}
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
