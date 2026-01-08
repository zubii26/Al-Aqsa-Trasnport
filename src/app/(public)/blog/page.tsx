import React from 'react';
import HadithCarousel from '@/components/blog/HadithCarousel';
import Hero from '@/components/common/Hero';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogFeed from '@/components/blog/BlogFeed';
import RespectSection from '@/components/blog/RespectSection';
import TravelTips from '@/components/blog/TravelTips';
import FAQSection from '@/components/blog/FAQSection';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import { blogService } from '@/services/blogService';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Umrah Travel Blog | Tips & Guides | مدونة العمرة',
    description: 'Read our latest articles on Umrah travel tips, transport advice, and spiritual guides. نصائح وارشادات للمعتمرين. دليل المواصلات في مكة والمدينة.',
    alternates: {
        canonical: 'https://alaqsaumrahtransport.com/blog',
    },
};

const CATEGORIES = ['All', 'Guide', 'Travel Tips', 'Safety', 'Accessibility', 'Experience', 'Value', 'Spiritual', 'News', 'FAQ'];

export default async function BlogPage() {
    const dbPosts = await blogService.getPosts();

    // Map to match component interface (convert Date to string) and ensure serializable data
    const posts = dbPosts.map((post: any) => ({
        id: post.slug,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category || 'General',
        date: new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        readTime: post.readTime || '5 min read',
        image: post.image,
        alt: post.alt || post.title,
        author: post.author || 'Al Aqsa Transport',
        tags: post.tags || [],
    }));

    // Sort by date desc (using the original date object from dbPosts for sorting if needed, or just trust the service sort)
    // Service already sorts by date desc.

    const featuredPost = posts[0];


    return (
        <main>
            <Hero
                title="Pilgrim Resources & Insights"
                subtitle="Expert guides, travel tips, and answers to your questions for a blessed and hassle-free Umrah journey."
                bgImage="/images/blog-hero-professional.png"
                breadcrumbs={<Breadcrumbs />}
            />

            {/* Articles Section */}
            <div className="bg-background pb-20 pt-20 min-h-[600px]">
                <div className="container px-[5px] md:px-4">
                    {featuredPost && (
                        <FeaturedPost post={featuredPost} />
                    )}
                </div>
            </div>

            <BlogFeed
                posts={posts}
                categories={CATEGORIES}
            />

            <NewsletterSignup />

            <HadithCarousel />
            <RespectSection />
            <TravelTips />
            <FAQSection />
        </main >
    );
}
