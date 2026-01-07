import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { staticBlogPosts } from '@/data/blog-posts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ShareButtons from '@/components/blog/ShareButtons';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import { Calendar, Clock, ChevronLeft, User, ThumbsUp } from 'lucide-react';

interface Props {
    params: {
        slug: string;
    };
}

// Generate Metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const post = staticBlogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        return {
            title: 'Article Not Found',
        };
    }

    return {
        title: post.metaTitle || post.title,
        description: post.metaDescription || post.excerpt,
        openGraph: {
            title: post.metaTitle || post.title,
            description: post.metaDescription || post.excerpt,
            type: 'article',
            publishedTime: post.date.toISOString(),
            authors: [post.author],
            images: [
                {
                    url: post.image,
                    width: 1200,
                    height: 630,
                    alt: post.alt,
                },
            ],
        },
    };
}

export default function SingleBlogPage({ params }: Props) {
    const post = staticBlogPosts.find((p) => p.slug === params.slug);

    if (!post) {
        notFound();
    }

    // Related posts (same category, excluding current)
    const relatedPosts = staticBlogPosts
        .filter(p => p.category === post.category && p.slug !== post.slug)
        .slice(0, 3);

    return (
        <main className="min-h-screen bg-white dark:bg-slate-950">
            <Navbar />

            <article>
                {/* Hero Header */}
                <header className="relative w-full h-[60vh] min-h-[500px] flex items-end">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                        <Image
                            src={post.image}
                            alt={post.alt}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
                    </div>

                    <div className="container mx-auto px-4 pb-16 relative z-10 w-full max-w-4xl">
                        {/* BreadCrumb / Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-8 transition-colors text-sm font-medium group"
                        >
                            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-amber-500 transition-colors">
                                <ChevronLeft size={16} />
                            </div>
                            Back to Articles
                        </Link>

                        {/* Category Badge */}
                        <div className="mb-6">
                            <span className="bg-amber-500 text-slate-900 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
                                {post.category}
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-playfair leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta Data Row */}
                        <div className="flex flex-wrap items-center gap-6 text-slate-300 text-sm md:text-base border-t border-white/20 pt-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-700/50 backdrop-blur flex items-center justify-center border border-white/10 text-amber-400">
                                    <User size={20} />
                                </div>
                                <span className="font-medium text-white">{post.author}</span>
                            </div>

                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/30" />

                            <div className="flex items-center gap-2">
                                <Calendar size={18} className="text-amber-400" />
                                <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            </div>

                            <span className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/30" />

                            <div className="flex items-center gap-2">
                                <Clock size={18} className="text-amber-400" />
                                <span>{post.readTime}</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Content Container */}
                <div className="container mx-auto px-4 py-12 lg:py-16">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-24">

                        {/* Left: Article Content */}
                        <div className="flex-1 max-w-4xl mx-auto lg:mx-0">
                            {/* Lead Excerpt */}
                            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-12 border-l-4 border-amber-500 pl-6 italic">
                                {post.excerpt}
                            </p>

                            {/* Main PROSE Content */}
                            <div
                                className="prose prose-lg md:prose-xl dark:prose-invert prose-slate max-w-none 
                                prose-headings:font-playfair prose-headings:font-bold prose-headings:text-slate-900 dark:prose-headings:text-white
                                prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-8
                                prose-a:text-amber-600 dark:prose-a:text-amber-400 prose-a:no-underline hover:prose-a:underline
                                prose-img:rounded-2xl prose-img:shadow-xl
                                prose-li:text-slate-600 dark:prose-li:text-slate-300
                                prose-strong:text-slate-900 dark:prose-strong:text-white prose-strong:font-bold"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
                                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4">Related Topics:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map(tag => (
                                            <Link
                                                key={tag}
                                                href={`/blog?category=${tag}`}
                                                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-sm font-medium hover:bg-amber-500 hover:text-white transition-colors"
                                            >
                                                #{tag}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Engagement / Share */}
                            <div className="mt-12 p-8 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="text-center md:text-left">
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 flex items-center gap-2 justify-center md:justify-start">
                                            <ThumbsUp className="text-amber-500" size={20} />
                                            Enjoyed this article?
                                        </h3>
                                        <p className="text-slate-500 text-sm">Share it with your friends and family going for Umrah.</p>
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <ShareButtons slug={post.slug} title={post.title} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: Sidebar (Desktop) */}
                        <aside className="lg:w-80 shrink-0 space-y-12">
                            {/* Newsletter Widget */}
                            <div className="bg-slate-900 rounded-2xl p-8 text-center shadow-xl relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <h3 className="text-xl font-bold text-white mb-4 font-playfair relative z-10">Get Weekly Umrah Tips</h3>
                                <p className="text-slate-300 text-sm mb-6 relative z-10">Join 15,000+ pilgrims receiving transport deals and spiritual guides.</p>
                                <Link
                                    href="#newsletter"
                                    className="block w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg transition-colors relative z-10"
                                >
                                    Subscribe Free
                                </Link>
                            </div>

                            {/* Related Articles */}
                            {relatedPosts.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                                        More in {post.category}
                                    </h3>
                                    <div className="space-y-6">
                                        {relatedPosts.map(rp => (
                                            <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                                                <div className="relative h-40 rounded-xl overflow-hidden mb-3">
                                                    <Image
                                                        src={rp.image}
                                                        alt={rp.alt}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-200 leading-snug group-hover:text-amber-600 transition-colors">
                                                    {rp.title}
                                                </h4>
                                                <span className="text-xs text-slate-500 mt-2 block">{new Date(rp.date).toLocaleDateString()}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </aside>

                    </div>
                </div>
            </article>

            {/* Newsletter Full Width */}
            <div id="newsletter" className="bg-slate-50 dark:bg-black py-12">
                <NewsletterSignup />
            </div>

            <Footer />
        </main>
    );
}
