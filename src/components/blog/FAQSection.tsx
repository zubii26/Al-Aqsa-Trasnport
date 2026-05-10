'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQSection.module.css';
import FadeIn from '@/components/common/FadeIn';

import { blogFaqs as faqs } from '@/data/blog-faqs';

export default function FAQSection() {
    const [activeAccordion, setActiveAccordion] = useState<number | null>(null);

    const toggleAccordion = (index: number) => {
        setActiveAccordion(activeAccordion === index ? null : index);
    };

    return (
        <section className={styles.section}>
            <div className="container">
                <FadeIn>
                    <h2 className={styles.sectionTitle}>Frequently Asked Questions</h2>
                </FadeIn>
                <div className={styles.faqContainer}>
                    {faqs.map((faq, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className={`${styles.faqItem} ${activeAccordion === index ? styles.active : ''}`}>
                                <button
                                    className={styles.faqQuestion}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {faq.question}
                                    <ChevronDown className={styles.faqIcon} size={20} />
                                </button>
                                <div className={styles.faqAnswer}>
                                    <p style={{ paddingTop: '1rem' }}>{faq.answer}</p>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
