import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';
import styles from './LatestArticles.module.css';
import { blogPosts } from '@/lib/blogData';
import FadeIn from '@/components/common/FadeIn';

export default function LatestArticles() {
    // Get the first 3 articles
    const latestPosts = blogPosts.slice(0, 3);

    return (
        <section className={styles.section}>
            <div className="container">
                <FadeIn>
                    <h2 className={styles.sectionTitle}>Latest from Our Blog</h2>
                </FadeIn>
                <div className={styles.grid}>
                    {latestPosts.map((post, index) => (
                        <FadeIn key={post.id} delay={index * 0.1}>
                            <Link href={`/blog/${post.id}`} className={styles.card}>
                                <div className={styles.imageWrapper}>
                                    <Image
                                        src={post.image}
                                        alt={post.alt}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className={styles.content}>
                                    <span className={styles.category}>{post.category}</span>
                                    <h3 className={styles.title}>{post.title}</h3>
                                    <p className={styles.excerpt}>{post.excerpt}</p>
                                    <div className={styles.footer}>
                                        <span className={styles.readTime}>
                                            <Clock size={14} />
                                            {post.readTime}
                                        </span>
                                        <span className={styles.readMore}>
                                            Read More <ArrowRight size={16} />
                                        </span>
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
