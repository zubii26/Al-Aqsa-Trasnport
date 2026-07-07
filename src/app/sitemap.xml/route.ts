import { NextResponse } from 'next/server';

export async function GET() {
    const baseUrl = 'https://www.alaqsaumrahtransport.com';

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <sitemap>
            <loc>${baseUrl}/sitemap-pages.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/sitemap-services.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
        <sitemap>
            <loc>${baseUrl}/sitemap-blog.xml</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </sitemap>
    </sitemapindex>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
