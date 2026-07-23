'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const ScrollToTop = dynamic(() => import('@/components/common/ScrollToTop'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/privacy/CookieConsent'), { ssr: false });
const PWAInstallPrompt = dynamic(() => import('@/components/common/PWAInstallPrompt'), { ssr: false });
const FloatingHelpBtn = dynamic(() => import('@/components/common/FloatingHelpBtn'), { ssr: false });

interface GlobalClientComponentsProps {
    contactSettings?: {
        phone: string;
        email: string;
    };
}

export default function GlobalClientComponents({ contactSettings }: GlobalClientComponentsProps) {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');
    
    // Defer non-critical components to improve Time to Interactive
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Wait for idle or at least a short delay before loading heavy client widgets
        const timer = setTimeout(() => {
            setMounted(true);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    if (isAdmin) {
        return null;
    }

    if (!mounted) return null;

    return (
        <>
            <ScrollToTop />
            <FloatingHelpBtn />
            <CookieConsent />
            <PWAInstallPrompt />
        </>
    );
}
