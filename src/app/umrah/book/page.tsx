'use client';

import React, { Suspense } from 'react';
import BookingWizard from '@/components/booking/BookingWizard';
import { motion } from 'framer-motion';

export default function BookPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Minimalist Hero for Booking */}
            <div className="relative bg-slate-900 py-12 md:py-20 overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/30 via-transparent to-transparent blur-3xl" />
                </div>

                <div className="container relative z-10 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                    >
                        Book Your <span className="text-amber-500">Blessed</span> Journey
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg max-w-xl mx-auto"
                    >
                        Secure your premium transport in Makkah & Madinah with our easy 4-step wizard.
                    </motion.p>
                </div>
            </div>

            <div className="container relative z-20 -mt-10 md:-mt-16 pb-20">
                <Suspense fallback={<div className="h-96 w-full animate-pulse bg-white rounded-3xl" />}>
                    <BookingWizard />
                </Suspense>
            </div>
        </main>
    );
}
