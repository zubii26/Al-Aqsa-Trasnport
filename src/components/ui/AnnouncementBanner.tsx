'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Percent, X, Clock, Sparkles } from 'lucide-react';

interface AnnouncementBannerProps {
    discount: {
        enabled: boolean;
        type: 'percentage' | 'fixed';
        value: number;
        startDate?: string;
        endDate?: string;
    };
}

export default function AnnouncementBanner({ discount }: AnnouncementBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    // Calculate time left
    useEffect(() => {
        if (!discount.endDate) return;

        const calculateTimeLeft = () => {
            const difference = +new Date(discount.endDate!) - +new Date();

            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        // Initial calculation
        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (!remaining) {
                setIsVisible(false); // Hide if expired
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [discount.endDate]);

    if (!isVisible || !discount.enabled) return null;

    // Check start date (compare dates only to avoid timezone issues)
    const now = new Date();
    if (discount.startDate) {
        const startDate = new Date(discount.startDate);
        // Reset times to midnight for comparison
        const startCheck = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const nowCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        if (startCheck > nowCheck) return null;
    }

    // If expired (double check)
    if (discount.endDate && new Date(discount.endDate) < now) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-amber-900 to-slate-900 border-b border-amber-500/30"
                >
                    {/* Abstract Background Pattern */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
                        <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-500 rounded-full blur-[80px]" />
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-amber-500 rounded-full blur-[80px]" />
                    </div>

                    <div className="container mx-auto px-4 py-3 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

                            {/* Offer Text */}
                            <div className="flex items-center gap-3 text-center md:text-left">
                                <div className="hidden md:flex bg-amber-500/20 p-2 rounded-full border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                    <Percent size={20} className="text-amber-400" />
                                </div>
                                <div>
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-0.5">
                                        <Sparkles size={14} className="text-amber-300 animate-pulse" />
                                        <span className="text-amber-300 text-xs font-bold tracking-wider uppercase">Limited Time Offer</span>
                                    </div>
                                    <p className="text-white font-medium text-sm md:text-base">
                                        Get <span className="text-amber-400 font-bold text-lg mx-1">
                                            {discount.type === 'percentage' ? `${discount.value}% OFF` : `${discount.value} SAR OFF`}
                                        </span>
                                        on all premium rides!
                                    </p>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            {timeLeft && (
                                <div className="flex items-center gap-4 bg-black/20 px-4 py-2 rounded-lg border border-white/5 backdrop-blur-sm">
                                    <div className="flex items-center gap-2 text-amber-200/80 text-xs font-medium uppercase tracking-wider mr-2">
                                        <Clock size={14} />
                                        <span>Ends In:</span>
                                    </div>
                                    <div className="flex gap-3 text-center">
                                        <div className="flex flex-col min-w-[30px]">
                                            <span className="text-white font-bold text-lg leading-none">{timeLeft.days}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Days</span>
                                        </div>
                                        <span className="text-amber-500/50 font-bold">:</span>
                                        <div className="flex flex-col min-w-[30px]">
                                            <span className="text-white font-bold text-lg leading-none">{String(timeLeft.hours).padStart(2, '0')}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Hrs</span>
                                        </div>
                                        <span className="text-amber-500/50 font-bold">:</span>
                                        <div className="flex flex-col min-w-[30px]">
                                            <span className="text-white font-bold text-lg leading-none">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Min</span>
                                        </div>
                                        <span className="text-amber-500/50 font-bold">:</span>
                                        <div className="flex flex-col min-w-[30px]">
                                            <span className="text-amber-400 font-bold text-lg leading-none">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                            <span className="text-[10px] text-slate-400 uppercase">Sec</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute right-2 top-2 md:relative md:right-auto md:top-auto p-1.5 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                                aria-label="Close announcement"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
