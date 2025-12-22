import { MetadataRoute } from 'next';
import { blogService } from '@/services/blogService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://alaqsaumrahtransport.com';

    // Static Routes
    const routes = [
        '',
        '/about',
        '/services',
        '/fleet',
        '/fleet/gmc-yukon-at4',
        '/fleet/toyota-camry',
        '/fleet/hyundai-starex',
        '/fleet/hyundai-staria',
        '/fleet/toyota-hiace',
        '/blog',
        '/contact',
        '/booking',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic Blog Posts
    let blogRoutes: MetadataRoute.Sitemap = [];
    try {
        const posts = await blogService.getPosts();
        blogRoutes = posts.map((post) => ({
            url: `${baseUrl}/blog/${post.slug}`,
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
