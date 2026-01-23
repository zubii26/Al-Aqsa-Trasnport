import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    // ignoreBuildErrors: false,
    // Trigger Restart
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
            value: "default-src 'self'; img-src 'self' https: data: blob:; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; connect-src 'self' https://www.google-analytics.com; frame-src 'self' https://www.google.com;"
          }
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/umrah/blog',
        destination: '/blog',
        permanent: true,
      },
      {
        source: '/umrah/blog/:slug',
        destination: '/blog/:slug',
        permanent: true,
      },
    ];
  },
  compress: true,
  experimental: {
    optimizeCss: false,
  },
};

export default nextConfig;
