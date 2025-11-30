'use client';

import { useLanguage } from '@/context/LanguageContext';
import styles from './Leadership.module.css';
import { Quote, Linkedin, Twitter, Mail } from 'lucide-react';
import Image from 'next/image';

export default function Leadership() {
    const { t } = useLanguage();

    const team = [
        {
            id: 1,
            name: t('about.team.driver'),
            role: "Senior Chauffeur",
            image: "/images/team/team-1.jpg",
            socials: { linkedin: "#", twitter: "#", email: "#" }
        },
        {
            id: 2,
            name: t('about.team.support'),
            role: "Customer Care Lead",
            image: "/images/team/team-2.jpg",
            socials: { linkedin: "#", twitter: "#", email: "#" }
        },
        {
            id: 3,
            name: "Mohammed Ali",
            role: "Logistics Manager",
            image: "/images/team/team-3.jpg",
            socials: { linkedin: "#", twitter: "#", email: "#" }
        }
    ];

    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <h2 className={styles.title}>{t('about.team.title')}</h2>
                    <p className={styles.subtitle}>
                        {t('about.team.subtitle')}
                    </p>
                </div>

                <div className={styles.grid}>
                    {team.map((member) => (
                        <div key={member.id} className={styles.card}>
                            <div className={styles.imageWrapper}>
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className={styles.image}
                                />
                            </div>
                            <div className={styles.content}>
                                <h3 className={styles.name}>{member.name}</h3>
                                <p className={styles.role}>{member.role}</p>

                                <div className={styles.socials}>
                                    <a href={member.socials.linkedin} className="text-gray-400 hover:text-[#daa520] transition-colors">
                                        <Linkedin size={20} />
                                    </a>
                                    <a href={member.socials.twitter} className="text-gray-400 hover:text-[#daa520] transition-colors">
                                        <Twitter size={20} />
                                    </a>
                                    <a href={member.socials.email} className="text-gray-400 hover:text-[#daa520] transition-colors">
                                        <Mail size={20} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
