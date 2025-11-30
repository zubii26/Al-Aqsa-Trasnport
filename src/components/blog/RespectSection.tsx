import React from 'react';
import { BookOpen, Heart, Shield, Handshake } from 'lucide-react';
import styles from './RespectSection.module.css';
import FadeIn from '@/components/common/FadeIn';
import { respectSectionData } from '@/lib/blogData';

export default function RespectSection() {
    return (
        <section className={styles.respectSection}>
            <div className="container">
                <div className={styles.respectHeader}>
                    <FadeIn>
                        <div className={styles.verseContainer}>
                            <BookOpen className={styles.verseIcon} size={32} />
                            <blockquote className={styles.quranVerse}>
                                &quot;{respectSectionData.verse.text}&quot;
                                <cite>{respectSectionData.verse.reference}</cite>
                            </blockquote>
                        </div>
                        <h2 className={styles.respectTitle}>{respectSectionData.title}</h2>
                        <p className={styles.respectIntro}>{respectSectionData.intro}</p>
                    </FadeIn>
                </div>

                <div className={styles.commitmentsGrid}>
                    {respectSectionData.commitments.map((item, index) => {
                        const Icon = item.icon === 'Heart' ? Heart : item.icon === 'Shield' ? Shield : Handshake;
                        return (
                            <FadeIn key={index} delay={index * 0.1}>
                                <div className={styles.commitmentCard}>
                                    <div className={styles.commitmentIconWrapper}>
                                        <Icon size={24} className={styles.commitmentIcon} />
                                    </div>
                                    <p className={styles.commitmentText}>{item.text}</p>
                                </div>
                            </FadeIn>
                        );
                    })}
                </div>

                <FadeIn delay={0.4}>
                    <div className={styles.respectClosing}>
                        <p>{respectSectionData.closing}</p>
                    </div>
                </FadeIn>
            </div>
        </section>
    );
}
