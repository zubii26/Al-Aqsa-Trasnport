import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FadeIn from '@/components/common/FadeIn';
import { BlogPost } from '@/lib/blogData';
import { Search, Clock, ArrowRight, CalendarDays } from 'lucide-react';

interface ArticleGridProps {
    posts: BlogPost[];
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
}

export default function ArticleGrid({
    posts,
    categories,
    activeCategory,
    onCategoryChange,
    searchTerm,
    onSearchChange
}: ArticleGridProps) {
    return (
        <section className="py-24 bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-950/50 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
                <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="flex flex-col items-center mb-16 text-center">
                    <FadeIn>
                        <h2 className="text-4xl md:text-5xl font-bold mb-6 font-playfair bg-clip-text text-transparent bg-gradient-to-r from-foreground to-slate-600 dark:to-slate-400">
                            Latest Articles
                        </h2>
                    </FadeIn>

                    {/* Search and Filter Container */}
                    <FadeIn delay={0.1} className="w-full max-w-4xl">
                        <div className="flex flex-col md:flex-row gap-6 items-center justify-between p-2 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-200/50 dark:border-slate-800/50">

                            {/* Categories (Scrollable on mobile) */}
                            <div className="flex overflow-x-auto pb-2 md:pb-0 gap-2 w-full md:w-auto scrollbar-hide px-2">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => onCategoryChange(category)}
                                        className={`
                                            whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300
                                            ${activeCategory === category
                                                ? 'bg-primary text-white shadow-lg shadow-primary/25 scale-105'
                                                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-primary'}
                                        `}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            {/* Search Input */}
                            <div className="relative w-full md:w-64 shrink-0">
                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400">
                                    <Search size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    value={searchTerm}
                                    onChange={(e) => onSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-slate-800 border-none focus:ring-2 focus:ring-primary/20 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((article, index) => (
                        <FadeIn key={article.id} delay={index * 0.05}>
                            <Link href={`/blog/${article.id}`} className="group h-full block">
                                <article className="h-full flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 hover:-translate-y-2 relative isolate">

                                    {/* Image */}
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={article.image}
                                            alt={article.alt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />

                                        {/* Category Badge */}
                                        <div className="absolute top-4 left-4">
                                            <span className="px-3 py-1 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-xs font-bold uppercase tracking-wider text-primary rounded-full shadow-lg">
                                                {article.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
                                            <span className="flex items-center gap-1.5">
                                                <CalendarDays size={14} className="text-secondary" />
                                                {new Date(article.date).toLocaleDateString(undefined, {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                                            <span className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-secondary" />
                                                {article.readTime}
                                            </span>
                                        </div>

                                        <h3 className="text-xl font-bold font-playfair text-slate-900 dark:text-slate-100 mb-3 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                            {article.title}
                                        </h3>

                                        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                                            {article.excerpt}
                                        </p>

                                        <div className="flex items-center gap-2 text-sm font-bold text-primary uppercase tracking-wide group/btn">
                                            Read Article
                                            <ArrowRight size={16} className="transition-transform group-hover/btn:translate-x-1" />
                                        </div>
                                    </div>

                                    {/* Golden Glow Border Effect on Hover */}
                                    <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/10 rounded-3xl transition-all duration-500 pointer-events-none" />
                                </article>
                            </Link>
                        </FadeIn>
                    ))}
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-slate-500 dark:text-slate-400 text-lg">No articles found matching your criteria.</p>
                        <button
                            onClick={() => {
                                onSearchChange('');
                                onCategoryChange('All');
                            }}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
