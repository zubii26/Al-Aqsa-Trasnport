'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './CompanyStory.module.css';

export default function CompanyStory() {
    const { t } = useLanguage();

    const timeline = ['2015', '2018', '2020', '2024'];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('about.story.title')}</h2>
                    <p className={styles.subtitle}>{t('about.story.tagline')}</p>
                </div>

                <div className={styles.timeline}>
                    <div className={styles.line}></div>
                    {timeline.map((year, index) => (
                        <div key={year} className={`${styles.item} ${index % 2 === 0 ? styles.right : styles.left}`}>
                            <div className={styles.dot}></div>
                            <div className={styles.content}>
                                <span className={styles.year}>{year}</span>
                                <h3 className={styles.title}>{t(`about.story.timeline.${year}.title`)}</h3>
                                <p className={styles.desc}>{t(`about.story.timeline.${year}.desc`)}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
