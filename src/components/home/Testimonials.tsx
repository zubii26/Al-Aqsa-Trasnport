'use client';

import React from 'react';
import { curatedTestimonials } from '@/data/testimonials';
import { Quote, Star, User } from 'lucide-react';
import FadeIn from '@/components/common/FadeIn';

export default function Testimonials() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl -ml-32 -mb-32" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <FadeIn>
                    <div className="text-center mb-16">
                        <span className="text-amber-600 dark:text-amber-500 font-bold tracking-widest uppercase text-sm mb-3 block">
                            Pilgrim Reviews
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                            What Our <span className="text-amber-600 dark:text-amber-500">Pilgrims Say</span>
                        </h2>
                        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
                            Real stories from brothers and sisters who trusted Al Aqsa Transport with their journey of a lifetime.
                        </p>
                    </div>
                </FadeIn>

                <div className="grid md:grid-cols-3 gap-8">
                    {curatedTestimonials.map((testimonial, index) => (
                        <FadeIn key={testimonial.id} delay={index * 0.1}>
                            <div className="h-full bg-white dark:bg-slate-800/50 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group">
                                <Quote className="absolute top-6 right-6 text-amber-500/10 group-hover:text-amber-500/20 transition-colors" size={48} />

                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className={`${i < testimonial.rating ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-600"}`}
                                        />
                                    ))}
                                </div>

                                <p className="text-slate-700 dark:text-slate-300 mb-8 leading-relaxed italic relative z-10">
                                    "{testimonial.story}"
                                </p>

                                <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-slate-700">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800 flex items-center justify-center text-amber-700 dark:text-amber-300 font-bold text-lg shrink-0">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900 dark:text-white">
                                            {testimonial.name}
                                        </div>
                                        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                            <span className="font-medium text-amber-600 dark:text-amber-500">{testimonial.origin}</span>
                                            <span className="text-slate-300">•</span>
                                            <span>{testimonial.trip}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FadeIn>
                    ))}
                </div>
            </div>
        </section>
    );
}
