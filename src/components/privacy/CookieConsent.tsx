'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import styles from './CookieConsent.module.css';

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
    }
}

export default function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    const updateConsent = (granted: boolean) => {
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('consent', 'update', {
                'ad_storage': granted ? 'granted' : 'denied',
                'ad_user_data': granted ? 'granted' : 'denied',
                'ad_personalization': granted ? 'granted' : 'denied',
                'analytics_storage': granted ? 'granted' : 'denied'
            });
        }
    };

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie_consent');

        if (consent) {
            // Apply existing preference
            if (consent === 'accepted') {
                updateConsent(true);
            } else if (consent === 'rejected') {
                updateConsent(false);
            }
        } else {
            // Function to show banner
            const showBanner = () => setIsVisible(true);

            window.addEventListener('preloader-complete', showBanner);

            // Fallback
            const fallbackTimer = setTimeout(showBanner, 2500);

            return () => {
                window.removeEventListener('preloader-complete', showBanner);
                clearTimeout(fallbackTimer);
            };
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('cookie_consent', 'accepted');
        updateConsent(true);
        setIsVisible(false);
    };

    const handleReject = () => {
        localStorage.setItem('cookie_consent', 'rejected');
        updateConsent(false);
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
                                <h3 className="flex items-center gap-2">
                                    Your Privacy Matters
                                    <span className="text-amber-500 font-arabic text-sm opacity-80">| خصوصيتك تهمنا</span>
                                </h3>
                                <p>
                                    We use cookies to enhance your experience, provide secure booking, and deliver personalized pilgrim services.
                                    <span className="block font-arabic text-xs mt-1 opacity-70">نستخدم ملفات تعريف الارتباط لتحسين تجربتك وضمان حجز آمن لضيوف الرحمن.</span>
                                </p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <button onClick={handleAccept} className={styles.btnAccept}>
                                Accept All <span className="font-arabic text-xs ml-1">موافق</span>
                            </button>
                            <button onClick={handleReject} className={styles.btnReject}>
                                Reject <span className="font-arabic text-xs ml-1">رفض</span>
                            </button>
                            <Link href="/cookie-preferences" className={styles.linkManage}>
                                Preferences <span className="font-arabic text-xs ml-1">إعدادات</span>
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
