'use client';

import React from 'react';
import { Quote, Star, MapPin, ExternalLink } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import FadeIn from '@/components/common/FadeIn';
import { curatedTestimonials } from '@/data/testimonials';

// ─── Google Business Profile review URL ──────────────────────
// Derived from cid=13304906274217460428 (present in the footer map link).
// This links directly to the GBP listing where verified reviews are collected.
const GBP_REVIEWS_URL = 'https://www.google.com/maps?cid=13304906274217460428';

export default function PilgrimVoices() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <FadeIn animate direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                            Pilgrim Voices
                        </h2>
                    </FadeIn>
                    <FadeIn animate direction="up" delay={0.1}>
                        <p className="text-lg text-slate-600 dark:text-slate-300">
                            Hear from those who have journeyed with us.
                        </p>
                    </FadeIn>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {curatedTestimonials.map((item, index) => (
                        <GlassCard
                            key={item.id}
                            className={`p-8 relative h-full flex flex-col`}
                            delay={index * 0.2}
                        >
                            <Quote size={40} className="text-secondary/20 absolute top-6 right-6" />

                            <div className="flex gap-1 mb-4">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                                &ldquo;{item.title}&rdquo;
                            </h3>

                            <p className="text-slate-700 dark:text-slate-300 italic mb-6 relative z-10 flex-grow">
                                &ldquo;{item.story}&rdquo;
                            </p>

                            <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{item.name}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <MapPin size={10} /> {item.origin}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{item.trip}</div>
                                    <div className="text-[10px] text-slate-500">{item.date}</div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>

                {/* Google Business Profile link — verified reviews only */}
                <div className="text-center mt-12">
                    <a
                        href={GBP_REVIEWS_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-secondary dark:hover:text-amber-400 transition-colors underline underline-offset-4"
                    >
                        Read verified reviews on Google
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
        </section>
    );
}
