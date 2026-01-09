'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Car, ArrowRight, ShieldCheck, MousePointerClick } from 'lucide-react';
import Link from 'next/link';

const STEPS = [
    {
        id: 1,
        title: "Search & Schedule",
        description: "Enter your pickup location and schedule. Our smart system instantly routes your journey.",
        icon: MapPin,
        delay: 0.1
    },
    {
        id: 2,
        title: "Select VIP Vehicle",
        description: "Choose from our premium GMC Yukon or Family Staria fleet. Transparent pricing, no hidden costs.",
        icon: Car,
        delay: 0.2
    },
    {
        id: 3,
        title: "Instant Confirmation",
        description: "Receive immediate booking confirmation. Pay securely upon arrival with our trusted service.",
        icon: ShieldCheck,
        delay: 0.3
    }
];

export default function BookingGuide() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-950 overflow-hidden relative">
            {/* Elegant Background Patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, #D4AF37 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/20 mb-6"
                    >
                        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        Simple & Professional
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight"
                    >
                        Your Journey in <br className="hidden md:block" />
                        <span className="relative inline-block">
                            <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600">3 Simple Steps</span>
                            <span className="absolute bottom-2 left-0 w-full h-3 bg-amber-500/20 -rotate-1 z-0 rounded-full blur-sm"></span>
                        </span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg leading-relaxed font-medium"
                    >
                        Experience the gold standard of Umrah transport. Streamlined for your comfort and peace of mind.
                    </motion.p>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative px-4">
                    {/* Connecting Dotted Line (Desktop) */}
                    <div className="hidden md:block absolute top-[60px] left-[15%] right-[15%] border-t-2 border-dashed border-slate-200 dark:border-slate-800 z-0"></div>

                    {STEPS.map((step, idx) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: step.delay }}
                            className="relative z-10 group"
                        >
                            <div className="flex flex-col items-center text-center">
                                {/* Simplified Icon Container - No Rotation */}
                                <div className="relative mb-6">
                                    <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-100 dark:border-slate-700 flex items-center justify-center relative z-10">
                                        <step.icon size={36} className="text-amber-500" />
                                    </div>

                                    {/* background glow */}
                                    <div className="absolute inset-0 bg-amber-500/20 blur-xl rounded-full -z-10 transform scale-75" />

                                    {/* Step Number Badge */}
                                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg flex items-center justify-center font-bold text-sm shadow-md z-20 border-2 border-white dark:border-slate-900">
                                        {step.id}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                    {step.title}
                                </h3>
                                <p className="text-slate-500 leading-relaxed max-w-[260px] mx-auto text-base">
                                    {step.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="mt-20 text-center"
                >
                    <Link
                        href="/booking"
                        className="inline-flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-6 rounded-2xl font-bold text-lg shadow-2xl shadow-slate-900/20 hover:shadow-amber-500/20 hover:-translate-y-1 transition-all group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/0 via-amber-500/10 to-amber-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        Book Your Ride Now
                        <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-6 text-sm font-medium text-slate-400 flex items-center justify-center gap-2">
                        <MousePointerClick size={16} className="text-amber-500" />
                        No prepayment required • Pay upon arrival
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
