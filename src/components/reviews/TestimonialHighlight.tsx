'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, MapPin, ExternalLink } from 'lucide-react';
import { curatedTestimonials } from '@/data/testimonials';

export default function TestimonialHighlight() {
    return (
        <section className="py-20 bg-secondary/10 dark:bg-slate-900/50 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl -mr-48 -mb-48" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-secondary dark:text-secondary font-bold tracking-wider uppercase text-sm">Pilgrim Stories</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2 ">
                        Journeys of Faith & Comfort
                    </h2>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {curatedTestimonials.map((testimonial, idx) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 relative group hover:-translate-y-2 transition-transform duration-300"
                        >
                            <Quote size={40} className="text-secondary/20 absolute top-8 right-8 group-hover:text-secondary/40 transition-colors" />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                                "{testimonial.title}"
                            </h3>

                            <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed italic">
                                "{testimonial.story}"
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {testimonial.tags.map(tag => (
                                    <span key={tag} className="px-3 py-1 bg-secondary/10 dark:bg-secondary/20 text-secondary dark:text-amber-400 text-xs rounded-full font-medium">
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                        <MapPin size={10} /> {testimonial.origin}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs font-semibold text-slate-900 dark:text-white">{testimonial.trip}</div>
                                    <div className="text-[10px] text-slate-500">{testimonial.date}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Google Business Profile link — verified reviews only */}
                <div className="text-center mt-12">
                    <a
                        href="https://www.google.com/maps?cid=13304906274217460428"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-secondary dark:hover:text-amber-400 transition-colors underline underline-offset-4"
                    >
                        Read verified reviews on Google
                        <ExternalLink size={13} />
                    </a>
                </div>
            </div>
            {/* Review JSON-LD removed — self-serving reviews ineligible for rich results */}
        </section>
    );
}
