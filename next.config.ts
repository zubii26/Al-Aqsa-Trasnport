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
      // ── Canonical enforcement & Chain Flattening ──────────────────────────
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
        destination: '/services/intercity-transfer',
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
