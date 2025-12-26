'use client';

import { Quote } from 'lucide-react';

export default function TrustSection() {
    return (
        <section className="py-20 bg-gradient-to-br from-amber-600 to-amber-700 dark:from-amber-800 dark:to-amber-900 text-white relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 opacity-10 bg-[url('/patterns/islamic-pattern.png')] bg-repeat" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-black/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-8">
                        <Quote size={32} className="text-white fill-white/50" />
                    </div>

                    <blockquote className="text-2xl md:text-4xl font-serif leading-relaxed mb-8 opacity-90 drop-shadow-sm italic">
                        &quot;Trust is the foundation of our service. We are honored to accompany you on your sacred journey, treating every mile as a promise kept.&quot;
                    </blockquote>

                    <cite className="block text-lg font-medium tracking-wide text-amber-100 not-italic">
                        — CEO, Al Aqsa Umrah Transport
                    </cite>
                </div>
            </div>
        </section>
    );
}
