'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import styles from './CookieConsent.module.css';

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');

        if (!consent) {
            // Function to show banner
            const showBanner = () => setIsVisible(true);

            // Check if preloader has already finished (we assume if it's been > 2.5s since load, it's done)
            // But safer to just listen or use a small timeout if event missed?
            // Actually, since they mount together, the event will fire after mount.

            window.addEventListener('preloader-complete', showBanner);

            // Fallback: If for some reason event doesn't fire (e.g. preloader disabled/removed), show after 3s
            const fallbackTimer = setTimeout(showBanner, 2500);

            return () => {
                window.removeEventListener('preloader-complete', showBanner);
                clearTimeout(fallbackTimer);
            };
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookie_consent', 'rejected');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                        mass: 1
                    }}
                    className={styles.banner}
                >
                    <div className={styles.glow} />

                    <div className={styles.content}>
                        <div className={styles.textSection}>
                            <div className={styles.iconWrapper}>
                                <ShieldCheck size={28} />
                            </div>
                            <div className={styles.textContent}>
                                <h3>Your Privacy Matters</h3>
                                <p>
                                    We use cookies to enhance your experience, provide secure booking, and deliver personalized pilgrim services.
                                    You can accept all, reject non-essential, or manage your preferences.
                                </p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleAccept} className={styles.btnAccept}>
                                Accept All
                            </button>
                            <button onClick={handleReject} className={styles.btnReject}>
                                Reject Non-Essential
                            </button>
                            <Link href="/cookie-preferences" className={styles.linkManage}>
                                Manage Preferences
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
