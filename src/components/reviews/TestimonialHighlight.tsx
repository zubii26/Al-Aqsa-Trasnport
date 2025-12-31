'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Quote, Star, MapPin } from 'lucide-react';
import { curatedTestimonials } from '@/data/testimonials';

export default function TestimonialHighlight() {
    return (
        <section className="py-20 bg-amber-50 dark:bg-slate-900/50 overflow-hidden relative">
            {/* Background Pattern */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl -ml-32 -mt-32" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl -mr-48 -mb-48" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <span className="text-amber-600 dark:text-amber-500 font-bold tracking-wider uppercase text-sm">Pilgrim Stories</span>
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mt-2 font-playfair">
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
                            <Quote size={40} className="text-amber-500/20 absolute top-8 right-8 group-hover:text-amber-500/40 transition-colors" />

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
                                    <span key={tag} className="px-3 py-1 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 text-xs rounded-full font-medium">
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
            </div>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "TransportationService",
                        "name": "Al Aqsa Umrah Transport",
                        "review": curatedTestimonials.map(t => ({
                            "@type": "Review",
                            "author": { "@type": "Person", "name": t.name },
                            "datePublished": "2024-12-01", // Approximate
                            "reviewBody": t.story,
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": t.rating,
                                "bestRating": "5"
                            }
                        }))
                    })
                }}
            />
        </section>
    );
}
