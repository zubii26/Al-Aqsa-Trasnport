import { Viewport, Metadata } from 'next';
import DriverLayoutClient from '@/components/driver/DriverLayoutClient';

export const viewport: Viewport = {
    themeColor: '#D4AF37', // Gold theme for branding
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zooming effectively for app-like feel
};

export const metadata: Metadata = {
    manifest: '/driver-manifest.json',
    title: 'Al Aqsa Driver',
    applicationName: 'Al Aqsa Driver',
    appleWebApp: {
        capable: true,
        title: 'Aqsa Driver',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    },
};

export default function DriverLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DriverLayoutClient>
            {children}
        </DriverLayoutClient>
    );
}
