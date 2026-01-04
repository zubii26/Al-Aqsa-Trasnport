'use client';

import Link from 'next/link';
import Image from 'next/image';
import styles from './Footer.module.css';
import { Mail, MapPin, Phone, Facebook, Instagram, Twitter, Linkedin, Send } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import GlassButton from '@/components/ui/GlassButton';

export default function Footer() {
    const { settings } = useSettings();

    if (!settings) return null;

    const { contact, general } = settings;



    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.grid}>
                    {/* Brand Identity & Contact */}
                    <div className={styles.column}>
                        <div className={styles.brand}>
                            <Link href="/umrah/" className={styles.logoLink}>
                                <Image
                                    src="/logo.png"
                                    alt={general.siteName}
                                    width={90}
                                    height={90}
                                    className={styles.logoImage}
                                    style={{ objectFit: 'contain' }}
                                />
                                <div className={styles.logoText}>
                                    <span className={styles.brandName}>Al Aqsa</span>
                                    <span className={styles.brandType}>Transport</span>
                                    <span className={styles.brandNameArabic}>الأقصى لنقل المعتمرين</span>
                                </div>
                            </Link>
                            <p className={styles.tagline}>{general.description}</p>
                        </div>

                        <div className={styles.socials}>
                            {contact.social.facebook && <a href={contact.social.facebook} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Facebook"><Facebook size={20} /></a>}
                            {contact.social.instagram && <a href={contact.social.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Instagram"><Instagram size={20} /></a>}
                            {contact.social.twitter && <a href={contact.social.twitter} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="Twitter"><Twitter size={20} /></a>}
                            {contact.social.linkedin && <a href={contact.social.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="LinkedIn"><Linkedin size={20} /></a>}
                            {contact.social.tiktok && (
                                <a href={contact.social.tiktok} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="TikTok">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" /></svg>
                                </a>
                            )}
                        </div>

                        <div className={styles.contactInfo}>
                            {contact.address && (
                                <a href="https://www.google.com/maps?cid=13304906274217460428" target="_blank" rel="noopener noreferrer" className={styles.contactItem}>
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

                    {/* Company Links */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Company</h3>
                        <ul className={styles.links}>
                            <li><Link href="/umrah/">Home</Link></li>
                            <li><Link href="/umrah/about">About Us</Link></li>
                            <li><Link href="/umrah/blog">Blog & Updates</Link></li>
                            <li><Link href="/umrah/safety">Safety Guide</Link></li>
                            <li><Link href="/umrah/track-booking">Track Booking</Link></li>
                            <li><Link href="/umrah/contact">Contact Support</Link></li>
                            <li><Link href="/umrah/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Services</h3>
                        <ul className={styles.links}>
                            <li><Link href="/umrah/services/jeddah-airport-transfer">Jeddah Airport Transfer</Link></li>
                            <li><Link href="/umrah/services/makkah-madinah-taxi">Makkah ⇄ Madinah Taxi</Link></li>
                            <li><Link href="/umrah/services/madinah-airport-transfer">Madinah Airport Transfer</Link></li>
                            <li><Link href="/umrah/services/ziyarat-tours">Ziyarat Tours</Link></li>
                            <li><Link href="/umrah/services/airport-transfers">Airport Transfers</Link></li>
                            <li><Link href="/umrah/services/intercity-transfer">Intercity Transfer</Link></li>
                        </ul>
                    </div>

                    {/* Fleet & Newsletter */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Our Fleet</h3>
                        <ul className={styles.links}>
                            <li><Link href="/umrah/fleet/gmc-yukon-at4">GMC Yukon XL (VIP)</Link></li>
                            <li><Link href="/umrah/fleet/toyota-camry">Toyota Camry</Link></li>
                            <li><Link href="/umrah/fleet/hyundai-staria">Hyundai Staria</Link></li>
                            <li><Link href="/umrah/fleet/hyundai-starex">Hyundai Starex</Link></li>
                            <li><Link href="/umrah/fleet/toyota-hiace">Toyota Hiace</Link></li>
                        </ul>

                        <div className={styles.newsletter}>
                            <h4>Newsletter</h4>
                            <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                                <input type="email" placeholder="Email" className={styles.input} />
                                <button type="submit" className={styles.submitBtn} aria-label="Subscribe">
                                    <Send size={16} />
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
                        <Link href="/umrah/privacy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/umrah/terms">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
