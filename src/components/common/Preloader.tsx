'use client';

import { useEffect, useState } from 'react';
import styles from './Preloader.module.css';
import Image from 'next/image';
import AnimatedCar from './AnimatedCar';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        console.log('[Preloader] Mounting...');
        // Check if preloader has already been shown in this session
        const hasShown = sessionStorage.getItem('preloader_shown');
        if (hasShown) {
            console.log('[Preloader] Already shown, skipping...');
            setIsLoading(false);
            return;
        }

        const handleLoad = () => {
            console.log('[Preloader] handleLoad triggered, setting progress to 100');
            setProgress(100);
            // Short timeout to allow the browser to paint the 100% state briefly if needed, 
            // but effectively we want to go away fast.
            setTimeout(() => {
                console.log('[Preloader] Setting isLoading to false');
                setIsLoading(false);
                sessionStorage.setItem('preloader_shown', 'true');
                window.dispatchEvent(new Event('preloader-complete'));
            }, 200);
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        // reduced safety timeout
        const safetyTimeout = setTimeout(() => {
            if (isLoading) {
                console.warn('[Preloader] Safety timeout triggered');
                handleLoad();
            }
        }, 2000);

        return () => {
            window.removeEventListener('load', handleLoad);
            clearTimeout(safetyTimeout);
        };
    }, []);

    if (!isLoading) return null;

    return (
        <div className={`${styles.preloader} ${!isLoading ? styles.hidden : ''}`}>
            <div className={styles.content}>

                <div className={styles.logoWrapper}>
                    <div className={styles.ringOuter} />
                    <div className={styles.ringInner} />
                    <div className={styles.glow} />

                    {/* Using Next Image for priority loading */}
                    <div className={styles.logoImage}>
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa Umrah Transport"
                            width={110}
                            height={110}
                            priority
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>

                <div className={styles.textWrapper}>
                    <p className={styles.tagline}>Journey with comfort and trust...</p>

                    <div className={styles.progressContainer}>
                        <div
                            className={styles.progressBar}
                            style={{ width: `${Math.min(progress, 100)}%` }}
                        />
                    </div>
                    {/* <p className={styles.percentage}>{Math.round(progress)}%</p> */}
                </div>
            </div>
        </div>
    );
}
