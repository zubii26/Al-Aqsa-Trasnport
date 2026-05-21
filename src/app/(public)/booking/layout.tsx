import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Book VIP Umrah Transport | Makkah & Madinah Ride',
    description: 'Secure your premium vehicle for your blessed journey. Standard and custom Umrah transport booking for Makkah, Madinah, and Jeddah airport pickups.',
    alternates: {
        canonical: 'https://www.alaqsaumrahtransport.com/booking',
    },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
