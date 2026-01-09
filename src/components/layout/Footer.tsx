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
                            <Link href="/" className={styles.logoLink}>
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
                            <a
                                href={`https://wa.me/${(contact.phone || '').replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noreferrer"
                                className={`${styles.contactItem} ${styles.whatsappButton}`}
                                style={{ color: '#25D366', fontWeight: 'bold' }}
                            >
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                </svg>
                                <span>WhatsApp Us</span>
                            </a>
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
                            <li><Link href="/">Home</Link></li>
                            <li><Link href="/about">About Us</Link></li>
                            <li><Link href="/blog">Blog & Updates</Link></li>
                            <li><Link href="/safety">Safety Guide</Link></li>
                            <li><Link href="/track-booking">Track Booking</Link></li>
                            <li><Link href="/contact">Contact Support</Link></li>
                            <li><Link href="/privacy">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    {/* Services Links */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Services</h3>
                        <ul className={styles.links}>
                            <li><Link href="/services/jeddah-airport-transfer">Jeddah Airport Transfer</Link></li>
                            <li><Link href="/services/makkah-madinah-taxi">Makkah ⇄ Madinah Taxi</Link></li>
                            <li><Link href="/services/madinah-airport-transfer">Madinah Airport Transfer</Link></li>
                            <li><Link href="/services/ziyarat-tours">Ziyarat Tours</Link></li>
                            <li><Link href="/services/airport-transfers">Airport Transfers</Link></li>
                            <li><Link href="/services/intercity-transfer">Intercity Transfer</Link></li>
                        </ul>
                    </div>

                    {/* Fleet & Newsletter */}
                    <div className={styles.column}>
                        <h3 className={styles.heading}>Our Fleet</h3>
                        <ul className={styles.links}>
                            <li><Link href="/fleet/gmc-yukon-at4">GMC Yukon XL (VIP)</Link></li>
                            <li><Link href="/fleet/toyota-camry">Toyota Camry</Link></li>
                            <li><Link href="/fleet/hyundai-staria">Hyundai Staria</Link></li>
                            <li><Link href="/fleet/hyundai-starex">Hyundai Starex</Link></li>
                            <li><Link href="/fleet/toyota-hiace">Toyota Hiace</Link></li>
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
                        <Link href="/privacy">Privacy Policy</Link>
                        <span className={styles.separator}>|</span>
                        <Link href="/terms">Terms & Conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
