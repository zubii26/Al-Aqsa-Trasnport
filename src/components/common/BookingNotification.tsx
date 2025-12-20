'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, MapPin, Car, X } from 'lucide-react';

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

    useEffect(() => {
        if (bookings.length === 0) return;

        // Initial delay before starting the cycle
        const initialTimer = setTimeout(() => {
            if (!hasInteracted) setIsVisible(true);
        }, 5000); // Start 5 seconds after load

        return () => clearTimeout(initialTimer);
    }, [hasInteracted, bookings]);

    useEffect(() => {
        if (!isVisible || hasInteracted || bookings.length === 0) return;

        // Hide notification after 6 seconds
        const hideTimer = setTimeout(() => {
            setIsVisible(false);
        }, 6000);

        // Show next notification after a random interval (15-30 seconds)
        const nextTimer = setTimeout(() => {
            if (!hasInteracted) {
                setCurrentIndex((prev) => (prev + 1) % bookings.length);
                setIsVisible(true);
            }
        }, Math.random() * (30000 - 15000) + 15000 + 6000);

        return () => {
            clearTimeout(hideTimer);
            clearTimeout(nextTimer);
        };
    }, [isVisible, hasInteracted, bookings]);

    if (hasInteracted || bookings.length === 0) return null;

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
