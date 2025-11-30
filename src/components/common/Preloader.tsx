'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';
import styles from './Preloader.module.css';

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleLoad = () => {
            const timer = setTimeout(() => {
                setIsLoading(false);
                window.dispatchEvent(new Event('preloader-complete'));
            }, 500); // Small buffer to ensure smooth transition
        };

        if (document.readyState === 'complete') {
            handleLoad();
        } else {
            window.addEventListener('load', handleLoad);
        }

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    if (!isLoading) return null;

    return <LoadingScreen />;
}
