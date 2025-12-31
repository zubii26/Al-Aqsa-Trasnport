'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import Link from 'next/link';

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
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

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
        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            setTimeLeft(remaining);
            if (!remaining) {
                setIsVisible(false);
                clearInterval(timer);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [discount.endDate]);

    if (!isMounted || !isVisible || !discount.enabled) return null;

    const now = new Date();
    if (discount.startDate) {
        const startDate = new Date(discount.startDate);
        const startCheck = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const nowCheck = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        if (startCheck > nowCheck) return null;
    }
    if (discount.endDate && new Date(discount.endDate) < now) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="relative bg-[#d4af37] text-black z-50 overflow-hidden"
                >
                    <div className="container mx-auto px-4 py-2 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-sm sm:text-base font-medium">

                        {/* Offer Text */}
                        <div className="font-bold tracking-tight">
                            Don&apos;t miss the New Year&apos;s Sale deals!
                        </div>

                        {/* Divider for mobile */}
                        <div className="hidden sm:block w-px h-4 bg-black/20"></div>

                        {/* Countdown Timer */}
                        {timeLeft && (
                            <div className="flex items-center gap-3 font-mono font-bold tracking-wider">
                                <div className="flex items-baseline">
                                    <span className="text-lg">{String(timeLeft.days).padStart(2, '0')}</span>
                                    <span className="text-[10px] ml-0.5">D</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-lg">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="text-[10px] ml-0.5">H</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-lg">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="text-[10px] ml-0.5">M</span>
                                </div>
                                <div className="flex items-baseline">
                                    <span className="text-lg">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="text-[10px] ml-0.5">S</span>
                                </div>
                            </div>
                        )}

                        {/* Divider for mobile */}
                        <div className="hidden sm:block w-px h-4 bg-black/20"></div>

                        {/* Action Link */}
                        <Link href="/booking" className="underline decoration-1 underline-offset-4 hover:no-underline font-bold uppercase text-xs tracking-wider">
                            Explore
                        </Link>

                        {/* Close Button (Optional, but good for UX) */}
                        <button
                            onClick={() => setIsVisible(false)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-black/10 rounded-full transition-colors sm:static sm:translate-y-0 sm:ml-auto md:ml-0"
                            aria-label="Close"
                        >
                            <X size={16} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
