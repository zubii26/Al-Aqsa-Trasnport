import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQSection.module.css';
import FadeIn from '@/components/common/FadeIn';

const faqs = [
    {
        question: "How to book a taxi for Umrah in Saudi Arabia?",
        answer: "Booking is simple with Al Aqsa Umrah Transport. You can book online through our website for instant confirmation. We offer reliable Umrah Taxi Services from Jeddah Airport, Makkah, and Madinah with 24/7 support."
    },
    {
        question: "What is the best way to travel from Jeddah to Makkah?",
        answer: "The best way is to book a private Airport to Haram Taxi. It offers the most comfort and convenience, especially after a long flight. Our Jeddah Airport to Makkah transfers ensure you reach your hotel or the Haram directly without the hassle of waiting."
    },
    {
        question: "What is the cost of a taxi from Makkah to Madinah?",
        answer: "Fares depend on the vehicle choice. A standard sedan for a Makkah to Madinah Taxi typically starts around 350-400 SAR. For larger groups, a Family Umrah Taxi (like a Hiace) or a VIP GMC Yukon will have different rates. Check our calculator for real-time prices."
    },
    {
        question: "Private vs shared transport for Umrah: Which is better?",
        answer: "Private Umrah Transport is generally recommended for peace of mind, privacy, and flexibility. Unlike shared buses, a private car allows you to travel on your own schedule, making it ideal for families and elderly pilgrims."
    },
    {
        question: "How can I find a trustworthy taxi service in Makkah?",
        answer: "Look for licensed providers like Al Aqsa Umrah Transport. We are a registered Umrah Transport Company with professional, English-speaking drivers and a track record of safety and reliability. Always avoid unregistered street taxis."
    },
    {
        question: "Do you offer Ziyarat tours in Makkah and Madinah?",
        answer: "Yes, we provide comprehensive Ziyarat packages. Our knowledgeable drivers can take you to all significant historical and spiritual sites in both holy cities, allowing you to pay your respects comfortably."
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
