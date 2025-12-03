'use client';

import React, { useEffect, useState } from 'react';
import ReviewsCarousel from './ReviewsCarousel';
import { Star, MessageSquarePlus, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
                setReviews(formattedData);
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
            <section className="py-32 relative overflow-hidden bg-slate-950">
                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <div className="h-8 w-48 bg-slate-800/50 rounded-full mx-auto animate-pulse" />
                        <div className="h-16 w-3/4 max-w-2xl bg-slate-800/50 rounded-2xl mx-auto animate-pulse" />
                        <div className="h-6 w-1/2 max-w-lg bg-slate-800/50 rounded-xl mx-auto animate-pulse" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 h-80 animate-pulse flex flex-col">
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, j) => (
                                        <div key={j} className="w-4 h-4 rounded-full bg-slate-800" />
                                    ))}
                                </div>
                                <div className="space-y-3 flex-1">
                                    <div className="h-4 w-full bg-slate-800 rounded" />
                                    <div className="h-4 w-5/6 bg-slate-800 rounded" />
                                    <div className="h-4 w-4/6 bg-slate-800 rounded" />
                                </div>
                                <div className="flex items-center gap-4 mt-6 pt-6 border-t border-white/5">
                                    <div className="w-12 h-12 rounded-full bg-slate-800" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-slate-800 rounded" />
                                        <div className="h-3 w-16 bg-slate-800 rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
        : "5.0";

    const ratingCounts = {
        5: reviews.filter(r => r.rating === 5).length,
        4: reviews.filter(r => r.rating === 4).length,
        3: reviews.filter(r => r.rating === 3).length,
        2: reviews.filter(r => r.rating === 2).length,
        1: reviews.filter(r => r.rating === 1).length,
    };

    return (
        <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Subtle Background */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-200/20 via-slate-50 to-slate-50 dark:from-slate-900/20 dark:via-slate-950 dark:to-slate-950" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6"
                    >
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-200">
                            <span className="font-bold text-amber-600 dark:text-amber-400">{averageRating}/5</span> Average Rating
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 tracking-tight"
                    >
                        Trusted by <span className="text-amber-500 dark:text-amber-400">Thousands</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-12"
                    >
                        Join the community of pilgrims who trust Al Aqsa Transport for their spiritual journey.
                    </motion.p>

                    {/* Simplified Rating Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-12 mb-16"
                    >
                        <div className="flex items-center gap-8">
                            <div className="text-center">
                                <div className="text-6xl font-bold text-slate-900 dark:text-white tracking-tighter">{averageRating}</div>
                                <div className="flex gap-1 justify-center mt-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={16} className={`${i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-800'}`} />
                                    ))}
                                </div>
                                <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">{totalReviews} Verified Reviews</div>
                            </div>

                            <div className="h-16 w-px bg-slate-200 dark:bg-slate-800" />

                            <div className="space-y-1.5">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-3 text-xs">
                                        <span className="text-slate-600 dark:text-slate-400 w-3 font-medium">{star}</span>
                                        <div className="w-32 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-amber-500 rounded-full"
                                                style={{ width: `${totalReviews > 0 ? (ratingCounts[star as keyof typeof ratingCounts] / totalReviews) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <a
                            href="https://search.google.com/local/writereview?placeid=ChIJ..." // TODO: Add actual Place ID
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 px-6 py-3 rounded-full font-semibold transition-colors"
                        >
                            <MessageSquarePlus size={18} />
                            <span>Write a Review</span>
                        </a>
                    </motion.div>
                </div>

                <ReviewsCarousel reviews={reviews} />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <a
                        href="https://search.google.com/local/reviews?placeid=ChIJ..." // TODO: Add actual Place ID
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
                    >
                        <span>Read all reviews on Google</span>
                        <ChevronRight size={14} />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
