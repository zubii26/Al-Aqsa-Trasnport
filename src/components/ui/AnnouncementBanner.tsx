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
                    className="relative overflow-hidden bg-slate-900/90 backdrop-blur-md border-b border-white/10 shadow-lg z-50"
                >
                    {/* Glassy Glow Effects */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-amber-600/10 rounded-full blur-[80px]" />
                    </div>

                    <div className="container mx-auto px-4 py-3 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-8">

                            {/* Offer Text */}
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="hidden md:flex bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-lg shadow-amber-500/20 transform rotate-3">
                                    <Percent size={20} className="text-slate-900" />
                                </div>
                                <div className="flex flex-col">
                                    <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                                            <Sparkles size={10} className="text-amber-300 animate-pulse" />
                                            <span className="text-amber-300 text-[10px] font-bold tracking-widest uppercase leading-none pt-0.5">Limited Offer</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-200 font-medium text-sm md:text-base leading-tight">
                                        Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 font-bold text-lg mx-1 drop-shadow-sm">
                                            {discount.type === 'percentage' ? `${discount.value}% OFF` : `${discount.value} SAR OFF`}
                                        </span>
                                        on premium rides
                                    </p>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            {timeLeft && (
                                <div className="flex items-center gap-4 bg-white/5 px-5 py-2 rounded-2xl border border-white/10 shadow-inner">
                                    <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider border-r border-white/10 pr-4 mr-1">
                                        <Clock size={14} className="text-amber-500" />
                                        <span>Ends In</span>
                                    </div>
                                    <div className="flex gap-3 text-center">
                                        {[
                                            { value: timeLeft.days, label: 'Days' },
                                            { value: timeLeft.hours, label: 'Hrs' },
                                            { value: timeLeft.minutes, label: 'Mins' },
                                            { value: timeLeft.seconds, label: 'Secs' }
                                        ].map((item, idx, arr) => (
                                            <React.Fragment key={item.label}>
                                                <div className="flex flex-col min-w-[32px]">
                                                    <span className="text-white font-bold text-lg leading-none tabular-nums tracking-tight font-mono">
                                                        {String(item.value).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{item.label}</span>
                                                </div>
                                                {idx < arr.length - 1 && (
                                                    <span className="text-white/20 font-light text-lg relative -top-1">:</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute right-2 top-2 md:relative md:right-auto md:top-auto p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all duration-300 group"
                                aria-label="Close announcement"
                            >
                                <X size={16} className="group-hover:rotate-90 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
