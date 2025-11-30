'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import styles from './AboutHero.module.css';

export default function AboutHero() {
    const { t } = useLanguage();
    const [offset, setOffset] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setOffset(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className={styles.hero}>
            <div
                className={styles.parallaxWrapper}
                style={{ transform: `translateY(${offset * 0.5}px)` }}
            >
                <Image
                    src="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
                    alt="Makkah Background"
                    fill
                    priority
                    className={styles.bgImage}
                    quality={90}
                />
            </div>
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h1 className={`${styles.title} animate-fade-in-up`}>{t('about.hero.title')}</h1>
                <p className={`${styles.subtitle} animate-fade-in-up delay-200`}>{t('about.hero.subtitle')}</p>
            </div>
            <div className={styles.scrollIndicator}>
                <div className={styles.mouse}>
                    <div className={styles.wheel}></div>
                </div>
                <span className={styles.scrollText}>{t('common.scrollDown') || 'Scroll Down'}</span>
            </div>
        </section>
    );
}
