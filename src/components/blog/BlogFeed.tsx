'use client';

import React, { useState } from 'react';
import ArticleGrid from './ArticleGrid';

import { BlogPost } from '@/lib/blogData';

interface BlogFeedProps {
    posts: BlogPost[];
    categories: string[];
}

export default function BlogFeed({ posts, categories }: BlogFeedProps) {
    const [activeCategory, setActiveCategory] = useState('All');

    // Filter logic
    const filteredPosts = posts.filter(post => {
        if (activeCategory === 'All') return true;
        return post.category === activeCategory;
    });

    return (
        <ArticleGrid
            posts={filteredPosts}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
        />
    );
}
