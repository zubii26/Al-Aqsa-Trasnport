'use client';

import React from 'react';
import styles from './Testimonials.module.css';
import { curatedTestimonials } from '@/data/testimonials';
import { Quote, Star } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function Testimonials() {
    return (
        <section className={styles.section}>
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className={styles.header}>
                        <h2 className={styles.title}>What Our Pilgrims Say</h2>
                        <p className={styles.subtitle}>
                            Real stories from brothers and sisters who trusted us with their journey of a lifetime.
                        </p>
                    </div>
                </FadeIn>

                <div className={styles.grid}>
                    {curatedTestimonials.map((testimonial, index) => (
                        <FadeIn key={testimonial.id} delay={index * 0.1}>
                            <div className={styles.card}>
                                <Quote className={styles.quoteIcon} size={32} />
                                <p className={styles.text}>"{testimonial.story}"</p>

                                <div className={styles.author}>
                                    <div className={styles.avatar}>
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div className={styles.info}>
                                        <div className={styles.name}>{testimonial.name}</div>
                                        <div className={styles.role}>{testimonial.origin} • {testimonial.trip}</div>
                                        <div className={styles.rating}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    className={styles.star}
                                                    fill={i < testimonial.rating ? "currentColor" : "none"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
