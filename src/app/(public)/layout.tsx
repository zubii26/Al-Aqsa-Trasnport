
import type { Metadata, Viewport } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBar from "@/components/layout/TopBar";
import AnnouncementBanner from "@/components/ui/AnnouncementBanner";
import GlobalClientComponents from "@/components/common/GlobalClientComponents";
import { getSettings } from "@/lib/settings-storage";
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import UmrahPWA from "@/components/common/UmrahPWA";

export const viewport: Viewport = {
    themeColor: '#D4AF37', // Gold theme
    width: 'device-width',
    initialScale: 1,
    // NOTE: maximumScale / userScalable intentionally omitted.
    // Setting maximumScale=1 / user-scalable=no triggers Google's mobile
    // usability penalty and is an accessibility violation (WCAG 1.4.4).
};

export const metadata: Metadata = {
    manifest: '/manifest.json',
    title: {
        default: "Nusuk Registered Umrah Transport Services | Jeddah to Makkah Taxi",
        template: `%s | Al Aqsa Umrah Transport`
    },
    appleWebApp: {
        capable: true,
        title: 'Al Aqsa Umrah',
        statusBarStyle: 'default',
    },
    other: {
        'mobile-web-app-capable': 'yes',
    }
};

export default async function UmrahLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const settings = await getSettings();

    return (
        // Layout wrapper
        <>
            <ClientLayoutWrapper>
                <UmrahPWA />
                <AnnouncementBanner discount={settings.discount || { enabled: false, type: 'percentage', value: 0 }} />
                <TopBar />
                <Navbar />
            </ClientLayoutWrapper>

            <main className="min-h-[calc(100dvh-80px)] relative overflow-x-hidden w-full">
                {children}
            </main>

            <ClientLayoutWrapper>
                <Footer />
                <GlobalClientComponents contactSettings={settings.contact} />
            </ClientLayoutWrapper>
        </>
    );
}
