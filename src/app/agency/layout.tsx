import { Viewport, Metadata } from 'next';
import AgencyBottomNav from '@/components/agency/AgencyBottomNav';
import PWAInit from '@/components/driver/PWAInit';
import AgencySidebar from '@/components/agency/AgencySidebar';

export const viewport: Viewport = {
    themeColor: '#2563EB', // Blue for Agency (vs Amber for Public/Driver)
};

export const metadata: Metadata = {
    manifest: '/agency-manifest.json',
    title: 'Al Aqsa Agency Portal',
    appleWebApp: {
        capable: true,
        title: 'Al Aqsa Agency',
        statusBarStyle: 'default',
    },
};

export default function AgencyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 pb-20 lg:pb-0">
            {/* PWA Service Worker Registration */}
            <PWAInit />

            {/* Desktop Sidebar */}
            <AgencySidebar />

            {/* Main Content */}
            <main className="lg:pl-64 min-h-screen">
                {children}
            </main>

            {/* Mobile Bottom Navigation */}
            <AgencyBottomNav />
        </div>
    );
}
