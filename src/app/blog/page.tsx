'use client';

import React, { useState, useEffect } from 'react';
import HadithCarousel from '@/components/blog/HadithCarousel';
import Hero from '@/components/common/Hero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import ArticleGrid from '@/components/blog/ArticleGrid';
import RespectSection from '@/components/blog/RespectSection';
import TravelTips from '@/components/blog/TravelTips';
import FAQSection from '@/components/blog/FAQSection';
import { Loader2 } from 'lucide-react';

interface BlogPost {
    id: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    alt: string;
    author: string;
    tags: string[];
}

const CATEGORIES = ['All', 'Guide', 'Travel Tips', 'Experience', 'Value', 'Spiritual', 'News', 'FAQ'];

export default function BlogPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/blog');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Featured Post (First one)
    const featuredPost = posts[0];

    // Filter posts (excluding featured post from grid if showing all, or just filtering by category)
    const filteredPosts = posts.filter(post => {
        if (activeCategory === 'All') {
            return post.id !== featuredPost?.id; // Don't show featured post in grid when on 'All'
        }
        return post.category === activeCategory;
    });

    return (
        <main>
            <Hero
                title="Pilgrim Resources & Insights"
                subtitle="Expert guides, travel tips, and answers to your questions for a blessed and hassle-free Umrah journey."
                bgImage="https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=2000&auto=format&fit=crop"
            />

            {/* Articles Section */}
            <div className="bg-slate-50 pb-20 pt-20 min-h-[600px]">
                <div className="container">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <Loader2 size={40} className="animate-spin text-amber-500" />
                        </div>
                    ) : (
                        <>
                            {/* Featured Article (Only show on 'All' or if it matches category) */}
                            {featuredPost && (activeCategory === 'All' || featuredPost.category === activeCategory) && (
                                <FeaturedPost post={featuredPost} />
                            )}

                            <ArticleGrid
                                posts={filteredPosts}
                                categories={CATEGORIES}
                                activeCategory={activeCategory}
                                onCategoryChange={setActiveCategory}
                            />
                        </>
                    )}
                </div>
            </div>

            <HadithCarousel />
            <RespectSection />
            <TravelTips />
            <FAQSection />
        </main>
    );
}
