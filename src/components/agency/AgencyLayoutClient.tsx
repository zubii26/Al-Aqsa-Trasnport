'use client';

import { usePathname } from 'next/navigation';
import AgencyBottomNav from '@/components/agency/AgencyBottomNav';
import PWAInit from '@/components/driver/PWAInit';
import AgencySidebar from '@/components/agency/AgencySidebar';
import { usePushSubscription } from '@/hooks/usePushSubscription';

export default function AgencyLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/agency/login';

    // Automatically manage push subscription
    usePushSubscription();

    return (
        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
            {/* PWA Service Worker Registration - Keep active for login to allow install */}
            <PWAInit serviceWorkerUrl="/agency-sw.js" scope="/agency/" />

            {/* Desktop Sidebar - Hide on Login */}
            {!isLoginPage && <AgencySidebar />}

            {/* Main Content */}
            <main className={`min-h-screen ${!isLoginPage ? 'lg:pl-64' : ''}`}>
                {children}
            </main>

            {/* Mobile Bottom Navigation - Hide on Login */}
            {!isLoginPage && <AgencyBottomNav />}
        </div>
    );
}
