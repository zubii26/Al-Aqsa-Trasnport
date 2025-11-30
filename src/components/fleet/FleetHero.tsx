'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './FleetHero.module.css';
import FadeIn from '@/components/common/FadeIn';

export default function FleetHero() {
    const { t } = useLanguage();

    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContent}>
                    <div className={styles.heroText}>
                        <FadeIn direction="right">
                            <h1 className={styles.heroTitle}>
                                {t('fleet.hero.title') || 'Our Premium Fleet'}
                            </h1>
                        </FadeIn>
                        <FadeIn delay={0.2} direction="right">
                            <p className={styles.heroSubtitle}>
                                {t('fleet.hero.subtitle') || 'Experience luxury and comfort with our diverse range of vehicles, tailored for your spiritual journey.'}
                            </p>
                        </FadeIn>
                        <FadeIn delay={0.4} direction="up">
                            <div className="flex gap-4 justify-center md:justify-start">
                                <button className="btn btn-primary">
                                    {t('fleet.hero.cta') || 'Book Your Ride'}
                                </button>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </section>
    );
}
