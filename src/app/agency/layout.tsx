import { Viewport, Metadata } from 'next';
import AgencyLayoutClient from '@/components/agency/AgencyLayoutClient';

export const viewport: Viewport = {
    themeColor: '#2563EB', // Blue for Agency (vs Amber for Public/Driver)
};

export const metadata: Metadata = {
    manifest: '/agency-manifest.json?v=2',
    title: 'Al Aqsa Agency Portal',
    applicationName: 'Al Aqsa Agency',
    appleWebApp: {
        capable: true,
        title: 'Al Aqsa Agency',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    },
};

export default function AgencyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AgencyLayoutClient>
            {children}
        </AgencyLayoutClient>
    );
}
