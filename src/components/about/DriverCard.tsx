'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Award, Shield, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface DriverProps {
    driver: {
        id: string;
        name: string;
        photo: string;
        experience: string;
        languages: string[];
        certifications: string[];
        rating: number;
        trips: string;
        quote: string;
        badges: string[];
    };
    index: number;
}

export default function DriverCard({ driver, index }: DriverProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all duration-300 group"
        >
            {/* Image Header */}
            <div className="relative h-64 overflow-hidden">
                <Image
                    src={driver.photo}
                    alt={driver.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold mb-1">{driver.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                        <Award size={14} className="text-amber-400" />
                        <span>{driver.experience} Experience</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {/* Stats Row */}
                <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                    <div className="text-center">
                        <div className="flex items-center gap-1 font-bold text-slate-900 dark:text-white">
                            <Star size={16} className="fill-amber-400 text-amber-400" />
                            {driver.rating}
                        </div>
                        <div className="text-xs text-slate-500">Rating</div>
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">{driver.trips}</div>
                        <div className="text-xs text-slate-500">Trips</div>
                    </div>
                    <div className="h-8 w-px bg-slate-100 dark:bg-slate-800" />
                    <div className="text-center">
                        <div className="font-bold text-slate-900 dark:text-white">{driver.languages.length}</div>
                        <div className="text-xs text-slate-500">Languages</div>
                    </div>
                </div>

                {/* Languages & Certs */}
                <div className="space-y-4 mb-6">
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Speaks</div>
                        <div className="flex flex-wrap gap-2">
                            {driver.languages.map(lang => (
                                <span key={lang} className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium">
                                    {lang}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Certified</div>
                        <div className="flex flex-wrap gap-2">
                            {driver.certifications.map(cert => (
                                <span key={cert} className="flex items-center gap-1 px-2 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded text-xs font-medium border border-amber-100 dark:border-amber-900/30">
                                    <Shield size={10} />
                                    {cert}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Quote */}
                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl relative mb-6">
                    <MessageCircle size={16} className="absolute top-4 left-4 text-slate-200 dark:text-slate-800 -scale-x-100" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 italic relative z-10 text-center">
                        "{driver.quote}"
                    </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                    {driver.badges.map(badge => (
                        <span key={badge} className="px-3 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-full text-xs font-bold shadow-sm">
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
