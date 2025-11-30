import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import styles from './FeaturedPost.module.css';
import FadeIn from '@/components/common/FadeIn';
import { BlogPost } from '@/lib/blogData';

interface FeaturedPostProps {
    post: BlogPost;
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    return (
        <FadeIn delay={0.2}>
            <div className={styles.featuredSection}>
                <Link href={`/blog/${post.id}`} className={styles.featuredCard}>
                    <div className={styles.featuredImage}>
                        <Image
                            src={post.image}
                            alt={post.alt}
                            fill
                            className="object-cover"
                            priority
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    <div className={styles.featuredContent}>
                        <span className={styles.featuredLabel}>Featured Article</span>
                        <span className={styles.category}>{post.category}</span>
                        <h3 className={styles.featuredTitle}>{post.title}</h3>
                        <p className={styles.featuredExcerpt}>{post.excerpt}</p>
                        <div className={styles.readMore}>
                            Read Full Article <ArrowRight size={20} />
                        </div>
                    </div>
                </Link>
            </div>
        </FadeIn>
    );
}
