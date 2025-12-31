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
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 9;

    // Reset pagination when filters change
    React.useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory, searchTerm]);

    // Filter logic
    const filteredPosts = posts.filter(post => {
        const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
        const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of grid smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' }); // In a real implementation, you might want to scroll to the grid specifically
    };

    return (
        <ArticleGrid
            posts={paginatedPosts}
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
        />
    );
}
