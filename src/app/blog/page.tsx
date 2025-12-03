import React from 'react';
import HadithCarousel from '@/components/blog/HadithCarousel';
import Hero from '@/components/common/Hero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import BlogFeed from '@/components/blog/BlogFeed';
import RespectSection from '@/components/blog/RespectSection';
import TravelTips from '@/components/blog/TravelTips';
import FAQSection from '@/components/blog/FAQSection';
import { blogService } from '@/services/blogService';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Umrah Travel Blog | Tips, Guides & Spiritual Insights',
    description: 'Read our latest articles on Umrah travel tips, spiritual guides, and transport advice for a blessed journey to Makkah and Madinah.',
    alternates: {
        canonical: 'https://alaqsa-transport.com/blog',
    },
};

const CATEGORIES = ['All', 'Guide', 'Travel Tips', 'Experience', 'Value', 'Spiritual', 'News', 'FAQ'];

export default async function BlogPage() {
    const dbPosts = await blogService.getPosts();

    // Map to match component interface (convert Date to string)
    const posts = dbPosts.map(post => ({
        ...post,
        id: post.slug, // Ensure ID is slug
        date: new Date(post.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }),
        // Ensure other fields match if needed
    }));

    // Sort by date desc (using the original date object from dbPosts for sorting if needed, or just trust the service sort)
    // Service already sorts by date desc.

    const featuredPost = posts[0];


    return (
        <main>
            <Hero
                title="Pilgrim Resources & Insights"
                subtitle="Expert guides, travel tips, and answers to your questions for a blessed and hassle-free Umrah journey."
                bgImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
            />

            {/* Articles Section */}
            <div className="bg-background pb-20 pt-20 min-h-[600px]">
                <div className="container">
                    {featuredPost && (
                        <FeaturedPost post={featuredPost} />
                    )}

                    <BlogFeed
                        posts={posts}
                        categories={CATEGORIES}
                    />
                </div>
            </div>

            <HadithCarousel />
            <RespectSection />
            <TravelTips />
            <FAQSection />
        </main>
    );
}
