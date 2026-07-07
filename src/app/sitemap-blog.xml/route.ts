import { NextResponse } from 'next/server';
import { blogService } from '@/services/blogService';

export async function GET() {
    const baseUrl = 'https://www.alaqsaumrahtransport.com';
    let blogRoutes = '';

    try {
        const posts = await blogService.getPosts();
        blogRoutes = posts.map((post) => {
            const dateStr = post.updatedAt || post.date;
            // Validate the date to prevent 'Invalid Date' output
            const date = dateStr ? new Date(dateStr) : new Date();
            const lastModified = isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();

            return `
        <url>
            <loc>${baseUrl}/blog/${post.slug}</loc>
            <lastmod>${lastModified}</lastmod>
            <changefreq>monthly</changefreq>
            <priority>0.7</priority>
        </url>`;
        }).join('');
    } catch (error) {
        console.warn('Failed to fetch blog posts for sitemap:', error);
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${blogRoutes}
    </urlset>`;

    return new NextResponse(xml, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
