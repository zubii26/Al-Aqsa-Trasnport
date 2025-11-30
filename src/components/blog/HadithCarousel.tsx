'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import styles from './HadithCarousel.module.css';
import { hadithCollection } from '@/lib/blogData';
import FadeIn from '@/components/common/FadeIn';

export default function HadithCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % hadithCollection.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + hadithCollection.length) % hadithCollection.length);
    };

    useEffect(() => {
        if (!isAutoPlaying) return;

        const interval = setInterval(() => {
            handleNext();
        }, 6000); // Rotate every 6 seconds

        return () => clearInterval(interval);
    }, [isAutoPlaying]); // Removed currentIndex dependency as handleNext uses functional update

    const handleDotClick = (index: number) => {
        setCurrentIndex(index);
        setIsAutoPlaying(false); // Pause auto-play on manual interaction
    };

    const currentHadith = hadithCollection[currentIndex];

    return (
        <section className={styles.carouselSection}>
            <div className={styles.container}>
                <FadeIn>
                    <div className={styles.sectionHeader}>
                        <Star className={styles.decorativeIcon} size={24} />
                        <h2 className={styles.title}>Sayings of Prophet Muhammad (S.A.W.W)</h2>
                        <p className={styles.subtitle}>Timeless wisdom to guide our character and daily lives.</p>
                    </div>
                </FadeIn>

                <div
                    className={styles.carouselContainer}
                    onMouseEnter={() => setIsAutoPlaying(false)}
                    onMouseLeave={() => setIsAutoPlaying(true)}
                >
                    <div className={styles.cardWrapper}>
                        <div key={currentIndex} className={styles.hadithCard}> {/* Key forces re-render for animation if we add CSS animation */}
                            <div className={styles.cardContent}>
                                <Quote size={48} className={styles.quoteIcon} />
                                <p className={styles.hadithText}>&quot;{currentHadith.text}&quot;</p>
                                <div className={styles.hadithSource}>
                                    <span className={styles.sourceName}>{currentHadith.source}</span>
                                    {currentHadith.narrator && (
                                        <span className={styles.narrator}>{currentHadith.narrator}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button onClick={handlePrev} className={styles.controlButton} aria-label="Previous Hadith">
                            <ChevronLeft size={24} />
                        </button>
                        <button onClick={handleNext} className={styles.controlButton} aria-label="Next Hadith">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className={styles.indicators}>
                        {hadithCollection.map((_, index) => (
                            <button
                                key={index}
                                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => handleDotClick(index)}
                                aria-label={`Go to Hadith ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
