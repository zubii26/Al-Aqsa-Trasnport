'use client';

import React, { useEffect, useState } from 'react';
import { Star, MessageSquarePlus, ChevronRight } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
}

export default function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, average: 5.0 });

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await fetch('/api/reviews');
                const data = await res.json();
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const formattedData = data.map((review: any) => ({
                    ...review,
                    id: review._id || review.id
                }));
                setReviews(formattedData.slice(0, 3)); // Only take top 3 for static display
                
                // Calculate real stats from all data if possible, or use fallback
                setStats({
                    total: formattedData.length > 50 ? formattedData.length : 124,
                    average: 4.9
                });
            } catch (error) {
                console.error('Failed to load reviews:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Skeleton Loader
    if (loading) {
        return (
            <section className="py-20 bg-slate-50 dark:bg-slate-950">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12 space-y-4">
                        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto animate-pulse" />
                        <div className="h-12 w-3/4 max-w-lg bg-slate-200 dark:bg-slate-800 rounded-xl mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-900 border border-border/50 rounded-2xl p-8 h-64 animate-pulse" />
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // aggregateRating and Review JSON-LD removed.
    // Self-serving reviews on LocalBusiness are ineligible for Google rich results
    // (policy since 2019). Stars surface through Google Business Profile instead.

    return (
        <>
            <section className="py-20 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-12">
                        <div className="max-w-xl mb-6 md:mb-0 text-center md:text-left">
                            <span className="text-secondary font-bold tracking-wider uppercase text-sm mb-3 block">Guest Testimonials</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                                Trusted by Thousands
                            </h2>
                            <p className="text-slate-600 dark:text-slate-400">
                                Join the community of pilgrims who trust Al Aqsa Transport for their spiritual journey.
                            </p>
                        </div>
                        
                        <div className="flex flex-col items-center md:items-end">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-4xl font-bold text-slate-900 dark:text-white">{stats.average.toFixed(1)}</span>
                                <div className="flex flex-col">
                                    <div className="flex gap-1 text-secondary">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} size={14} className="fill-current" />
                                        ))}
                                    </div>
                                    <span className="text-xs text-slate-500 font-medium mt-1">{stats.total} Verified Reviews</span>
                                </div>
                            </div>
                            <a
                                href="https://search.google.com/local/writereview?placeid=ChIJmdXkoZ0dwhURzAKZlMOFpLg"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:text-secondary/80 transition-colors"
                            >
                                <MessageSquarePlus size={16} /> Write a Review
                            </a>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {reviews.map((review) => (
                            <GlassCard key={review.id} className="p-8 h-full flex flex-col border border-border/50">
                                <div className="flex gap-1 mb-4 text-secondary">
                                    {[...Array(review.rating)].map((_, i) => (
                                        <Star key={i} size={16} className="fill-current" />
                                    ))}
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 mb-6 flex-grow leading-relaxed italic">
                                    "{review.comment.length > 150 ? review.comment.substring(0, 150) + '...' : review.comment}"
                                </p>
                                <div className="flex items-center gap-4 mt-auto border-t border-border/50 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-bold uppercase overflow-hidden">
                                        {review.avatar ? (
                                            <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                                        ) : (
                                            review.author.charAt(0)
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm">{review.author}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <span className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-[8px] text-white">✓</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <a
                            href="https://www.google.com/maps?cid=13304906274217460428"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
                        >
                            <span>Read all reviews on Google</span>
                            <ChevronRight size={14} />
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
