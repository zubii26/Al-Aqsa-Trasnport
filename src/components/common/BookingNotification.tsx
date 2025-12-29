'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Car, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NotificationBooking {
    id: string;
    name: string;
    city: string;
    country: string;
    vehicle: string;
    action?: string;
    time: string;
}

export default function BookingNotification() {
    const [bookings, setBookings] = useState<NotificationBooking[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false); // If user closes, stop showing
    const pathname = usePathname();

    // Fetch bookings on mount and polling
    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings/recent');
                const data = await res.json();
                if (data.bookings && data.bookings.length > 0) {
                    setBookings(data.bookings);
                }
            } catch (error) {
                console.error("Failed to fetch recent bookings", error);
            }
        };

        fetchBookings();
        const interval = setInterval(fetchBookings, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Visibility Loop
    useEffect(() => {
        if (hasInteracted || bookings.length === 0) return;

        let timer: NodeJS.Timeout;

        if (isVisible) {
            // If visible, hide after 6 seconds
            timer = setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        } else {
            // If hidden, wait 2 minutes then show next
            // Initial load delay is handled by the fact that isVisible starts as false
            // But we want a shorter delay for the VERY FIRST appearance?
            // The previous code had a 5s initial delay. 
            // We can check if currentIndex is 0 and we haven't shown yet? 
            // Let's just use a standard standard logic:
            // If it's the very first time (currentIndex 0, not visible), maybe we want it sooner?
            // The user said "again show this to 2 mints". 
            // Let's start with a 5s delay for the first one, then 2 mins for subsequent.

            const delay = currentIndex === 0 && !isVisible ? 5000 : 120000;
            // Note: currentIndex changes when we show the NEXT one. 
            // We need to be careful. 
            // Let's use a separate 'isFirstLoad' state or just rely on the 2 mins for subsequent.

            // To match previous behavior of 5s start:
            // We can just set the delay based on the fact we just started?
            // No, simplified:

            timer = setTimeout(() => {
                // If we are showing the first one, we don't increment yet?
                // Or we increment when we show?
                // The state is simple: 
                // Hidden -> Wait -> Show -> Visible -> Wait -> Hide -> Hidden

                // If we want the first one to appear quickly:
                // We'll leave the logic simple.

                setCurrentIndex((prev) => (prev + 1) % bookings.length);
                setIsVisible(true);
            }, 120000); // 2 minutes
        }

        return () => clearTimeout(timer);
    }, [isVisible, hasInteracted, bookings.length]); // Removed currentIndex dependency to avoid double triggers, but we need it for set? No, setter uses callback. 

    // Special initial trigger
    useEffect(() => {
        if (bookings.length > 0 && !hasInteracted && !isVisible) {
            const timer = setTimeout(() => {
                setIsVisible(true);
            }, 5000);
            return () => clearTimeout(timer);
        }
        // This effect only runs once when bookings load
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookings.length]);


    // Hide on booking page
    if (pathname === '/booking' || hasInteracted || bookings.length === 0) return null;

    const booking = bookings[currentIndex];

    // Fallback if booking array updates and index is out of bounds
    if (!booking) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: -50, y: 50 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-24 left-4 z-50 max-w-sm w-[calc(100%-2rem)] md:w-auto"
                >
                    <div className="glass-card bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-amber-500/20 p-4 rounded-2xl shadow-2xl shadow-amber-500/5 relative overflow-hidden">
                        {/* Decorative glow */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/10 rounded-full blur-2xl -mr-8 -mt-8" />

                        <button
                            onClick={() => {
                                setIsVisible(false);
                                setHasInteracted(true);
                            }}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        >
                            <X size={14} />
                        </button>

                        <div className="flex items-start gap-4 pr-6">
                            <div className="flex-shrink-0">
                                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <CheckCircle2 size={20} className="text-green-600 dark:text-green-400" />
                                </div>
                            </div>

                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                                    <span className="font-bold">{booking.name}</span> <span className="text-xs font-normal opacity-80">from {booking.city}</span>
                                </p>
                                <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500 dark:text-slate-400">
                                    <Car size={12} className="text-amber-500" />
                                    <span>{booking.action || "Just booked"} </span>
                                    <span className="font-semibold text-slate-700 dark:text-slate-300">{booking.vehicle}</span>
                                </div>
                                <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                                    <MapPin size={10} />
                                    <span>{booking.country}</span>
                                    <span className="mx-1">•</span>
                                    <span>{booking.time}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
