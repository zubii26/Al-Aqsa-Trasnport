'use client';

import React from 'react';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import styles from './CustomerGallery.module.css';
import FadeIn from '@/components/common/FadeIn';

const memories = [
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&q=80&w=800',
        caption: 'Peaceful moments in Makkah',
        location: 'Makkah'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?auto=format&fit=crop&q=80&w=800',
        caption: 'Family arrival at Madinah',
        location: 'Madinah'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&q=80&w=800',
        caption: 'Comfortable journey',
        location: 'Jeddah - Makkah Highway'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800',
        caption: 'Group Ziyarat tour',
        location: 'Uhud Mountain'
    },
    {
        id: 5,
        image: 'https://images.unsplash.com/photo-1580418827493-f2b22c438544?auto=format&fit=crop&q=80&w=800',
        caption: 'Sunset at the Haram',
        location: 'Makkah'
    },
    {
        id: 6,
        image: 'https://images.unsplash.com/photo-1551041777-ed02bed7f0a6?auto=format&fit=crop&q=80&w=800',
        caption: 'Ready for departure',
        location: 'KAIA Airport'
    }
];

export default function CustomerGallery() {
    return (
        <section className={styles.section}>
            <div className="container">
                <div className={styles.header}>
                    <FadeIn>
                        <h2 className={styles.title}>Pilgrim Memories</h2>
                        <p className={styles.subtitle}>
                            Cherished moments from our happy customers during their spiritual journey.
                        </p>
                    </FadeIn>
                </div>

                <div className={styles.grid}>
                    {memories.map((item, index) => (
                        <FadeIn key={item.id} delay={index * 0.1}>
                            <div className={styles.card}>
                                <Image
                                    src={item.image}
                                    alt={item.caption}
                                    fill
                                    className={styles.image}
                                />
                                <div className={styles.overlay}>
                                    <h3 className={styles.caption}>{item.caption}</h3>
                                    <span className={styles.location}>
                                        <MapPin size={14} /> {item.location}
                                    </span>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
