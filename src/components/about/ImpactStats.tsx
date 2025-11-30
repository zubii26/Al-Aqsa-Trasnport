'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './ImpactStats.module.css';
import { Users, MapPin, Star, Calendar } from 'lucide-react';

const Counter = ({ end, duration = 2000 }: { end: number; duration?: number }) => {
    const [count, setCount] = useState(0);
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.5 });
    const [hasAnimated, setHasAnimated] = useState(false);

    useEffect(() => {
        if (isIntersecting && !hasAnimated) {
            setTimeout(() => setHasAnimated(true), 0);
            let startTime: number | null = null;
            const step = (timestamp: number) => {
                if (!startTime) startTime = timestamp;
                const progress = Math.min((timestamp - startTime) / duration, 1);
                setCount(Math.floor(progress * end));
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        }
    }, [isIntersecting, end, duration, hasAnimated]);

    return <span ref={ref as unknown as React.RefObject<HTMLElement>}>{count.toLocaleString()}+</span>;
};

export default function ImpactStats() {
    const { t } = useLanguage();

    const stats = [
        { id: 'pilgrims', icon: Users, value: 10000 },
        { id: 'trips', icon: MapPin, value: 500 },
        { id: 'reviews', icon: Star, value: 5 }, // Special handling for 5.0
        { id: 'years', icon: Calendar, value: 10 },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {stats.map((stat) => (
                        <div key={stat.id} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                <stat.icon size={32} />
                            </div>
                            <div className={styles.number}>
                                {stat.id === 'reviews' ? '5.0' : <Counter end={stat.value} />}
                            </div>
                            <div className={styles.label}>{t(`about.stats.${stat.id}`)}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
