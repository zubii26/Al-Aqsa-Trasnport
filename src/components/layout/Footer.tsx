'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
    const { t, language, setLanguage } = useLanguage();
    const { settings } = useSettings();

    if (!settings) return null;

    const { contact, general } = settings;

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Identity */}
                    <div className={styles.column}>
                        <div className={styles.brand}>
                            <Link href="/" className={styles.logoLink}>
                                <Image
                                    src={general.logo || "/logo.png"}
                                    alt={general.siteName}
                                    width={70}
                                    height={70}
                                    className={styles.logoImage}
                                />
                                <div className={styles.logoTextContainer}>
                                    <h2 className={styles.logoText}>{general.siteName.split(' ')[0]} {general.siteName.split(' ')[1]}</h2>
                                    <span className={styles.logoSubText}>{general.siteName.split(' ').slice(2).join(' ')}</span>
                                </div>
                            </Link>
                            <p className={styles.tagline}>{general.description}</p>
                        </div>
                        <div className={styles.contactInfo}>
                            {contact.address && (
                                <a href={`https://maps.google.com/?q=${encodeURIComponent(contact.address)}`} target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
                                    <MapPin size={18} className={styles.icon} />
                                    <span>{contact.address}</span>
                                </a>
                            )}
                            {contact.phone && (
                                <a href={`tel:${contact.phone}`} className={styles.contactItem}>
                                    <Phone size={18} className={styles.icon} />
                                    <span>{contact.phone}</span>
                                </a>
                            )}
                            {contact.email && (
                                <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                                    <Mail size={18} className={styles.icon} />
                                    <span>{contact.email}</span>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>{t('footer.quickLinks')}</h3>
                        <ul className={styles.links}>
                            <li><Link href="/">{t('nav.home')}</Link></li>
                            <li><Link href="/about">{t('nav.about')}</Link></li>
                            <li><Link href="/services">{t('nav.services')}</Link></li>
                            <li><Link href="/fleet">{t('nav.fleet')}</Link></li>
                            <li><Link href="/blog">{t('nav.blog') || 'Blog'}</Link></li>
                            <li><Link href="/contact">{t('nav.contact')}</Link></li>
                            <li><Link href="/booking" className={styles.bookLink}>{t('nav.bookNow')}</Link></li>
                        </ul>
                    </div>

                    {/* Socials & Newsletter */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>{t('footer.connect')}</h3>
                        <div className={styles.socials}>
                            {contact.social.facebook && <a href={contact.social.facebook} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Facebook"><Facebook size={20} /></a>}
                            {contact.social.instagram && <a href={contact.social.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Instagram"><Instagram size={20} /></a>}
                            {contact.social.twitter && <a href={contact.social.twitter} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Twitter"><Twitter size={20} /></a>}
                            {contact.social.linkedin && <a href={contact.social.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="LinkedIn"><Linkedin size={20} /></a>}

                            {contact.social.tiktok && (
                                <a href={contact.social.tiktok} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="TikTok">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <div className={styles.newsletter}>
                            <h4>{t('footer.subscribe')}</h4>
                            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder={t('footer.enterEmail')} className={styles.input} />
                                <button type="submit" className={styles.submitBtn}>
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                <div className={styles.bottom}>
                    <div className={styles.copyright}>
                        {general.footerText}
                    </div>

                    <div className={styles.legalLinks}>
                        <Link href="/privacy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/terms">Terms & Conditions</Link>
                    </div>

                    <div className={styles.langContainer}>
                        <button onClick={() => setLanguage('en')} className={`${styles.langBtn} ${language === 'en' ? styles.activeLang : ''}`}>English</button>
                        <span className={styles.langSep}>/</span>
                        <button onClick={() => setLanguage('ar')} className={`${styles.langBtn} ${language === 'ar' ? styles.activeLang : ''}`}>العربية</button>
                        <span className={styles.langSep}>/</span>
                        <button onClick={() => setLanguage('ur')} className={`${styles.langBtn} ${language === 'ur' ? styles.activeLang : ''}`}>اردو</button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
