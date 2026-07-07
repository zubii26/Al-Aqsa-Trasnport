'use client';

import React from 'react';
import { Quote } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';
import FadeIn from '@/components/common/FadeIn';

export default function PilgrimVoices() {
    const testimonials = [
        { id: 1, author: "Ahmed Al-Sayed", location: "Egypt", text: "Al Aqsa Transport made our Umrah journey so smooth. The driver was punctual and very polite. Highly recommended!" },
        { id: 2, author: "Fatima Khan", location: "Pakistan", text: "Excellent service! The car was clean and comfortable. Will definitely book again for my next trip." },
        { id: 3, author: "Yusuf Rahman", location: "Indonesia", text: "Very professional team. They handled our group transport perfectly. Thank you for the great experience." },
    ];

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
                    {testimonials.map((item, index) => (
                        <GlassCard
                            key={item.id}
                            className={`p-8 relative h-full flex flex-col`}
                            delay={index * 0.2}
                        >
                            <Quote size={40} className="text-secondary/20 absolute top-6 right-6" />

                            <p className="text-slate-700 dark:text-slate-300 italic mb-6 relative z-10 flex-grow">
                                &quot;{item.text}&quot;
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xl font-bold text-slate-500 dark:text-slate-400">
                                    {item.author.charAt(0)}
                                </div>
                                <div>
                                    <div className="font-bold text-slate-900 dark:text-white">{item.author}</div>
                                    <div className="text-sm text-slate-500 dark:text-slate-400">{item.location}</div>
                                </div>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </section>
    );
}
