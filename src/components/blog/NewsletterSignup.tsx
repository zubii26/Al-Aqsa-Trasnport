'use client';

import React, { useState } from 'react';
import FadeIn from '@/components/common/FadeIn';
import { Mail, CheckCircle, ArrowRight, Bell } from 'lucide-react';
import GlassCard from '@/components/ui/GlassCard';

export default function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setEmail('');
            } else {
                throw new Error(data.error || 'Failed to subscribe');
            }
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <section className="py-16 px-4 relative">
            <div className="container max-w-5xl mx-auto">
                <GlassCard className="relative overflow-hidden p-8 md:p-12 !bg-gradient-to-br !from-slate-900 !to-slate-800 !border-slate-700">

                    {/* Background Accents */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16">

                        {/* Text Content */}
                        <div className="flex-1 text-center md:text-left">
                            <FadeIn>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-500/20">
                                    <Bell size={14} />
                                    <span>Stay Updated</span>
                                </div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 font-playfair">
                                    Join Our Community of Pilgrims
                                </h2>
                                <p className="text-slate-300 text-lg leading-relaxed max-w-xl">
                                    Get exclusive travel tips, spiritual guides, and special offers for your Umrah journey delivered directly to your inbox.
                                </p>
                            </FadeIn>
                        </div>

                        {/* Form */}
                        <div className="w-full md:w-auto md:min-w-[400px]">
                            <FadeIn delay={0.2}>
                                {status === 'success' ? (
                                    <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-2xl p-6 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-400">
                                            <CheckCircle size={24} />
                                        </div>
                                        <h3 className="text-xl font-bold text-white mb-1">Subscribed!</h3>
                                        <p className="text-emerald-300/80 text-sm">Thank you for joining our newsletter.</p>
                                        <button
                                            onClick={() => setStatus('idle')}
                                            className="mt-4 text-xs text-white/50 hover:text-white underline"
                                        >
                                            Subscribe another email
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                            <input
                                                type="email"
                                                required
                                                placeholder="Enter your email address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-950/50 border border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 outline-none transition-all"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={status === 'loading'}
                                            className="group bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-4 px-6 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                                        >
                                            {status === 'loading' ? (
                                                <div className="w-5 h-5 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    Subscribe to Newsletter
                                                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                        <p className="text-xs text-slate-500 text-center mt-2">
                                            We respect your privacy. Unsubscribe at any time.
                                        </p>
                                    </form>
                                )}
                            </FadeIn>
                        </div>
                    </div>
                </GlassCard>
            </div>
        </section>
    );
}
