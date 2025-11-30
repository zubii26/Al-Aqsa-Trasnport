'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CoreValues.module.css';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Shield, Clock, HeartHandshake, Moon } from 'lucide-react';

export default function CoreValues() {
    const { t } = useLanguage();
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.1 });

    const values = [
        { id: 'safety', icon: Shield },
        { id: 'reliability', icon: Clock },
        { id: 'hospitality', icon: HeartHandshake },
        { id: 'spiritual', icon: Moon },
    ];

    return (
        <section className={styles.section} ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={`${styles.title} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`}>
                        {t('about.values.title')}
                    </h2>
                    <p className={`${styles.subtitle} ${isIntersecting ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ transitionDelay: '0.1s' }}>
                        {t('about.values.subtitle')}
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
                            <h3>{t(`about.values.${value.id}`)}</h3>
                            <p>{t(`about.values.${value.id}Desc`)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
