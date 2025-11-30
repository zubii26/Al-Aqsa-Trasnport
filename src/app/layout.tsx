import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri, Noto_Nastaliq_Urdu, Playfair_Display, Open_Sans } from "next/font/google";

import "react-datepicker/dist/react-datepicker.css";
import "@/styles/datepicker.css";
import "./globals.css";
import { LanguageProvider } from "@/context/LanguageContext";
import { getSettings } from "@/lib/settings-storage";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "600"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
});

const notoNastaliq = Noto_Nastaliq_Urdu({
  variable: "--font-noto-nastaliq",
  subsets: ["arabic"],
  weight: "400",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();

  return {
    title: {
      default: settings.seo.defaultTitle,
      template: `%s | ${settings.general.siteName}`
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
      url: "https://alaqsa-transport.com",
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
      apple: '/logo.png',
    },
  };
}

import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/common/WhatsAppButton";
import ScrollToTop from "@/components/common/ScrollToTop";
import AIChatBox from "@/components/home/AIChatBox";
import { MenuProvider } from "@/context/MenuContext";

import { ThemeProvider } from "@/components/providers/ThemeProvider";

import Preloader from "@/components/common/Preloader";
import AdminSessionGuard from "@/components/admin/AdminSessionGuard";
import CookieConsent from "@/components/privacy/CookieConsent";
import { PricingProvider } from '@/context/PricingContext';
import { SettingsProvider } from '@/context/SettingsContext';
import ClientLayoutWrapper from "@/components/layout/ClientLayoutWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} ${notoNastaliq.variable} ${playfair.variable} ${openSans.variable}`}>
        <LanguageProvider>
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
                  <ClientLayoutWrapper>
                    <TopBar />
                    <Navbar />
                  </ClientLayoutWrapper>
                  <main style={{ minHeight: 'calc(100vh - 80px - 300px)' }}>
                    {children}
                  </main>
                  <ClientLayoutWrapper>
                    <Footer />
                    <WhatsAppButton />
                    <ScrollToTop />
                    <AIChatBox />
                    <CookieConsent />
                  </ClientLayoutWrapper>
                  <AdminSessionGuard />
                </PricingProvider>
              </ThemeProvider>
            </SettingsProvider>
          </MenuProvider>
        </LanguageProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "TravelAgency",
              "name": "Al Aqsa Umrah Transport", // This should ideally be dynamic too, but requires async component or passing props
              "image": "https://alaqsa-transport.com/logo.png",
              "@id": "https://alaqsa-transport.com",
              "url": "https://alaqsa-transport.com",
              "telephone": "+966500000000",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Al Aziziyah",
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
