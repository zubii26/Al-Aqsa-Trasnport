'use client';

import React, { useEffect, useState } from 'react';
import ReviewsCarousel from './ReviewsCarousel';
import { Star, MessageSquarePlus } from 'lucide-react';
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
                setReviews(data);
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
        <section className="py-32 relative overflow-hidden bg-slate-950">
            {/* Premium Background Elements */}
            <div className="absolute inset-0 bg-[url('/images/pattern.png')] opacity-[0.03] mix-blend-overlay" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 pointer-events-none" />

            {/* Ambient Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse-slow" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -z-10 animate-pulse-slow delay-1000" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 shadow-lg shadow-amber-900/5 group hover:bg-white/10 transition-all duration-300"
                    >
                        <Star size={18} className="fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform" />
                        <span className="text-base font-medium text-slate-200">
                            <span className="font-bold text-white">{averageRating}/5</span> Average Rating
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-bold text-white mb-8 tracking-tight leading-tight"
                    >
                        Trusted by <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 animate-gradient">Thousands</span>
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light mb-12"
                    >
                        See what our pilgrims say about their spiritual journey with Al Aqsa Transport.
                        We take pride in providing safe, comfortable, and reliable service.
                    </motion.p>

                    {/* Rating Summary & Actions */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16"
                    >
                        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 flex items-center gap-8 min-w-[300px] hover:border-amber-500/30 transition-colors duration-300 shadow-2xl shadow-black/20">
                            <div className="text-center">
                                <div className="text-5xl font-bold text-white mb-1">{averageRating}</div>
                                <div className="flex gap-1 justify-center mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} size={14} className={`${i < Math.round(Number(averageRating)) ? 'fill-amber-400 text-amber-400' : 'text-slate-700'}`} />
                                    ))}
                                </div>
                                <div className="text-xs text-slate-400">{totalReviews} Reviews</div>
                            </div>
                            <div className="h-16 w-px bg-white/10" />
                            <div className="flex-1 space-y-1">
                                {[5, 4, 3, 2, 1].map((star) => (
                                    <div key={star} className="flex items-center gap-2 text-xs">
                                        <span className="text-slate-400 w-3">{star}</span>
                                        <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden w-24">
                                            <div
                                                className="h-full bg-amber-400 rounded-full shadow-[0_0_10px_rgba(251,191,36,0.5)]"
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
                            className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-8 py-5 rounded-full font-bold transition-all duration-300 hover:scale-105 shadow-lg shadow-amber-500/20 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                            <MessageSquarePlus size={20} className="group-hover:rotate-12 transition-transform relative z-10" />
                            <span className="relative z-10">Write a Review</span>
                        </a>
                    </motion.div>
                </div>

                <ReviewsCarousel reviews={reviews} />

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-16"
                >
                    <a
                        href="https://search.google.com/local/reviews?placeid=ChIJ..." // TODO: Add actual Place ID
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-8 py-4 rounded-full transition-all duration-300 hover:scale-105 group"
                    >
                        <span className="font-medium">Read all reviews on Google</span>
                        <Star size={18} className="text-amber-400 group-hover:rotate-12 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
