import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ArticleGrid.module.css';
import FadeIn from '@/components/common/FadeIn';
import GlassCard from '@/components/ui/GlassCard';
import { BlogPost } from '@/lib/blogData';

interface ArticleGridProps {
    posts: BlogPost[];
    categories: string[];
    activeCategory: string;
    onCategoryChange: (category: string) => void;
}

export default function ArticleGrid({ posts, categories, activeCategory, onCategoryChange }: ArticleGridProps) {
    return (
        <section className={styles.section}>
            <div className="container px-0 md:px-4">
                <FadeIn>
                    <h2 className={styles.sectionTitle}>Latest Articles</h2>
                </FadeIn>

                {/* Category Filter */}
                <FadeIn delay={0.1}>
                    <div className={styles.filterBar}>
                        {categories.map((category) => (
                            <button
                                key={category}
                                className={`${styles.filterButton} ${activeCategory === category ? styles.active : ''}`}
                                onClick={() => onCategoryChange(category)}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                <div className={styles.grid}>
                    {posts.map((article, index) => (
                        <FadeIn key={article.id} delay={index * 0.1} className="h-full p-0 md:p-3">
                            <div className={styles.articleCard}>
                                <Link href={`/blog/${article.id}`} className="flex flex-col h-full w-full">
                                    <div className={styles.imageWrapper}>
                                        <Image
                                            src={article.image}
                                            alt={article.alt}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />
                                    </div>
                                    <div className={styles.cardBody}>
                                        <div className={styles.metaHeader}>
                                            <span className={styles.category}>{article.category}</span>
                                            <span className={styles.readTime}>
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                                                {article.readTime}
                                            </span>
                                        </div>

                                        <h3 className={styles.articleTitle}>{article.title}</h3>
                                        <p className={styles.articleExcerpt}>{article.excerpt}</p>

                                        <div className={styles.cardFooter}>
                                            <span className={styles.date}>
                                                {new Date(article.date).toLocaleDateString(undefined, {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                            <span className={styles.readMore}>
                                                Read Article
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
