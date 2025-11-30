'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ReviewCard from './ReviewCard';

interface Review {
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
    avatar?: string;
}

interface ReviewsCarouselProps {
    reviews: Review[];
}

export default function ReviewsCarousel({ reviews }: ReviewsCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [visibleItems, setVisibleItems] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) setVisibleItems(1);
            else if (window.innerWidth < 1024) setVisibleItems(2);
            else setVisibleItems(3);
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % (reviews.length - visibleItems + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 < 0 ? 0 : prev - 1));
    };

    if (!reviews || reviews.length === 0) return null;

    return (
        <div className="relative max-w-7xl mx-auto px-4">
            <div className="overflow-hidden py-10">
                <motion.div
                    className="flex gap-6"
                    animate={{ x: `-${currentIndex * (100 / visibleItems)}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="flex-shrink-0 w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                        >
                            <ReviewCard review={review} />
                        </div>
                    ))}
                </motion.div>
            </div>

            <div className="flex justify-center gap-6 mt-12">
                <button
                    onClick={prevSlide}
                    disabled={currentIndex === 0}
                    className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed group"
                    aria-label="Previous review"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-0.5 transition-transform" />
                </button>
                <button
                    onClick={nextSlide}
                    disabled={currentIndex >= reviews.length - visibleItems}
                    className="p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-500/50 hover:text-amber-400 transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white/5 disabled:hover:border-white/10 disabled:cursor-not-allowed group"
                    aria-label="Next review"
                >
                    <ChevronRight size={24} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
            </div>
        </div>
    );
}
