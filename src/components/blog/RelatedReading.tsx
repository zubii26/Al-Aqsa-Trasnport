import React from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { blogService } from '@/services/blogService';
import GlassCard from '@/components/ui/GlassCard';
import FadeIn from '@/components/common/FadeIn';

interface RelatedReadingProps {
    title?: string;
    subtitle?: string;
    count?: number;
    category?: string;
}

export default async function RelatedReading({ 
    title = "From the Blog", 
    subtitle = "Essential guides and tips for your journey", 
    count = 3,
    category 
}: RelatedReadingProps) {
    // Fetch posts
    const allPosts = await blogService.getPosts();
    
    // Filter by category if provided, otherwise just get the latest
    let posts = allPosts;
    if (category) {
        posts = allPosts.filter(post => post.category?.toLowerCase() === category.toLowerCase() || post.tags?.some(tag => tag.toLowerCase() === category.toLowerCase()));
    }
    
    // Get top X posts
    const selectedPosts = posts.slice(0, count);

    if (selectedPosts.length === 0) return null;

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-10">
                        <div>
                            <span className="text-amber-600 dark:text-amber-500 font-bold tracking-widest text-sm uppercase mb-2 block">
                                Latest Insights
                            </span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                                {title}
                            </h2>
                            {subtitle && <p className="text-slate-600 dark:text-slate-400 mt-2">{subtitle}</p>}
                        </div>
                        <Link href="/blog" className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition-colors group">
                            View All Articles <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {selectedPosts.map((post, index) => (
                        <GlassCard key={post.id} delay={0.1 * index} className="p-0 overflow-hidden group h-full flex flex-col">
                            <Link href={`/blog/${post.slug}`} className="flex flex-col h-full">
                                <div className="relative h-48 w-full overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${post.image})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <span className="text-xs font-bold text-amber-600 mb-2 uppercase tracking-wider">{post.category}</span>
                                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-3 line-clamp-2">{post.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">{post.excerpt}</p>
                                    <span className="flex items-center gap-2 text-amber-600 font-bold mt-auto group-hover:gap-3 transition-all">
                                        Read Article <ArrowRight size={16} />
                                    </span>
                                </div>
                            </Link>
                        </GlassCard>
                    ))}
                </div>
                
                <div className="mt-8 text-center md:hidden">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-bold transition-colors group">
                        View All Articles <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
