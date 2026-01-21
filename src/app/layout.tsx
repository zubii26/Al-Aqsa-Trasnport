import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Open_Sans, Reem_Kufi } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MenuProvider } from "@/context/MenuContext";
import { PricingProvider } from '@/context/PricingContext';
import { SettingsProvider } from '@/context/SettingsContext';
import Preloader from "@/components/common/Preloader";
import NextTopLoader from 'nextjs-toploader';
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getSettings } from "@/lib/settings-storage";
import "./globals.css";


const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
  display: 'swap',
  preload: true,
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: 'swap',
});

const reemKufi = Reem_Kufi({
  variable: "--font-reem-kufi",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#D4AF37',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.general.siteName || "Al Aqsa Umrah Transport";

  return {
    metadataBase: new URL('https://alaqsaumrahtransport.com'),
    title: {
      default: settings.seo.defaultTitle || "Umrah Transport Services Saudi Arabia",
      template: `%s | ${siteName}`
    },
    description: "Book trusted Umrah transport services in Saudi Arabia. Ramadan 2026 bookings open. Private GMC Yukon & luxury taxi transfers from Jeddah Airport to Makkah & Madinah.",
    // Global Manifest (Optional, or handled by sub-layouts)
    // We remove the global manifest link to enforce sub-route manifests
    // manifest: '/manifest.json', 
    icons: {
      icon: [
        { url: '/favicon.png', sizes: '32x32' },
      ],
      shortcut: '/favicon.png',
      apple: '/apple-touch-icon.png',
    },
    verification: {
      google: '0JYg8N3CPUFhzseUIrbhKiLIShx1ltrIF0XoXVsO7-I',
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${interMono.variable} ${playfair.variable} ${openSans.variable} ${reemKufi.variable}`}>
        {settings.general.googleAnalyticsId && (
          <GoogleAnalytics gaId={settings.general.googleAnalyticsId} />
        )}
        <MenuProvider>
          <SettingsProvider initialSettings={settings}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <PricingProvider>
                <Preloader />
                <NextTopLoader
                  color="#D4AF37"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={4}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 15px #D4AF37,0 0 5px #D4AF37"
                />

                {/* Main Content Area - Layouts downstream will inject Nav/Footer */}
                {children}

                {/* Admin Session Guard - keep global for admin routes */}
                {/* <AdminSessionGuard />  Moved to specific layouts if needed or kept here if it only triggers on /admin */}

              </PricingProvider>
            </ThemeProvider>
          </SettingsProvider>
        </MenuProvider>

        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
