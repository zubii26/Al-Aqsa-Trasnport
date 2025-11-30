import React from 'react';
import { Star, Quote, BadgeCheck } from 'lucide-react';
import { motion } from 'framer-motion';

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
        <motion.div
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-full flex flex-col relative group hover:bg-white/[0.07] hover:border-white/20 hover:shadow-2xl hover:shadow-amber-900/10 transition-all duration-500"
            whileHover={{ y: -8 }}
        >
            {/* Decorative Gradient Border */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="absolute top-8 right-8 text-white/5 group-hover:text-amber-500/20 transition-colors duration-500">
                <Quote size={64} className="rotate-12" />
            </div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            size={18}
                            className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'} transition-colors duration-300`}
                        />
                    ))}
                </div>

                <p className="text-slate-300 mb-8 flex-grow line-clamp-4 leading-relaxed text-lg font-light italic">
                    &quot;{review.comment}&quot;
                </p>

                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800 border-2 border-white/10 group-hover:border-amber-500/50 transition-colors duration-300">
                        {review.avatar ? (
                            <img src={review.avatar} alt={review.author} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white font-bold bg-gradient-to-br from-slate-700 to-slate-800">
                                {review.author.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-base group-hover:text-amber-200 transition-colors">{review.author}</h4>
                            <BadgeCheck size={16} className="text-blue-400" />
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <span>{new Date(review.date).toLocaleDateString()}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 rounded-full bg-white/10 flex items-center justify-center">
                                    <span className="text-[8px] font-bold">G</span>
                                </span>
                                Google Review
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
