'use client';

import { useEffect, useState } from 'react';

import Image from 'next/image';
import styles from './Preloader.module.css';

export default function LoadingScreen() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return (
        <div className={styles.preloader} style={{ zIndex: 999999 }}>
            <div className={styles.particles}>
                {[...Array(15)].map((_, i) => (
                    <div key={i} className={styles.particle} style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`
                    }} />
                ))}
            </div>
            <div className={styles.content}>
                <div className={styles.logoWrapper}>
                    <div className={styles.ringOuter}></div>
                    <div className={styles.ringInner}></div>
                    <div className={styles.glow}></div>
                    <div className={styles.logoImage}>
                        <Image
                            src="/logo.png"
                            alt="Al Aqsa Transport"
                            fill
                            className="object-contain"
                            priority
                            sizes="140px"
                        />
                    </div>
                </div>
                <div className={styles.textWrapper}>
                    <h1 className="text-2xl font-bold text-slate-100 font-playfair tracking-wider mt-4">Al Aqsa Transport</h1>
                    <p className="text-sm text-slate-400 font-medium uppercase tracking-[0.2em]">Premium Journey</p>
                </div>
            </div>
        </div>
    );
}
