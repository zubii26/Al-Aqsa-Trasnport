import type { Metadata } from "next";
// Force reload - Backend verified
import { Inter, Playfair_Display, Open_Sans } from "next/font/google";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import "./globals.css";
import "./globals.css";
import { getSettings } from "@/lib/settings-storage";

const inter = Inter({
  variable: "--font-geist-sans", // Keeping variable name to avoid changing css
  subsets: ["latin"],
  display: 'swap',
});

const interMono = Inter({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: 'swap',
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: 'swap',
});



export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    metadataBase: new URL('https://alaqsaumrahtransport.com'),
    title: {
      default: settings.seo.defaultTitle,
      template: `%s | ${settings.general.siteName}`
    },
    alternates: {
      canonical: 'https://alaqsaumrahtransport.com',
    },
    description: settings.seo.defaultDescription,
    keywords: settings.seo.keywords.split(',').map(k => k.trim()),
    authors: [{ name: settings.general.siteName }],
    creator: settings.general.siteName,
    publisher: settings.general.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      url: "https://alaqsaumrahtransport.com",
      siteName: settings.general.siteName,
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${settings.general.siteName} Fleet`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.defaultTitle,
      description: settings.seo.defaultDescription,
      images: ["/images/twitter-image.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: '/favicon.png',
      shortcut: '/favicon.png',
      apple: '/logo.png',
      other: {
        rel: 'apple-touch-icon-precomposed',
        url: '/logo.png',
      },
    },
    verification: {
      google: '0JYg8N3CPUFhzseUIrbhKiLIShx1ltrIF0XoXVsO7-I',
    },
  };
}

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GlobalClientComponents from "@/components/common/GlobalClientComponents";
import { MenuProvider } from "@/context/MenuContext";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

import Preloader from "@/components/common/Preloader";
import AdminSessionGuard from "@/components/admin/AdminSessionGuard";

import { PricingProvider } from '@/context/PricingContext';
import { SettingsProvider } from '@/context/SettingsContext';
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";

import NextTopLoader from 'nextjs-toploader';

import AnnouncementBanner from "@/components/ui/AnnouncementBanner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  console.log('[RootLayout] Discount Settings:', settings.discount);
  return (
    <html lang="en" suppressHydrationWarning>

      <body className={`${inter.variable} ${interMono.variable} ${playfair.variable} ${openSans.variable}`}>
        {settings.general.googleAnalyticsId && (
          <GoogleAnalytics gaId={settings.general.googleAnalyticsId} />
        )}
        <MenuProvider>
          <SettingsProvider>
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
                  height={3}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 10px #D4AF37,0 0 5px #D4AF37"
                />
                <ClientLayoutWrapper>
                  <AnnouncementBanner discount={settings.discount || { enabled: false, type: 'percentage', value: 0 }} />
                  <TopBar />
                  <Navbar />
                </ClientLayoutWrapper>
                <main style={{ minHeight: 'calc(100vh - 80px - 300px)' }}>
                  {children}
                </main>
                <ClientLayoutWrapper>
                  <Footer />
                  <GlobalClientComponents />
                </ClientLayoutWrapper>
                <AdminSessionGuard />
              </PricingProvider>
            </ThemeProvider>
          </SettingsProvider>
        </MenuProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": settings.general.siteName,
              "description": settings.general.description,
              "image": "https://alaqsa-transport.com/logo.png",
              "@id": "https://alaqsa-transport.com",
              "url": "https://alaqsa-transport.com",
              "telephone": settings.contact.phone,
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": settings.contact.address,
                "addressLocality": "Makkah",
                "addressCountry": "SA"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": 21.4225,
                "longitude": 39.8262
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "00:00",
                "closes": "23:59"
              }
            })
          }}
        />
        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
