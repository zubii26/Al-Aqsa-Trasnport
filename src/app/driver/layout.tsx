import { Viewport, Metadata } from 'next';
import DriverLayoutClient from '@/components/driver/DriverLayoutClient';

export const viewport: Viewport = {
    themeColor: '#D4AF37', // Gold theme for branding
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false, // Prevent zooming effectively for app-like feel
};

// Metadata removed to inherit root layout PWA settings (or fall back to standard web behavior).
export const metadata: Metadata = {
    title: 'Al Aqsa Driver',
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
