import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    ignoreBuildErrors: true,
  },
  // @ts-ignore
  eslint: {
    ignoreDuringBuilds: true,
  },



  images: {
    formats: ['image/avif', 'image/webp'],
    // Optimization: Don't generate super large images for smaller devices
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Aggressive caching for optimized images (1 year)
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 's7g10.scene7.com',
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; img-src 'self' https: data: blob: https://*.basemaps.cartocdn.com https://*.tile.openstreetmap.org; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com https://router.project-osrm.org https://nominatim.openstreetmap.org https://*.basemaps.cartocdn.com; frame-src 'self' https://www.google.com; block-all-mixed-content;"
          },
          {
            key: 'Permissions-Policy',
            value: "camera=(), microphone=(), geolocation=(), browsing-topics=()"
          }
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/blog/ziyarat-places-madinah',
        destination: '/blog/must-visit-ziyarat-places-madinah',
        permanent: true,
      },
{
            "source": "/transfers/jeddah-airport-to-sheraton-makkah-jabal-omar",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-intercontinental-dar-al-tawhid",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-le-meridien-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-makarem-ajyad-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-shaza-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-safwah-royale-orchid",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-elaf-kinda-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-dar-al-eiman-royal",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-marwa-rayhaan-by-rotana",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-anjum-hotel-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-novotel-makkah-thakher-city",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-doubletree-by-hilton-makkah-jabal-omar",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-retaj-al-rayyan-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-infinity-hotel-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-makkah-towers",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-ghufran-safwah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-emaar-grand-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-millennium-makkah-al-naseem",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-copthorne-makkah-al-naseem",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-park-inn-by-radisson-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-holiday-inn-makkah-al-aziziyah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-radisson-blu-hotel-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-ibis-styles-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-kiswah-towers-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-makkah-marriott-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-olayan-plaza-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-snood-al-aziziya-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-violet-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-drnef-hotel-makkah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-mido-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-makkah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-massa-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-nawazi-watheer-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-nada-al-deafah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-hibatullah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-elaf-al-mashaer",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-reyadah-grand-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-jaad-mahbas-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-rawdat-al-bait-guest-house",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-mina-concorde-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-dallah-taibah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-haram-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-rua-al-hijrah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-elaf-taiba-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-frontel-al-harithia-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-aqeeq-madinah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-leader-al-muna-kareem",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-ruve-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-nozol-royal-inn",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-odyssey-hotel-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-saja-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-emaar-royal-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-artal-taiba-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-taiba-front-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-nusk-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-zowar-international-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-golden-tulip-al-mektan",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-eiman-royal-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-mukhtara-international",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-mysk-touch-al-balad",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-sofitel-shahd-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-mellennium-madinah-airport",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-le-bosphorus-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-new-madinah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-taiba-suites",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-elaf-al-taqwa-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-bosphorus-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-durrat-al-eiman",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-eiman-taiba",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-odst-al-madinah-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-province-al-sham",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-madinah-harmony",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-gloria-al-madinah",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-hayah-plaza-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-eiman-ohud",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-diyar-al-salam-silver",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-khozama-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-ansar-golden-tulip",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-elaf-meshal-hotel",
            "destination": "/hotels",
            "permanent": true
      },
      {
            "source": "/transfers/jeddah-airport-to-al-eiman-al-qibla-hotel",
            "destination": "/hotels",
            "permanent": true
      },

      // 🚀 Canonical enforcement & Chain Flattening 🚀──────────────────────────
      // Flatten legacy /umrah/* requests on non-www domain to avoid 2-hop chains
      {
        source: '/umrah/:path*',
        has: [{ type: 'host', value: 'alaqsaumrahtransport.com' }],
        destination: 'https://www.alaqsaumrahtransport.com/:path*',
        permanent: true,
      },
      // Permanently redirect the bare (non-www) domain to the www version.
      // This prevents Google from indexing two copies of the site and ensures
      // all canonical tags (set via metadataBase in layout.tsx) match the
      // URL actually served.  Vercel will honour this at the edge before
      // Next.js even runs, so it is fast and incurs no SSR cost.
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'alaqsaumrahtransport.com' }],
        destination: 'https://www.alaqsaumrahtransport.com/:path*',
        permanent: true,  // 301 — tells Google to update its index
      },
      // ── Fleet taxonomy: consolidated Business Sedan + deprecated 50-seater ─
      { source: '/fleet/toyota-camry', destination: '/fleet/business-sedan', permanent: true },
      { source: '/fleet/kia-k5', destination: '/fleet/business-sedan', permanent: true },
      { source: '/fleet/mitsubishi-xpander', destination: '/fleet/business-sedan', permanent: true },
      { source: '/fleet/large-bus-50-seater', destination: '/fleet/toyota-coaster', permanent: true },
      // ── Resolve 404s found by Search Console ────────────────────────────
      {
        source: '/privacy-policy',
        destination: '/privacy',
        permanent: true,
      },
      {
        source: '/cancellation',
        destination: '/terms',
        permanent: true,
      },
      {
        source: '/services/hajj-group-transport',
        destination: '/services/ziyarat-tours',
        permanent: true,
      },
      // ── Legacy /umrah/* URLs (Wildcard) ──────────────────────────────────
      {
        source: '/umrah/:path*',
        destination: '/:path*',
        permanent: true,
      },
    ];
  },
  compress: true,
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'date-fns',
      'recharts',
      'react-big-calendar',
    ],
  },
};

export default nextConfig;
// Force Next.js Restart 1
