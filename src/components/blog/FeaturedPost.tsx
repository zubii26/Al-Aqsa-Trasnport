import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

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
            <div className="relative isolate">
                <Link href={`/blog/${post.slug}`} className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

                    {/* Image Section */}
                    <div className="relative h-[300px] lg:h-[450px] overflow-hidden rounded-2xl group-hover:rounded-[1.2rem] transition-all duration-700">
                        <Image
                            src={post.image}
                            alt={post.alt}
                            fill
                            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                            priority
                            sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-transparent transition-colors duration-700" />
                    </div>

                    {/* Content Section (No padding, flush text) */}
                    <div className="relative flex flex-col justify-start pt-4 lg:pt-8 px-1">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 dark:text-white rounded-full flex items-center gap-2">
                                <Sparkles size={12} className="text-primary" />
                                Featured
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                                {post.category}
                            </span>
                        </div>

                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight group-hover:text-primary transition-colors duration-300">
                            {post.title}
                        </h2>

                        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                            {post.excerpt}
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-6 tracking-wide">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden flex items-center justify-center border border-slate-300 dark:border-slate-600">
                                        <Image src="/logo.png" alt="Author" width={20} height={20} className="opacity-70" />
                                    </div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-slate-400" />
                                    {formattedDate}
                                </div>
                                <div className="flex items-center gap-2 hidden sm:flex">
                                    <Clock size={14} className="text-slate-400" />
                                    {post.readTime}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 flex items-center gap-2 text-slate-900 dark:text-white font-semibold text-lg group/btn">
                            Read Full Article
                            <ArrowRight size={20} className="text-primary transform group-hover/btn:translate-x-2 transition-transform duration-300" />
                        </div>
                    </div>
                </Link>
            </div>

            {/* Background Decoration behind the card */}
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-secondary/20 to-primary/20 rounded-[3rem] blur-2xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        </section>
    );
}
