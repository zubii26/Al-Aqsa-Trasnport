import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.alaqsaumrahtransport.com';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/', '/booking'],
            },
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Google-Extended', 'CCBot'],
                disallow: ['/'], // Block AI scrapers to preserve content exclusivity
            }
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
