'use client';

import styles from './FeatureHighlights.module.css';
import { Shield, Star, Clock, HeartHandshake } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function FeatureHighlights() {

    const features = [
        { id: 'safety', icon: Shield, title: 'Safety First', desc: 'Our vehicles are regularly inspected and maintained to ensure your safety.' },
        { id: 'comfort', icon: Star, title: 'Premium Comfort', desc: 'Enjoy a relaxing journey with spacious seating and climate control.' },
        { id: 'reliability', icon: Clock, title: 'Always On Time', desc: 'We value your time and guarantee punctual pickups and drop-offs.' },
        { id: 'hospitality', icon: HeartHandshake, title: 'Warm Hospitality', desc: 'Our drivers are trained to serve you with respect and courtesy.' },
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
                                <h3>{feature.title}</h3>
                                <p>{feature.desc}</p>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
