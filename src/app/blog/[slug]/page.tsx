import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, User, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';
import styles from './page.module.css';
import { blogPosts } from '@/lib/blogData';
import FadeIn from '@/components/common/FadeIn';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
    return blogPosts.map((post) => ({
        slug: post.id,
    }));
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.id === slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: post.title,
        description: post.excerpt,
        keywords: post.tags,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
            images: [
                {
                    url: post.image, // Ensure this is an absolute URL in production
                    alt: post.alt,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: post.excerpt,
            images: [post.image],
        },
    };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const post = blogPosts.find((p) => p.id === slug);

    if (!post) {
        notFound();
    }

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "image": [post.image], // In production, prepend domain
        "datePublished": post.date, // Format should ideally be ISO 8601
        "author": {
            "@type": "Person",
            "name": post.author
        },
        "publisher": {
            "@type": "Organization",
            "name": "Al Aqsa Umrah Transport",
            "logo": {
                "@type": "ImageObject",
                "url": "https://alaqsa-transport.com/logo.png" // Update with actual logo URL
            }
        },
        "description": post.excerpt,
        "articleBody": post.content.replace(/<[^>]*>?/gm, '') // Strip HTML for plain text body
    };

    // Find related posts (exclude current post, limit to 3)
    const relatedPosts = blogPosts
        .filter((p) => p.id !== slug)
        .slice(0, 3);

    return (
        <main>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Premium Hero Section */}
            <div className={styles.heroSection}>
                <div className={styles.heroBackground}>
                    {/* In a real app, use Next.js Image with fill and object-cover */}
                    {/* For now, using a placeholder div or the image if available */}
                    <div
                        className={styles.heroImage}
                        style={{ backgroundImage: `url(${post.image})` }}
                    />
                    <div className={styles.heroOverlay} />
                </div>

                <div className={styles.heroContent}>
                    <FadeIn>
                        <Link href="/blog" className={styles.backLink}>
                            <ArrowLeft size={20} />
                            Back to Blog
                        </Link>
                        <span className={styles.heroCategory}>{post.category}</span>
                        <h1 className={styles.heroTitle}>{post.title}</h1>

                        <div className={styles.heroMeta}>
                            <div className={styles.metaItem}>
                                <Calendar size={18} />
                                {post.date}
                            </div>
                            <div className={styles.metaDivider}>•</div>
                            <div className={styles.metaItem}>
                                <Clock size={18} />
                                {post.readTime}
                            </div>
                            <div className={styles.metaDivider}>•</div>
                            <div className={styles.metaItem}>
                                <User size={18} />
                                {post.author}
                            </div>
                        </div>
                    </FadeIn>
                </div>
            </div>

            <div className={styles.container}>
                <div className={styles.layout}>
                    <div className={styles.contentWrapper}>
                        <FadeIn delay={0.2}>
                            <article className={styles.articleBody}>
                                <div
                                    className={styles.content}
                                    dangerouslySetInnerHTML={{ __html: post.content }}
                                />
                            </article>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div className={styles.tags}>
                                {post.tags.map((tag) => (
                                    <span key={tag} className={styles.tag}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </FadeIn>

                        {/* Author Bio Section */}
                        <FadeIn delay={0.4}>
                            <div className={styles.authorBio}>
                                <div className={styles.authorAvatar}>
                                    <User size={40} />
                                </div>
                                <div className={styles.authorInfo}>
                                    <h3 className={styles.authorName}>About {post.author}</h3>
                                    <p className={styles.authorDescription}>
                                        Expert writer and travel guide specializing in Umrah and Hajj services.
                                        Dedicated to helping pilgrims have a spiritual and comfortable journey.
                                    </p>
                                </div>
                            </div>
                        </FadeIn>
                    </div>

                    <aside className={styles.sidebar}>
                        <FadeIn delay={0.5} direction="left">
                            <div className={`${styles.sidebarWidget} ${styles.ctaWidget}`}>
                                <h3 className={styles.ctaTitle}>Plan Your Umrah Journey</h3>
                                <p className={styles.ctaText}>
                                    Book reliable and comfortable transport for your spiritual journey today.
                                </p>
                                <Link href="/booking" className={styles.ctaButton}>
                                    Book Your Ride
                                </Link>
                            </div>
                        </FadeIn>

                        <FadeIn delay={0.6} direction="left">
                            <div className={styles.sidebarWidget}>
                                <h3 className={styles.widgetTitle}>Share this Article</h3>
                                <div className={styles.shareLinks}>
                                    <button className={styles.shareLink} aria-label="Share on Facebook">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                                    </button>
                                    <button className={styles.shareLink} aria-label="Share on Twitter">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                                    </button>
                                    <button className={styles.shareLink} aria-label="Share on LinkedIn">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                                    </button>
                                </div>
                            </div>
                        </FadeIn>
                    </aside>
                </div>

                {/* Related Articles Section */}
                <section className={styles.relatedSection}>
                    <FadeIn delay={0.7}>
                        <h2 className={styles.relatedTitle}>You Might Also Like</h2>
                        <div className={styles.relatedGrid}>
                            {relatedPosts.map((related, index) => (
                                <Link href={`/blog/${related.id}`} key={related.id} className={styles.relatedCard}>
                                    <div className={styles.relatedImageWrapper}>
                                        {/* Placeholder for image */}
                                        <div
                                            className={styles.relatedImage}
                                            style={{ backgroundImage: `url(${related.image})` }}
                                        />
                                    </div>
                                    <div className={styles.relatedContent}>
                                        <span className={styles.relatedCategory}>{related.category}</span>
                                        <h3 className={styles.relatedCardTitle}>{related.title}</h3>
                                        <span className={styles.readMore}>Read Article <ArrowLeft size={16} className="rotate-180" /></span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </FadeIn>
                </section>
            </div>
        </main>
    );
}
