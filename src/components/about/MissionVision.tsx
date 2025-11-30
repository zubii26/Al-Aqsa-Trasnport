'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import styles from './MissionVision.module.css';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Target, Eye } from 'lucide-react';

export default function MissionVision() {
    const { t } = useLanguage();
    const [ref, isIntersecting] = useIntersectionObserver({ threshold: 0.2 });

    return (
        <section className={styles.section} ref={ref as unknown as React.RefObject<HTMLElement>}>
            <div className="container">
                <div className={styles.grid}>
                    <div className={`${styles.card} ${isIntersecting ? styles.animate : ''}`}>
                        <div className={styles.iconWrapper}>
                            <Target size={40} />
                        </div>
                        <h2>{t('about.missionVision.mission')}</h2>
                        <p>{t('about.missionVision.missionDesc')}</p>
                    </div>
                    <div className={`${styles.card} ${isIntersecting ? styles.animate : ''}`} style={{ transitionDelay: '0.2s' }}>
                        <div className={styles.iconWrapper}>
                            <Eye size={40} />
                        </div>
                        <h2>{t('about.missionVision.vision')}</h2>
                        <p>{t('about.missionVision.visionDesc')}</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
