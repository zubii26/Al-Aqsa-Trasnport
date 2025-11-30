import type { Metadata } from "next";
import styles from './page.module.css';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import ContactForm from '@/components/contact/ContactForm';

export const metadata: Metadata = {
    title: "Contact Us | Umrah Transport in Makkah & Madinah",
    description: "Contact Al Aqsa Umrah Transport for reliable pilgrim shuttle services in Saudi Arabia. Available 24/7 in Makkah and Madinah.",
    keywords: ["Umrah transport in Makkah", "Umrah transport in Madinah", "Pilgrim shuttle service Saudi Arabia"]
};

import Hero from '@/components/common/Hero';

export default function ContactPage() {
    return (
        <div>
            <Hero
                title="Umrah Transport in Makkah and Madinah"
                subtitle="Reliable pilgrim shuttle service Saudi Arabia. Reach out to our dedicated team for any assistance."
                bgImage="/images/contact-hero.jpg"
            />

            <section className={styles.section}>
                <div className="container">
                    <div className={styles.grid}>
                        {/* Contact Form */}
                        <div className={styles.formCard}>
                            <FadeIn direction="up">
                                <h2 className={styles.formTitle}>Send us a Message</h2>
                                <p className={styles.formSubtitle}>
                                    Have a question about our transport services? Fill out the form below and our team will get back to you within 24 hours.
                                </p>
                                <ContactForm />
                            </FadeIn>
                        </div>

                        {/* Contact Info */}
                        <div className={styles.infoCard}>
                            <FadeIn delay={0.2} direction="left">
                                <h2 className={styles.infoTitle}>Contact Information</h2>
                                <ul className={styles.infoList}>
                                    <li className={styles.infoItem}>
                                        <Phone className={styles.infoIcon} size={24} />
                                        <div>
                                            <span className={styles.infoLabel}>Phone & WhatsApp</span>
                                            <p className={styles.infoText}>+92 326 060 0676</p>
                                            <p className={styles.infoText}>+92 308 633 2603</p>
                                            <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                Available 24/7
                                            </p>
                                        </div>
                                    </li>
                                    <li className={styles.infoItem}>
                                        <Mail className={styles.infoIcon} size={24} />
                                        <div>
                                            <span className={styles.infoLabel}>Email</span>
                                            <p className={styles.infoText}>meharzubair703@gmail.com</p>
                                        </div>
                                    </li>
                                    <li className={styles.infoItem}>
                                        <MapPin className={styles.infoIcon} size={24} />
                                        <div>
                                            <span className={styles.infoLabel}>Office Location</span>
                                            <p className={styles.infoText}>Al Aziziyah, Makkah</p>
                                            <p className={styles.infoText}>Kingdom of Saudi Arabia</p>
                                        </div>
                                    </li>
                                </ul>

                                <a
                                    href="https://wa.me/923260600676"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-primary w-full flex items-center justify-center gap-2 mb-4"
                                >
                                    <MessageCircle size={20} />
                                    Chat on WhatsApp
                                </a>

                                <div className="text-center text-sm text-muted-foreground">
                                    Trusted by thousands of pilgrims for safe and reliable transport.
                                </div>

                                <div className={styles.mapPlaceholder}>
                                    <div className="text-center">
                                        <MapPin size={32} className="mx-auto mb-2 opacity-50" />
                                        <p>Interactive Map Coming Soon</p>
                                    </div>
                                </div>
                            </FadeIn>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className={styles.faqSection}>
                <div className="container">
                    <FadeIn direction="up">
                        <h2 className="text-3xl font-bold text-center mb-8 text-slate-900 dark:text-white">Frequently Asked Questions</h2>
                    </FadeIn>
                    <div className={styles.faqGrid}>
                        <FadeIn delay={0.1}>
                            <div className={styles.faqItem}>
                                <h3 className={styles.faqQuestion}>How do I book a ride?</h3>
                                <p className={styles.faqAnswer}>You can book directly through our website using the &quot;Book Now&quot; button, or contact us via WhatsApp for instant booking assistance.</p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.2}>
                            <div className={styles.faqItem}>
                                <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
                                <p className={styles.faqAnswer}>We accept cash payments upon arrival. For advance bookings, please contact our support team for available options.</p>
                            </div>
                        </FadeIn>
                        <FadeIn delay={0.3}>
                            <div className={styles.faqItem}>
                                <h3 className={styles.faqQuestion}>Are your drivers licensed?</h3>
                                <p className={styles.faqAnswer}>Yes, all our drivers are fully licensed, experienced, and trained to ensure your safety and comfort during your journey.</p>
                            </div>
                        </FadeIn>
                    </div>
                </div>
            </section>
        </div>
    );
}
