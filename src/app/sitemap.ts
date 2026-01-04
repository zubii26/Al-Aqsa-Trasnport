import { MetadataRoute } from 'next';
import { blogService } from '@/services/blogService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://alaqsaumrahtransport.com';

    // Static Routes
    const routes = [
        '/umrah',
        '/umrah/about',
        '/umrah/services',
        '/umrah/fleet',
        '/umrah/fleet/gmc-yukon-at4',
        '/umrah/fleet/toyota-camry',
        '/umrah/fleet/hyundai-starex',
        '/umrah/fleet/hyundai-staria',
        '/umrah/fleet/toyota-hiace',
        '/umrah/blog',
        '/umrah/contact',
        '/umrah/booking',
        '/umrah/services/jeddah-airport-transfer',
        '/umrah/services/makkah-madinah-taxi',
        '/umrah/services/ziyarat-tours',
        '/umrah/services/madinah-airport-transfer',
        '/umrah/services/makkah-jeddah-taxi',
        '/umrah/services/intercity-transfer',
        '/umrah/services/airport-transfers',
        '/umrah/routes',
        '/umrah/safety',
        '/umrah/services/taif-city-tour',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '/umrah' ? 1 : 0.8,
    }));

    // Dynamic Blog Posts
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = await blogService.getPosts();
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/umrah/blog/${post.slug}`,
            lastModified: new Date(post.updatedAt || post.date),
            changeFrequency: 'monthly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.warn('Failed to fetch blog posts for sitemap:', error);
        // Continue without blog routes to ensure build succeeds
    }

    return [...routes, ...blogRoutes];
}
