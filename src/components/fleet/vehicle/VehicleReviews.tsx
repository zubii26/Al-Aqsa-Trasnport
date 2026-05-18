'use client';

import { Star } from 'lucide-react';

interface Review {
    name: string;
    rating: number;
    text: string;
    location?: string;
}

interface VehicleReviewsProps {
    reviews: Review[];
    title?: string;
    subtitle?: string;
}

export default function VehicleReviews({ 
    reviews, 
    title = "Customer Reviews", 
    subtitle = "See what our clients say about traveling in this vehicle."
}: VehicleReviewsProps) {
    if (!reviews || reviews.length === 0) return null;

    return (
        <section className="py-16 bg-slate-50 dark:bg-slate-950">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold font-playfair text-slate-900 dark:text-white mb-4">
                        {title}
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400">
                        {subtitle}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, idx) => (
                        <div key={idx} className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-1 mb-4 text-amber-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18} 
                                        fill={i < review.rating ? "currentColor" : "none"} 
                                        className={i >= review.rating ? "text-slate-300 dark:text-slate-700" : ""}
                                    />
                                ))}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 italic mb-6">
                                &quot;{review.text}&quot;
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 dark:text-slate-400">
                                    {review.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</p>
                                    {review.location && (
                                        <p className="text-xs text-slate-500">{review.location}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
