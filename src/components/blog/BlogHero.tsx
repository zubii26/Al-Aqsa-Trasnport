import React from 'react';
import styles from './BlogHero.module.css';
import FadeIn from '@/components/common/FadeIn';

export default function BlogHero() {
    return (
        <section className={styles.hero}>
            <div className="container">
                <div className={styles.heroContent}>
                    <FadeIn direction="down">
                        <h1 className={styles.title}>Pilgrim Resources & Insights</h1>
                    </FadeIn>
                    <FadeIn delay={0.2} direction="up">
                        <p className={styles.subtitle}>
                            Expert guides, travel tips, and answers to your questions for a blessed and hassle-free Umrah journey.
                        </p>
                    </FadeIn>
                </div>
            </div>
        </section>
    );
}
