import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Cookie Preferences | Al Aqsa Umrah Transport',
    description: 'Manage your cookie settings and privacy preferences for Al Aqsa Umrah Transport.',
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/cookie-preferences',
    },
};

export default function CookiePreferencesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
