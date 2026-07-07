import { NextResponse } from 'next/server';
import pricingData from '@/data/pricing.json';
import { topHotels } from '@/data/hotels';

export async function GET() {
    const baseUrl = 'https://www.alaqsaumrahtransport.com';
    const lastModified = new Date().toISOString();

    const staticServices = [
        '/services',
        '/fleet',
        '/fleet/gmc-yukon-at4',
        '/fleet/toyota-camry',
        '/fleet/hyundai-starex',
        '/fleet/hyundai-staria',
        '/fleet/toyota-hiace',
        '/fleet/toyota-coaster',
        '/fleet/kia-k5',
        '/fleet/large-bus-50-seater',
        '/fleet/mercedes-s-class',
        '/fleet/mitsubishi-xpander',
        '/services/jeddah-airport-transfer',
        '/services/makkah-madinah-taxi',
        '/services/ziyarat-tours',
        '/services/madinah-airport-transfer',
        '/services/makkah-jeddah-taxi',
        '/services/intercity-transfer',
        '/services/airport-transfers',
        '/services/ramadan-transport',
        '/services/taif-city-tour',
        '/routes'
    ];

    const dynamicRoutes = pricingData.routes
        .filter(r => r.slug)
        .map(r => `/routes/${r.slug}`);

    const hotelRoutes = topHotels.map(h => `/transfers/jeddah-airport-to-${h.slug}`);

    const allServices = [...staticServices, ...dynamicRoutes, ...hotelRoutes];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${allServices.map((route) => `
        <url>
            <loc>${baseUrl}${route}</loc>
            <lastmod>${lastModified}</lastmod>
            <changefreq>weekly</changefreq>
            <priority>0.9</priority>
        </url>
        `).join('')}
    </urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
