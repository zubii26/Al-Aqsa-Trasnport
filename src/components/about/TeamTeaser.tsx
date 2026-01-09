'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Shield, CheckCircle } from 'lucide-react';

interface TeamTeaserProps {
    drivers?: any[];
}

export default function TeamTeaser() {
    return (
        <section className="py-20 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 text-center">
                <span className="text-amber-500 font-bold uppercase tracking-wider text-sm mb-2 block">Our Ambassadors</span>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6 font-playfair">
                    Dedicated Professionals at Your Service
                </h2>
                <p className="max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                    We take pride in our team of <strong>licensed, multilingual, and respectful professionals</strong> who ensure your journey is safe and comfortable.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                    <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        <Shield className="text-amber-500" size={32} />
                        <span className="font-bold">Verified & Vetted</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        <CheckCircle className="text-green-500" size={32} />
                        <span className="font-bold">Multilingual Experts</span>
                    </div>
                    <div className="flex flex-col items-center gap-3 p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                        <CheckCircle className="text-green-500" size={32} />
                        <span className="font-bold">Route Specialists</span>
                    </div>
                </div>

                <Link
                    href="/about"
                    className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors shadow-lg"
                >
                    Learn More About Us <ArrowRight size={20} />
                </Link>
            </div>
        </section>
    );
}
