import React from 'react';
import Image from 'next/image';
import { Calendar, Shield, Map } from 'lucide-react';
import styles from './TravelTips.module.css';
import FadeIn from '@/components/common/FadeIn';

const tips = [
    {
        title: "Book in Advance",
        description: "Especially during peak seasons like Ramadan and Hajj, booking your transport weeks ahead ensures availability and better rates.",
        icon: <Calendar size={28} />,
        image: "/images/blog/tip-booking.png"
    },
    {
        title: "Verify Licensing",
        description: "Always choose a licensed transport provider to ensure safety, insurance coverage, and professional service standards.",
        icon: <Shield size={28} />,
        image: "/images/blog/tip-safety.png"
    },
    {
        title: "Plan Ziyarat Routes",
        description: "Discuss your Ziyarat locations with your driver beforehand to optimize your route and save time for worship.",
        icon: <Map size={28} />,
        image: "/images/blog/tip-route.png"
    }
];

export default function TravelTips() {
    return (
        <section className={styles.tipsSection}>
            <div className="container">
                <FadeIn>
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <span className="text-gold-500 font-bold tracking-widest uppercase text-sm mb-3 block">Expert Advice</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Essential Travel Tips</h2>
                        <p className="text-slate-500 text-lg font-light">
                            Maximize your spiritual experience with these key recommendations for a smooth and hassle-free journey.
                        </p>
                    </div>
                </FadeIn>

                <div className={styles.tipsGrid}>
                    {tips.map((tip, index) => (
                        <FadeIn key={index} delay={index * 0.1} direction="up">
                            <div className={styles.tipCard}>
                                <span className={styles.tipNumber}>0{index + 1}</span>
                                <div className={styles.contentWrapper}>
                                    {tip.image ? (
                                        <div className={styles.tipImageWrapper}>
                                            <Image
                                                src={tip.image}
                                                alt={tip.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <div className={styles.tipIcon}>
                                            {tip.icon}
                                        </div>
                                    )}
                                    <h3 className={styles.tipTitle}>{tip.title}</h3>
                                    <p className={styles.tipText}>{tip.description}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
