'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './FeatureHighlights.module.css';
import { Shield, Star, Clock, HeartHandshake } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function FeatureHighlights() {
    const { t } = useLanguage();

    const features = [
        { id: 'safety', icon: Shield },
        { id: 'comfort', icon: Star },
        { id: 'reliability', icon: Clock },
        { id: 'hospitality', icon: HeartHandshake },
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.grid}>
                    {features.map((feature, index) => (
                        <FadeIn key={feature.id} delay={index * 0.1}>
                            <div className={`${styles.card} glass-card`}>
                                <div className={styles.iconWrapper}>
                                    <feature.icon size={32} />
                                </div>
                                <h3>{t(`fleet.highlights.${feature.id}`)}</h3>
                                <p>{t(`fleet.highlights.${feature.id}Desc`)}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
