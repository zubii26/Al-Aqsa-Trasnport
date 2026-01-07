import { Metadata } from 'next';
import { staticBlogPosts } from '@/data/blog-posts';
import BlogHero from '@/components/blog/BlogHero';
import FeaturedPost from '@/components/blog/FeaturedPost';
import ArticleGrid from '@/components/blog/ArticleGrid';
import NewsletterSignup from '@/components/blog/NewsletterSignup';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
    title: 'Umrah Travel Blog | Tips, Guides & Spiritual Advice',
    description: 'Expert advice for your Umrah journey. Read our latest guides on transport, ziyarat, and spiritual preparation for a blessed pilgrimage.',
    openGraph: {
        title: 'Umrah Travel Blog | Al Aqsa Transport',
        description: 'Expert advice for your Umrah journey. Transport tips, Ziyarat guides, and spiritual preparation.',
        type: 'website',
    }
};

export default function BlogListingPage() {
    // Sort posts by date (newest first)
    const sortedPosts = [...staticBlogPosts].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    const featuredPost = sortedPosts[0];
    const remainingPosts = sortedPosts.slice(1);

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <BlogHero />

            <div className="container mx-auto px-4 py-12 space-y-20">
                {/* Featured Section */}
                {featuredPost && (
                    <section>
                        <FeaturedPost post={featuredPost} />
                    </section>
                )}

                {/* Main Articles Grid */}
                {remainingPosts.length > 0 && (
                    <section>
                        <div className="flex items-end justify-between mb-8">
                            <h2 className="text-3xl font-bold text-slate-900 dark:text-white font-playfair">
                                Latest Articles
                            </h2>
                            <div className="hidden md:block h-px flex-1 bg-slate-200 dark:bg-slate-800 ml-8" />
                        </div>
                        <ArticleGrid posts={remainingPosts} />
                    </section>
                )}

                {/* Newsletter Section */}
                <section className="max-w-4xl mx-auto">
                    <NewsletterSignup />
                </section>
            </div>

            <Footer />
        </main>
    );
}
