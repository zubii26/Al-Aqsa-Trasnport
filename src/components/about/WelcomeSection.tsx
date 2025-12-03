'use client';

import styles from './WelcomeSection.module.css';
import { CheckCircle2, Quote } from 'lucide-react';

export default function WelcomeSection() {

    const parseMarkdown = (text: string) => {
        const parts = text.split(/(\*\*.*?\*\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    const whyChooseUsItems = [
        "**Reliable pilgrim transport** across Saudi Arabia",
        "**Specialized routes for Umrah pilgrims** (Makkah, Madinah, Jeddah)",
        "**Comfortable seating and air‑conditioned vehicles**",
        "**Affordable packages with transparent pricing**",
        "**Spiritual commitment to serving the Guests of Allah**"
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>Welcome to Al Aqsa Umrah Transport</h2>
                    <p className={styles.subtitle}>Your trusted partner in pilgrim travel across Saudi Arabia.</p>
                </div>

                <div className={styles.content}>
                    <div className={styles.intro}>
                        <p className={styles.lead}>{parseMarkdown("We specialize in providing **safe, comfortable, and affordable Umrah transport services** for pilgrims traveling to Makkah, Madinah, and beyond.")}</p>

                        <div className={styles.missionBox}>
                            <span className={styles.sparkle}>✨</span>
                            <p className={styles.mission}>Serving the Guests of Allah with comfort and care is our mission.</p>
                            <span className={styles.sparkle}>✨</span>
                        </div>

                        <p className={styles.description}>{parseMarkdown("Our fleet of modern buses and vans ensures **stress‑free travel from Jeddah airport to Makkah and Madinah**, with professional drivers dedicated to hospitality and punctuality. Whether you are traveling solo, with family, or in large groups, Al Aqsa Umrah Transport offers **customized packages** to meet your needs.")}</p>
                    </div>

                    <div className={styles.grid}>
                        <div className={styles.whyChooseUs}>
                            <h3 className={styles.subheading}>Why Choose Us?</h3>
                            <ul className={styles.list}>
                                {whyChooseUsItems.map((item, index) => (
                                    <li key={index} className={styles.listItem}>
                                        <CheckCircle2 className={styles.checkIcon} size={20} />
                                        <span>{parseMarkdown(item)}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className={styles.spiritual}>
                            <div className={styles.quoteBox}>
                                <Quote className={styles.quoteIcon} size={40} />
                                <blockquote className={styles.quote}>
                                    “And proclaim to the people the Hajj; they will come to you on foot and on every lean camel; they will come from every distant pass.” – Qur’an (22:27)
                                </blockquote>
                            </div>
                            <p className={styles.conclusion}>
                                {parseMarkdown("At Al Aqsa Umrah Transport, we believe that every journey to the holy cities should be filled with peace, comfort, and trust. That’s why we are committed to being the **leading Umrah transport company in Saudi Arabia**.")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
