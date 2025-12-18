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

const Confetti = () => {
    const [particles, setParticles] = useState<number[]>([]);

    useEffect(() => {
        setParticles(Array.from({ length: 40 }, (_, i) => i));
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((i) => (
                <motion.div
                    key={i}
                    initial={{ y: -20, rotate: 0, opacity: 0 }}
                    animate={{
                        y: ['0vh', '15vh'],
                        rotate: [0, 360],
                        opacity: [1, 1, 0],
                        x: [0, (Math.random() - 0.5) * 50] // Scatter
                    }}
                    transition={{
                        duration: 2 + Math.random() * 3,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                        ease: "linear",
                        repeatDelay: Math.random() * 2
                    }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#fff', '#FFD700', '#d4af37', '#fcd34d'][Math.floor(Math.random() * 4)],
                        top: -10,
                        boxShadow: '0 0 4px rgba(212, 175, 55, 0.4)'
                    }}
                />
            ))}
        </div>
    );
};

export default function AnnouncementBanner({ discount }: AnnouncementBannerProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);

    // Calculate time left (Logic unchanged)
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

    if (!isVisible || !discount.enabled) return null;

    // Date checks (Logic unchanged)
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
                    // Refined Gold Gradient using #d4af37
                    className="relative overflow-hidden bg-[linear-gradient(90deg,#b4941f_0%,#d4af37_50%,#b4941f_100%)] shadow-2xl z-50 border-b border-[#ffe5b4]"
                >
                    <Confetti />

                    {/* Pattern Overlay */}
                    <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.2) 1px, transparent 0)', backgroundSize: '20px 20px' }}></div>

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shimmer" />

                    <div className="container mx-auto px-4 py-3 relative z-10">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-3 md:gap-8">

                            {/* Offer Text */}
                            <div className="flex items-center gap-4 text-center md:text-left">
                                <div className="hidden md:flex bg-slate-900 text-[#d4af37] p-2.5 rounded-xl shadow-lg transform rotate-3 ring-2 ring-[#d4af37]/50">
                                    <Percent size={20} className="stroke-[3]" />
                                </div>
                                <div className="flex flex-col items-center md:items-start">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-slate-900/90 border border-[#d4af37]/30 shadow-md">
                                            <Sparkles size={12} className="text-[#d4af37] animate-pulse" />
                                            <span className="text-[#d4af37] text-[10px] font-bold tracking-widest uppercase leading-none pt-0.5">Exciting Offer</span>
                                        </div>
                                    </div>
                                    <p className="text-slate-900 font-bold text-sm md:text-base leading-tight drop-shadow-sm">
                                        Get <span className="inline-block bg-slate-900 text-[#d4af37] px-2 py-0.5 rounded-md font-extrabold text-lg mx-1 shadow-md transform -skew-x-6 border border-[#d4af37]/50">
                                            {discount.type === 'percentage' ? `${discount.value}% OFF` : `${discount.value} SAR OFF`}
                                        </span>
                                        on your first ride
                                    </p>
                                </div>
                            </div>

                            {/* Countdown Timer */}
                            {timeLeft && (
                                <div className="flex items-center gap-4 bg-slate-900/10 backdrop-blur-sm px-5 py-2 rounded-xl border border-slate-900/10 shadow-inner">
                                    <div className="flex items-center gap-2 text-slate-900 text-xs font-bold uppercase tracking-wider border-r border-slate-900/20 pr-4 mr-1">
                                        <Clock size={16} className="text-slate-900" />
                                        <span>Ends In</span>
                                    </div>
                                    <div className="flex gap-3 text-center">
                                        {[
                                            { value: timeLeft.days, label: 'D' },
                                            { value: timeLeft.hours, label: 'H' },
                                            { value: timeLeft.minutes, label: 'M' },
                                            { value: timeLeft.seconds, label: 'S' }
                                        ].map((item, idx, arr) => (
                                            <React.Fragment key={item.label}>
                                                <div className="flex flex-col min-w-[32px]">
                                                    <span className="text-slate-900 font-black text-xl leading-none tabular-nums tracking-tight font-mono">
                                                        {String(item.value).padStart(2, '0')}
                                                    </span>
                                                    <span className="text-[10px] text-slate-800 font-bold uppercase tracking-wider mt-0.5">{item.label}</span>
                                                </div>
                                                {idx < arr.length - 1 && (
                                                    <span className="text-slate-900/40 font-bold text-lg relative -top-1">:</span>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute right-2 top-2 md:relative md:right-auto md:top-auto p-1.5 text-slate-700 hover:text-slate-900 hover:bg-slate-900/10 rounded-full transition-all duration-300"
                                aria-label="Close announcement"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
