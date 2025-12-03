'use client';

import React from 'react';
import styles from './CoreValues.module.css';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Shield, Clock, HeartHandshake, Moon } from 'lucide-react';

export default function CoreValues() {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

    const values = [
        { id: 'safety', icon: Shield, title: 'Safety First', desc: 'We prioritize the safety of our passengers above all else, with well-maintained vehicles and trained drivers.' },
        { id: 'reliability', icon: Clock, title: 'Reliability', desc: 'Punctuality is our promise. We ensure you reach your destination on time, every time.' },
        { id: 'hospitality', icon: HeartHandshake, title: 'Hospitality', desc: 'We treat every pilgrim as a guest of Allah, serving with kindness, respect, and patience.' },
        { id: 'spiritual', icon: Moon, title: 'Spiritual Focus', desc: 'We understand the sacred nature of your journey and strive to maintain a peaceful and respectful environment.' },
    ];

    return (
        <section className={styles.section} ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={`${styles.title} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        Our Core Values
                    </h2>
                    <p className={`${styles.subtitle} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
                        The principles that guide our service to the Guests of Allah.
                    </p>
                </div>
                <div className={styles.grid}>
                    {values.map((value, index) => (
                        <div
                            key={value.id}
                            className={`${styles.card} ${isIntersecting ? styles.animate : ''}`}
                            style={{ transitionDelay: `${index * 0.1}s` }}
                        >
                            <div className={styles.iconWrapper}>
                                <value.icon size={32} />
                            </div>
                            <h3>{value.title}</h3>
                            <p>{value.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
