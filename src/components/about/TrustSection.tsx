'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './TrustSection.module.css';

export default function TrustSection() {
    const { t } = useLanguage();

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.card}>
                    <div className={styles.glow}></div>
                    <blockquote className={styles.quote}>
                        &quot;{t('about.trust.quote')}&quot;
                    </blockquote>
                    <cite className={styles.source}>- {t('about.trust.source')}</cite>
                </div>
            </div>
        </section>
    );
}
