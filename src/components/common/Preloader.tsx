'use client';

import { useEffect, useState } from 'react';
import LoadingScreen from './LoadingScreen';


export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if preloader has already been shown in this session
        const hasShown = sessionStorage.getItem('preloader_shown');
        if (hasShown) {
            setIsLoading(false);
            return;
        }

        const handleLoad = () => {
            setTimeout(() => {
                setIsLoading(false);
                sessionStorage.setItem('preloader_shown', 'true');
                window.dispatchEvent(new Event('preloader-complete'));
            }, 500); // Reduced duration for better user experience
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
