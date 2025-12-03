'use client';

import styles from './CompanyStory.module.css';
import GlassCard from '@/components/ui/GlassCard';

export default function CompanyStory() {

    const timeline = [
        { year: '2015', title: 'The Beginning', desc: 'Founded with a sincere intention to serve the guests of Allah.' },
        { year: '2018', title: 'Growing Trust', desc: 'Expanded our fleet to meet the growing needs of pilgrims.' },
        { year: '2020', title: 'Resilience & Care', desc: 'Maintained highest safety standards during challenging times.' },
        { year: '2024', title: 'Excellence in Motion', desc: 'Recognized for premium hospitality and reliable transport.' }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Our Sacred Journey</h2>
                    <p className={styles.subtitle}>From vision to service, guided by faith and dedication.</p>
                </div>

                <div className={styles.timeline}>
                    <div className={styles.line}></div>
                    {timeline.map((item, index) => (
                        <div key={item.year} className={`${styles.item} ${index % 2 === 0 ? styles.right : styles.left}`}>
                            <div className={styles.dot}></div>
                            <GlassCard delay={index * 0.2} className={styles.content}>
                                <span className={styles.year}>{item.year}</span>
                                <h3 className={styles.title}>{item.title}</h3>
                                <p className={styles.desc}>{item.desc}</p>
                            </GlassCard>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
