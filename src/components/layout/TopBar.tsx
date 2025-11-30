import React from 'react';
import { Phone, Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import styles from './TopBar.module.css';
import { getSettings } from '@/lib/settings-storage';

const TopBar = async () => {
    const settings = await getSettings();
    const { contact } = settings;

    return (
        <div className={styles.topBar}>
            <div className={styles.container}>
                <div className={styles.contactInfo}>
                    {contact.email && (
                        <a href={`mailto:${contact.email}`} className={styles.contactItem}>
                            <Mail size={16} />
                            <span>{contact.email}</span>
                        </a>
                    )}
                    {contact.phone && (
                        <a href={`tel:${contact.phone}`} className={styles.contactItem}>
                            <Phone size={16} />
                            <span>{contact.phone}</span>
                        </a>
                    )}
                    {contact.whatsapp && (
                        <a href={`https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`} className={styles.contactItem}>
                            <Phone size={16} />
                            <span>{contact.whatsapp}</span>
                        </a>
                    )}
                </div>

                <div className={styles.socialLinks}>
                    {contact.social.facebook && <a href={contact.social.facebook} target="_blank" rel="noreferrer" className={styles.socialIcon}><Facebook size={16} /></a>}
                    {contact.social.instagram && <a href={contact.social.instagram} target="_blank" rel="noreferrer" className={styles.socialIcon}><Instagram size={16} /></a>}
                    {contact.social.twitter && <a href={contact.social.twitter} target="_blank" rel="noreferrer" className={styles.socialIcon}><Twitter size={16} /></a>}
                    {contact.social.linkedin && <a href={contact.social.linkedin} target="_blank" rel="noreferrer" className={styles.socialIcon}><Linkedin size={16} /></a>}

                    {/* TikTok Icon */}
                    {contact.social.tiktok && (
                        <a href={contact.social.tiktok} target="_blank" rel="noreferrer" className={styles.socialIcon} aria-label="TikTok">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
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
            </div>
        </div>
    );
};

export default TopBar;
