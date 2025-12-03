'use client';

import React from 'react';
import styles from './MissionVision.module.css';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <section className={styles.section} ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={`${styles.card} ${isIntersecting ? styles.animate : ''}`}>
                        <div className={styles.iconWrapper}>
                            <Target size={40} />
                        </div>
                        <h2>Our Mission</h2>
                        <p>To provide safe, reliable, and spiritually enriching transport services for pilgrims, ensuring their journey is focused on worship and peace of mind.</p>
                    </div>
                    <div className={`${styles.card} ${isIntersecting ? styles.animate : ''}`} style={{ transitionDelay: '0.2s' }}>
                        <div className={styles.iconWrapper}>
                            <Eye size={40} />
                        </div>
                        <h2>Our Vision</h2>
                        <p>To be the most trusted and preferred transport partner for Hajj and Umrah pilgrims, setting the standard for excellence in hospitality and logistics.</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
