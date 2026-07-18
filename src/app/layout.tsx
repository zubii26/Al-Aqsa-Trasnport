import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display, Open_Sans, Reem_Kufi } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { MobileMenuProvider } from "@/context/MobileMenuContext";
import { PricingProvider } from '@/context/PricingContext';
import { SettingsProvider } from '@/context/SettingsContext';
// import Preloader from "@/components/common/Preloader"; 
// import NextTopLoader from 'nextjs-toploader';
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import { getSettings } from "@/lib/settings-storage";
import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import { PageTransition } from "@/components/providers/PageTransition";
import ScrollToTop from "@/components/common/ScrollToTop";
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
  // NOTE: maximumScale / userScalable intentionally omitted.
  // Setting maximumScale=1 / user-scalable=no triggers Google's mobile
  // usability penalty and is an accessibility violation (WCAG 1.4.4).
  themeColor: '#D4AF37',
};

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteName = settings.general.siteName || "Al Aqsa Umrah Transport";

  return {
    // metadataBase must use the canonical www origin so that all
    // auto-generated canonicals, OG URLs, and sitemap entries align
    // with the www redirect enforced in next.config.ts.
    metadataBase: new URL('https://www.alaqsaumrahtransport.com'),
    title: {
      default: "Umrah Taxi Service Saudi Arabia | Al Aqsa",
      template: "%s | Al Aqsa"
    },
    description: "Book trusted Umrah transport services in Saudi Arabia. Ramadan 2026 bookings open. Private GMC Yukon & luxury taxi transfers from Jeddah Airport to Makkah & Madinah.",
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
    twitter: {
      card: 'summary_large_image',
      title: settings.seo.defaultTitle || "Umrah Transport Services Saudi Arabia",
      description: "Book trusted Umrah transport services in Saudi Arabia. Ramadan 2026 bookings open. Private GMC Yukon & luxury taxi transfers from Jeddah Airport to Makkah & Madinah.",
      creator: '@alaqsatransport',
    },
    openGraph: {
      type: 'website',
      siteName: siteName,
      title: settings.seo.defaultTitle || "Umrah Transport Services Saudi Arabia",
      description: "Book trusted Umrah transport services in Saudi Arabia. Ramadan 2026 bookings open. Private GMC Yukon & luxury taxi transfers from Jeddah Airport to Makkah & Madinah.",
      url: 'https://www.alaqsaumrahtransport.com',
      images: [
        {
          url: '/images/routes/makkah-madinah-route-hero.webp',
          width: 1200,
          height: 630,
          alt: 'Al Aqsa Umrah Transport - Premium Makkah & Madinah Taxi',
        }
      ],
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
      <body className={`${inter.variable} ${interMono.variable} ${playfair.variable} ${openSans.variable} ${reemKufi.variable} font-sans antialiased overflow-x-hidden`}>
        {/* 
          CHUNK ERROR RECOVERY — runs BEFORE React boots.
          If a JS chunk fails to load (stale turbopack/webpack hash after deployment),
          this script catches the error at the window level and does a hard reload.
          Without this, the user sees a white screen because React can't even mount.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function() {
  var reloadKey = '__chunk_reload';
  var hasReloaded = sessionStorage.getItem(reloadKey);

  // Listen for chunk load errors (fires before React error boundary)
  window.addEventListener('error', function(e) {
    var msg = (e.message || '') + ' ' + ((e.filename) || '');
    if (
      msg.indexOf('Failed to load chunk') !== -1 ||
      msg.indexOf('Loading chunk') !== -1 ||
      msg.indexOf('ChunkLoadError') !== -1 ||
      (e.filename && e.filename.indexOf('/_next/static/chunks/') !== -1 && e.message && e.message.indexOf('module') !== -1)
    ) {
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
      }
    }
  });

  // Listen for unhandled promise rejections (dynamic import failures)
  window.addEventListener('unhandledrejection', function(e) {
    var reason = (e.reason && e.reason.message) || String(e.reason || '');
    if (
      reason.indexOf('Failed to load chunk') !== -1 ||
      reason.indexOf('Failed to fetch dynamically imported module') !== -1 ||
      reason.indexOf('Loading chunk') !== -1
    ) {
      if (!hasReloaded) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
      }
    }
  });

  // Listen for Service Worker chunk failure messages
  if (navigator.serviceWorker) {
    navigator.serviceWorker.addEventListener('message', function(e) {
      if (e.data && e.data.type === 'CHUNK_LOAD_FAILED' && !hasReloaded) {
        sessionStorage.setItem(reloadKey, '1');
        window.location.reload();
      }
    });
  }

  // Clear the reload flag after successful page load
  window.addEventListener('load', function() {
    sessionStorage.removeItem(reloadKey);
  });
})();
`
          }}
        />
        {settings.general.googleAnalyticsId && (
          <GoogleAnalytics gaId={settings.general.googleAnalyticsId} />
        )}

        <MobileMenuProvider>
          <SettingsProvider initialSettings={settings}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <PricingProvider>
                {/* 
                   DISABLED PRELOADER & TOPLOADER 
                   These often cause hydration mismatches or window-not-defined errors
                */}
                {/* <Preloader /> */}
                {/* <NextTopLoader
                  color="#D4AF37"
                  initialPosition={0.08}
                  crawlSpeed={200}
                  height={4}
                  crawl={true}
                  showSpinner={false}
                  easing="ease"
                  speed={200}
                  shadow="0 0 15px #D4AF37,0 0 5px #D4AF37"
                /> */}

                <SmoothScrollProvider>
                  <ScrollToTop />
                  <PageTransition>
                    {children}
                  </PageTransition>
                </SmoothScrollProvider>

              </PricingProvider>
            </ThemeProvider>
          </SettingsProvider>
        </MobileMenuProvider>

        <div id="datepicker-portal" />
      </body>
    </html>
  );
}
