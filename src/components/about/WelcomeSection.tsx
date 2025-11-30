'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './WelcomeSection.module.css';
import { CheckCircle2, Quote } from 'lucide-react';

export default function WelcomeSection() {
    const { t } = useLanguage();

    const parseMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const whyChooseUsItems = [0, 1, 2, 3, 4];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('about.welcome.title')}</h2>
                    <p className={styles.subtitle}>{t('about.welcome.subtitle')}</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.intro}>
                        <p className={styles.lead}>{parseMarkdown(t('about.welcome.intro'))}</p>

                        <div className={styles.missionBox}>
                            <span className={styles.sparkle}>✨</span>
                            <p className={styles.mission}>{t('about.welcome.mission')}</p>
                            <span className={styles.sparkle}>✨</span>
                        </div>

                        <p className={styles.description}>{parseMarkdown(t('about.welcome.description'))}</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.whyChooseUs}>
                            <h3 className={styles.subheading}>{t('about.welcome.whyChooseUs.title')}</h3>
                            <ul className={styles.list}>
                                {whyChooseUsItems.map((index) => (
                                    <li key={index} className={styles.listItem}>
                                        <CheckCircle2 className={styles.checkIcon} size={20} />
                                        <span>{parseMarkdown(t(`about.welcome.whyChooseUs.items.${index}`))}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.spiritual}>
                            <div className={styles.quoteBox}>
                                <Quote className={styles.quoteIcon} size={40} />
                                <blockquote className={styles.quote}>
                                    {t('about.welcome.quranQuote')}
                                </blockquote>
                            </div>
                            <p className={styles.conclusion}>
                                {parseMarkdown(t('about.welcome.conclusion'))}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
