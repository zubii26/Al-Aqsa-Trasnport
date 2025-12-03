'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const WhatsAppButton = dynamic(() => import('@/components/common/WhatsAppButton'), { ssr: false });
const ScrollToTop = dynamic(() => import('@/components/common/ScrollToTop'), { ssr: false });
const AIChatBox = dynamic(() => import('@/components/home/AIChatBox'), { ssr: false });
const CookieConsent = dynamic(() => import('@/components/privacy/CookieConsent'), { ssr: false });

export default function GlobalClientComponents() {
    const pathname = usePathname();
    const isAdmin = pathname?.startsWith('/admin');

    if (isAdmin) {
        return null;
    }

    return (
        <>
            <WhatsAppButton />
            <ScrollToTop />
            <AIChatBox />
            <CookieConsent />
        </>
    );
}
