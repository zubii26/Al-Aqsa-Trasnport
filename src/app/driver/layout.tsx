import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Driver Portal - Al Aqsa Transport',
    description: 'Driver Dashboard and Job Management',
    manifest: '/driver-manifest.json', // This tells Next.js/Browser to use the driver specific manifest
};

import PWAInit from '@/components/driver/PWAInit';
import InstallPrompt from '@/components/driver/InstallPrompt';

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <PWAInit />
            <InstallPrompt />
            {children}
        </>
    );
}
