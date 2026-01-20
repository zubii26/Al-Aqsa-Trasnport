'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';


const ScrollToTop = dynamic(() => import('@/components/common/ScrollToTop'), { ssr: false });
const AIChatBox = dynamic(() => import('@/components/home/AIChatBox'), { ssr: false });
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

    if (isAdmin) {
        return null;
    }

    return (
        <>

            <ScrollToTop />
            <AIChatBox
                contactPhone={contactSettings?.phone}
                contactEmail={contactSettings?.email}
            />
            <FloatingHelpBtn />
            <CookieConsent />
            <PWAInstallPrompt />
        </>
    );
}
