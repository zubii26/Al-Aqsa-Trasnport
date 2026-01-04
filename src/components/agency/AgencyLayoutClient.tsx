'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import Image from 'next/image';
import PWAInit from '@/components/common/PWAInit';
import AgencySidebar from '@/components/agency/AgencySidebar';
import { usePushSubscription } from '@/hooks/usePushSubscription';

export default function AgencyLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/agency/login';
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Automatically manage push subscription
    usePushSubscription();

    return (
        <div className="min-h-screen bg-slate-50 pb-safe">
            {/* PWA Service Worker Registration - Keep active for login to allow install */}
            <PWAInit serviceWorkerUrl="/agency-sw.js" scope="/agency/" />

            {/* Mobile Header - Only visible on mobile & NOT on login */}
            {!isLoginPage && (
                <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30 shadow-sm">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="flex items-center gap-2">
                            <div className="relative w-6 h-6">
                                <Image src="/logo.png" alt="Logo" fill className="object-contain" />
                            </div>
                            <span className="font-bold text-slate-900">Al Aqsa</span>
                        </div>
                    </div>
                    {/* Placeholder for optional Right Action (Notification bell?) */}
                </div>
            )}

            {/* Sidebar (Desktop & Mobile Drawer) - Hide on Login */}
            {!isLoginPage && (
                <AgencySidebar
                    mobileOpen={isSidebarOpen}
                    setMobileOpen={setIsSidebarOpen}
                />
            )}

            {/* Main Content */}
            <main className={`min-h-screen ${!isLoginPage ? 'lg:pl-64' : ''}`}>
                {children}
            </main>
        </div>
    );
}
