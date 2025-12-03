import React from 'react';
import Image from 'next/image';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

interface ReviewProps {
    review: {
        id: string;
        author: string;
        rating: number;
        comment: string;
        date: string;
        avatar?: string;
    };
}

export default function ReviewCard({ review }: ReviewProps) {
    return (
        <GlassCard
            className="h-full flex flex-col relative group hover:border-secondary/50 transition-all duration-500"
            hoverEffect={true}
        >
            {/* Decorative Gradient Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-slate-100 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute top-8 right-8 text-slate-100 dark:text-white/5 group-hover:text-amber-500/20 transition-colors duration-500">
                <Quote size={64} className="rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={18}
                            className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 dark:text-slate-700'} transition-colors duration-300`}
                        />
                    ))}
                </div>

                <p className="text-slate-600 dark:text-slate-300 mb-8 flex-grow line-clamp-4 leading-relaxed text-lg font-light italic">
                    &quot;{review.comment}&quot;
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-white/10 group-hover:border-amber-500/50 transition-colors duration-300">
                        {review.avatar ? (
                            <Image src={review.avatar} alt={review.author} fill className="object-cover" unoptimized />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 dark:text-white font-bold bg-slate-200 dark:bg-gradient-to-br dark:from-slate-700 dark:to-slate-800">
                                {review.author?.charAt(0) || '?'}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">{review.author}</h4>
                            <BadgeCheck size={16} className="text-blue-500 dark:text-blue-400" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                            <span suppressHydrationWarning>{new Date(review.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center">
                                    <span className="text-[8px] font-bold text-slate-600 dark:text-slate-300">G</span>
                                </span>
                                Google Review
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </GlassCard>
    );
}
