import React from 'react';
import styles from './page.module.css';
import { Mail, MapPin, Phone, MessageCircle } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';
import ContactForm from '@/components/contact/ContactForm';
import Hero from '@/components/common/Hero';
import GlassCard from '@/components/ui/GlassCard';
import { getSettings } from '@/lib/settings-storage';

export async function generateMetadata() {
    return {
        title: "Contact Us | Book Umrah Taxi & Airport Transfer",
        description: "Contact Al Aqsa Transport for Umrah taxi bookings, Jeddah airport transfers, and inquiries. 24/7 support for pilgrims in Makkah and Madinah.",
        alternates: {
            canonical: 'https://alaqsa-transport.com/contact',
        },
    };
}

export default async function ContactPage() {
    const settings = await getSettings();

    // Fallback values if settings are not loaded yet
    const phone1 = settings?.contact.phone || '+966 50 000 0000';
    const email = settings?.contact.email || 'info@alaqsa-transport.com';
    const address = settings?.contact.address || 'Al Aziziyah, Makkah, Saudi Arabia';
    const whatsapp = phone1;

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
                        <GlassCard className={styles.formCard} delay={0}>
                            <h2 className={styles.formTitle}>Send us a Message</h2>
                            <p className={styles.formSubtitle}>
                                Have a question about our transport services? Fill out the form below and our team will get back to you within 24 hours.
                            </p>
                            <ContactForm />
                        </GlassCard>

                        {/* Contact Info */}
                        <GlassCard className={styles.infoCard} delay={0.2}>
                            <h2 className={styles.infoTitle}>Contact Information</h2>
                            <ul className={styles.infoList}>
                                <li className={styles.infoItem}>
                                    <Phone className={styles.infoIcon} size={24} />
                                    <div>
                                        <span className={styles.infoLabel}>Phone & WhatsApp</span>
                                        <p className={styles.infoText}>{phone1}</p>
                                        {settings?.contact.phone2 && (
                                            <p className={styles.infoText}>{settings.contact.phone2}</p>
                                        )}
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
                                        <p className={styles.infoText}>{email}</p>
                                    </div>
                                </li>
                                <li className={styles.infoItem}>
                                    <MapPin className={styles.infoIcon} size={24} />
                                    <div>
                                        <span className={styles.infoLabel}>Office Location</span>
                                        <p className={styles.infoText}>{address}</p>
                                    </div>
                                </li>
                            </ul>

                            <a
                                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
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
                        </GlassCard>
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
                        <GlassCard delay={0.1} className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>How do I book a ride?</h3>
                            <p className={styles.faqAnswer}>You can book directly through our website using the &quot;Book Now&quot; button, or contact us via WhatsApp for instant booking assistance.</p>
                        </GlassCard>
                        <GlassCard delay={0.2} className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>What payment methods do you accept?</h3>
                            <p className={styles.faqAnswer}>We accept cash payments upon arrival. For advance bookings, please contact our support team for available options.</p>
                        </GlassCard>
                        <GlassCard delay={0.3} className={styles.faqItem}>
                            <h3 className={styles.faqQuestion}>Are your drivers licensed?</h3>
                            <p className={styles.faqAnswer}>Yes, all our drivers are fully licensed, experienced, and trained to ensure your safety and comfort during your journey.</p>
                        </GlassCard>
                    </div>
                </div>
            </section>
        </div>
    );
}
