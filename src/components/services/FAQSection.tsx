'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQSection.module.css';
import FadeIn from '@/components/common/FadeIn';

const faqs = [
    {
        question: "How do I book a ride?",
        answer: "You can book directly through our website by selecting your service type, vehicle, and dates. Alternatively, you can contact our 24/7 support team via WhatsApp for assistance."
    },
    {
        question: "Are your drivers licensed?",
        answer: "Yes, all our drivers are fully licensed, insured, and experienced in navigating the holy cities of Makkah and Madinah. They are also trained to assist pilgrims with their needs."
    },
    {
        question: "Can I change my booking?",
        answer: "Absolutely. We understand plans can change. You can modify your booking up to 24 hours before your scheduled pickup time without any extra charges."
    },
    {
        question: "Do you provide child seats?",
        answer: "Yes, child seats are available upon request. Please mention this requirement when making your booking so we can ensure the vehicle is properly equipped."
    }
];

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
                <div className={styles.container}>
                    {faqs.map((faq, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <div className={`${styles.item} ${activeAccordion === index ? styles.active : ''}`}>
                                <button
                                    className={styles.question}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    {faq.question}
                                    <ChevronDown className={styles.icon} size={20} />
                                </button>
                                <div className={styles.answer}>
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
