import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './FeaturedPost.module.css';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface FeaturedPostProps {
    post: {
        slug: string;
        title: string;
        excerpt: string;
        image: string;
        alt: string;
        category: string;
        author: string;
        readTime: string;
        date: Date | string;
    };
}

export default function FeaturedPost({ post }: FeaturedPostProps) {
    const formattedDate = new Date(post.date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    return (
        <section className="mb-24 relative group">
            <GlassCard delay={0.2} className="p-0 overflow-hidden rounded-[2.5rem] border border-white/20 dark:border-white/5 shadow-2xl relative isolate">
                <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 lg:grid-cols-2 relative min-h-[500px]">

                    {/* Image Section */}
                    <div className="relative h-[300px] lg:h-full overflow-hidden">
                        <Image
                            src={post.image}
                            alt={post.alt}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent lg:hidden" />
                    </div>

                    {/* Content Section */}
                    <div className="relative p-8 lg:p-16 flex flex-col justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl lg:border-l border-white/10">
                        {/* Decorative Background Glow */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -z-10" />

                        <div className="flex items-center gap-3 mb-6">
                            <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg shadow-primary/20 flex items-center gap-2">
                                <Sparkles size={12} />
                                Featured
                            </span>
                            <span className="text-sm font-bold text-secondary uppercase tracking-widest">
                                {post.category}
                            </span>
                        </div>

                        <h3 className="text-3xl lg:text-5xl font-bold font-playfair text-slate-900 dark:text-white mb-6 leading-[1.1]">
                            {post.title}
                        </h3>

                        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed font-light">
                            {post.excerpt}
                        </p>

                        {/* Meta Info */}
                        <div className="flex items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400 mb-6">
                            <span className="flex items-center gap-1.5">
                                <Calendar size={14} className="text-amber-500" />
                                {formattedDate}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-amber-500" />
                                {post.readTime}
                            </span>
                        </div>

                        <div className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-sm group/btn">
                            Read Full Article
                            <span className="bg-primary/10 p-2 rounded-full transition-all duration-300 group-hover/btn:bg-primary group-hover/btn:text-white group-hover/btn:translate-x-2">
                                <ArrowRight size={18} />
                            </span>
                        </div>
                    </div>
                </Link>
            </GlassCard>

            {/* Background Decoration behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[3rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </section>
    );
}
