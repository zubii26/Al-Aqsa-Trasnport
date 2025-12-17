'use client';

import React from 'react';
import { ShieldCheck, Clock, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import FadeIn from '@/components/common/FadeIn';

const amenities = [
    {
        title: "Officially Licensed",
        description: "Fully licensed by the Ministry of Transport for Umrah & Hajj services.",
        icon: <ShieldCheck className="w-8 h-8 text-amber-500" />
    },
    {
        title: "24/7 Customer Support",
        description: "Round-the-clock assistance for all your travel needs and inquiries.",
        icon: <Clock className="w-8 h-8 text-amber-500" />
    },
    {
        title: "Experienced Drivers",
        description: "Professional drivers with deep knowledge of Makkah & Madinah routes.",
        icon: <Award className="w-8 h-8 text-amber-500" />
    },
    {
        title: "Punctuality Guaranteed",
        description: "On-time pickups and drop-offs to ensure your peace of mind.",
        icon: <HeartHandshake className="w-8 h-8 text-amber-500" />
    }
];

export default function TrustAmenities() {
    return (
        <section className="py-16 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <FadeIn>
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
                            Why Choose Al Aqsa Transport?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                            We are committed to providing a safe, reliable, and spiritually uplifting journey for all guests of Allah.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {amenities.map((item, index) => (
                        <FadeIn key={index} delay={index * 0.1}>
                            <motion.div
                                whileHover={{ y: -5 }}
                                className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700/50 h-full flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-full">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                                    {item.description}
                                </p>
                            </motion.div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
