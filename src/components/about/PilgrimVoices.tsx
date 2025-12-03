'use client';

import React from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import styles from './PilgrimVoices.module.css';
import { Quote } from 'lucide-react';

export default function PilgrimVoices() {
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

    const testimonials = [
        { id: 1, author: "Ahmed Al-Sayed", location: "Egypt", text: "Al Aqsa Transport made our Umrah journey so smooth. The driver was punctual and very polite. Highly recommended!" },
        { id: 2, author: "Fatima Khan", location: "Pakistan", text: "Excellent service! The car was clean and comfortable. Will definitely book again for my next trip." },
        { id: 3, author: "Yusuf Rahman", location: "Indonesia", text: "Very professional team. They handled our group transport perfectly. Thank you for the great experience." },
    ];

    return (
        <section className={styles.section} ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={`${styles.title} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        Pilgrim Voices
                    </h2>
                    <p className={`${styles.subtitle} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
                        Hear from those who have journeyed with us.
                    </p>
                </div>
                <div className={styles.grid}>
                    {testimonials.map((item, index) => (
                        <div
                            key={item.id}
                            className={`${styles.card} ${isIntersecting ? styles.animate : ''}`}
                            style={{ transitionDelay: `${index * 0.2}s` }}
                        >
                            <div className={styles.quoteIcon}>
                                <Quote size={24} />
                            </div>
                            <p className={styles.text}>&quot;{item.text}&quot;</p>
                            <div className={styles.author}>
                                <div className={styles.avatar}>
                                    {item.author.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles.name}>{item.author}</div>
                                    <div className={styles.location}>{item.location}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
