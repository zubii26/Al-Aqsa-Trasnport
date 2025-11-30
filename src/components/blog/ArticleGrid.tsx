import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import styles from './ArticleGrid.module.css';
import FadeIn from '@/components/common/FadeIn';
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
            <div className="container">
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
                        <FadeIn key={article.id} delay={index * 0.1}>
                            <Link href={`/blog/${article.id}`} className={styles.articleCard}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={article.image}
                                        alt={article.alt}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                </div>
                                <div className={styles.articleContent}>
                                    <span className={styles.category}>{article.category}</span>
                                    <h3 className={styles.articleTitle}>{article.title}</h3>
                                    <p className={styles.articleExcerpt}>{article.excerpt}</p>

                                    <div className={styles.cardFooter}>
                                        <div className={styles.metaInfo}>
                                            <div className={styles.metaItem}>
                                                <Calendar size={14} />
                                                <span>{article.date}</span>
                                            </div>
                                            <div className={styles.metaItem}>
                                                <Clock size={14} />
                                                <span>{article.readTime}</span>
                                            </div>
                                        </div>
                                        <div className={styles.readMore}>
                                            Read Article <ArrowRight size={16} />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
