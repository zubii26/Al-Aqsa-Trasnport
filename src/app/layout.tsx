import type { Metadata, Viewport } from "next";
// Force reload - Backend verified
import { Inter, Playfair_Display, Open_Sans, Reem_Kufi } from "next/font/google";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
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

  const OPTIMIZED_DESCRIPTION = "Book top-rated Umrah transport services in Saudi Arabia. Reliable Jeddah airport transfers, VIP Makkah to Madinah taxi, and luxury GMC/Starex fleet. Trusted by thousands of pilgrims for safety and comfort.";
  const OPTIMIZED_KEYWORDS = [
    "Umrah transport services",
    "Makkah to Madinah taxi fare",
    "Jeddah airport to Makkah taxi",
    "VIP Umrah transport Saudi Arabia",
    "GMC Yukon Umrah booking",
    "Madinah airport to Masjid Nabawi",
    "Luxury Pilgrim Transport",
    "Umrah taxi service",
    "Haramain train alternative",
    "Ziyarat transport Makkah"
  ];

  const siteName = settings.general.siteName || "Al Aqsa Umrah Transport";
  // Combine settings keywords with optimized ones, removing duplicates
  const settingsKeywords = settings.seo.keywords ? settings.seo.keywords.split(',').map(k => k.trim()) : [];
  const ARABIC_KEYWORDS = [
    "نقل معتمرين",
    "تاكسي مكة",
    "توصيل من مطار جدة الى مكة",
    "شركة نقل عمرة",
    "سيارات جمس للعمرة",
    "رحلات زيارة المدينة",
    "مواصلات الحرمين",
    "حجز تاكسي جدة"
  ];
  const allKeywords = Array.from(new Set([...OPTIMIZED_KEYWORDS, ...settingsKeywords, ...ARABIC_KEYWORDS]));

  return {
    metadataBase: new URL('https://alaqsa-transport.com'),
    title: {
      default: settings.seo.defaultTitle || "Umrah Transport Services Saudi Arabia | Jeddah to Makkah Taxi",
      template: `%s | ${siteName}`
    },
    alternates: {
      canonical: 'https://alaqsa-transport.com',
    },
    manifest: '/manifest.json',
    description: settings.seo.defaultDescription || OPTIMIZED_DESCRIPTION,
    keywords: allKeywords,
    authors: [{ name: siteName }],
    creator: siteName,
    publisher: siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      title: settings.seo.defaultTitle || "Best Umrah Transport Services | Makkah to Madinah Taxi",
      description: settings.seo.defaultDescription || OPTIMIZED_DESCRIPTION,
      url: "https://alaqsa-transport.com",
      siteName: siteName,
      images: [
        {
          url: "/images/og-image.jpg",
          width: 1200,
          height: 630,
          alt: `${siteName} Luxury Fleet`,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: settings.seo.defaultTitle || "Reliable Umrah Transport | Al Aqsa",
      description: settings.seo.defaultDescription || OPTIMIZED_DESCRIPTION,
      images: ["/images/twitter-image.jpg"],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: siteName,
    },
    other: {
      'mobile-web-app-capable': 'yes',
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
      icon: [
        { url: '/favicon.png', sizes: '32x32' },
      ],
      shortcut: '/favicon.png',
      apple: '/apple-touch-icon.png',
      other: [
        {
          rel: 'apple-touch-icon-precomposed',
          url: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          url: '/android-chrome-192x192.png',
          sizes: '192x192',
        },
        {
          rel: 'icon',
          url: '/android-chrome-512x512.png',
          sizes: '512x512',
        },
      ],
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

      <body className={`${inter.variable} ${interMono.variable} ${playfair.variable} ${openSans.variable} ${reemKufi.variable}`}>
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
                  height={4}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 15px #D4AF37,0 0 5px #D4AF37"
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
                  <GlobalClientComponents contactSettings={settings.contact} />
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
              "logo": "https://alaqsa-transport.com/logo.png",
              "image": "https://alaqsa-transport.com/images/og-image.jpg",
              "@id": "https://alaqsa-transport.com",
              "url": "https://alaqsa-transport.com",
              "telephone": settings.contact.phone,
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": settings.contact.address || "Makkah AL Mukarramah",
                "addressLocality": "Makkah",
                "addressRegion": "Makkah Region",
                "postalCode": "24231",
                "addressCountry": "SA"
              },
              "areaServed": [
                { "@type": "City", "name": "Makkah" },
                { "@type": "City", "name": "Madinah" },
                { "@type": "City", "name": "Jeddah" },
                { "@type": "Country", "name": "Saudi Arabia" }
              ],
              "sameAs": [
                "https://facebook.com/alaqsaumrahtransport",
                "https://twitter.com/alaqsatransport",
                "https://instagram.com/alaqsaumrahtransport",
                "https://www.google.com/maps?cid=13304906274217460428"
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "5.0",
                "reviewCount": "153",
                "bestRating": "5",
                "worstRating": "1"
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
              },
              "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "Umrah Transport Services",
                "itemListElement": [
                  {
                    "@type": "Service",
                    "name": "Jeddah Airport to Makkah Taxi",
                    "description": "Private VIP transfer from Jeddah Airport to Makkah hotels."
                  },
                  {
                    "@type": "Service",
                    "name": "Makkah to Madinah Taxi",
                    "description": "Comfortable GMC Yukon and Staria dispatch for Ziyarat and intercity travel."
                  }
                ]
              }
            })
          }}
        />
        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
