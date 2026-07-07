import type { Metadata, Viewport } from "next";
import BookingFooter from "@/components/booking/BookingFooter";
import TopBar from "@/components/layout/TopBar";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import GlobalClientComponents from "@/components/common/GlobalClientComponents";
import { getSettings } from "@/lib/settings-storage";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import UmrahPWA from "@/components/common/UmrahPWA";

export const viewport: Viewport = {
    themeColor: '#D4AF37',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    manifest: '/manifest.json',
    title: {
        default: "Secure Booking | Al Aqsa Umrah Transport",
        template: `%s | Al Aqsa Umrah Transport`
    },
    appleWebApp: {
        capable: true,
        title: 'Al Aqsa Booking',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    }
};

export default async function BookingLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettings();

    return (
        <>
            <ClientLayoutWrapper>
                <UmrahPWA />
                <AnnouncementBanner discount={settings.discount || { enabled: false, type: 'percentage', value: 0 }} />
                <TopBar />
            </ClientLayoutWrapper>

            <main className="min-h-[calc(100dvh-80px)] bg-slate-50 relative overflow-x-clip w-full">
                {children}
            </main>

            <BookingFooter />
            <GlobalClientComponents contactSettings={settings.contact} />
        </>
    );
}
