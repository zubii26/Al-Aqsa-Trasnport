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
    const [searchTerm, setSearchTerm] = useState('');

    // Filter logic
    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <ArticleGrid
            posts={filteredPosts}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
        />
    );
}
