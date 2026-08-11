'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        // Redirect to home page if the user refreshes the login page
        const navigationEntries = performance.getEntriesByType('navigation');
        if (navigationEntries.length > 0) {
            const navEntry = navigationEntries[0] as PerformanceNavigationTiming;
            if (navEntry.type === 'reload') {
                router.push('/');
            }
        }
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password }),
            });

            const data = await res.json();

            if (data.success) {
                router.push('/admin');
                router.refresh();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex bg-[#0A192F]">
            
            {/* LEFT PANE - BRANDING & IMAGERY (Desktop Only) */}
            <div className="hidden lg:flex w-1/2 relative bg-[#0A192F] items-center justify-center overflow-hidden border-r border-white/5">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/contact-hero.webp"
                        alt="Al Aqsa Transport Fleet"
                        fill
                        className="object-cover opacity-40 grayscale-[0.2]"
                        priority
                    />
                    {/* Deep gradient overlay as per DESIGN.md for hero text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-[#0A192F]/20"></div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow"></div>

                {/* Brand Content */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center px-12 max-w-xl">
                    <div className="w-20 h-20 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center mb-10 shadow-2xl shadow-black/50 border border-white/10 ring-1 ring-white/5">
                        <Lock className="text-[#D4AF37]" size={36} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-4xl xl:text-5xl font-bold text-white mb-4 tracking-tight drop-shadow-md">
                        Al Aqsa <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#AA771C]">Transport</span>
                    </h1>
                    <h2 className="text-2xl xl:text-3xl text-[#D4AF37] mb-8 font-[family-name:var(--font-reem-kufi)] font-bold tracking-wide drop-shadow-sm">
                        الأقصى لنقل المعتمرين
                    </h2>
                    <p className="text-slate-300/90 text-lg leading-relaxed border-t border-white/10 pt-8 mt-2">
                        Premium, trustworthy, and specialized transport services for Umrah pilgrims across Saudi Arabia.
                    </p>
                </div>
            </div>

            {/* RIGHT PANE - LOGIN FORM */}
            <div className="w-full lg:w-1/2 relative flex items-center justify-center p-6 sm:p-12 bg-[#0A192F]">
                
                {/* Background Elements for Right Pane (Mobile especially) */}
                <div className="absolute inset-0 z-0 lg:hidden">
                    <Image
                        src="/images/contact-hero.webp"
                        alt="Background"
                        fill
                        className="object-cover opacity-20"
                        priority
                    />
                    <div className="absolute inset-0 bg-[#0A192F]/90 backdrop-blur-sm"></div>
                </div>

                <div className="w-full max-w-[420px] relative z-10 flex flex-col justify-center min-h-[500px]">
                    
                    {/* Back to Home Button - Placed in flow to prevent overlap */}
                    <div className="mb-10 flex justify-center lg:justify-start">
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2.5 text-slate-400 hover:text-[#D4AF37] transition-all group"
                        >
                            <div className="p-2 rounded-full bg-white/5 border border-white/5 group-hover:bg-[#D4AF37]/10 group-hover:border-[#D4AF37]/30 transition-all backdrop-blur-md">
                                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                            </div>
                            <span className="font-semibold text-sm tracking-wide">Return Home</span>
                        </Link>
                    </div>

                    <div className="text-center mb-10 lg:text-left">
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Admin Portal</h2>
                        <p className="text-slate-400 text-sm leading-relaxed">Authenticate to manage your dashboard, fleet, and operations.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={18} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-[0.08em]">
                                Email Address
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all shadow-inner backdrop-blur-sm"
                                    placeholder="admin@alaqsa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2.5">
                            <label className="text-xs font-semibold text-slate-300 ml-1 uppercase tracking-[0.08em]">
                                Password
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#D4AF37] transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-slate-900/60 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] focus:border-[#D4AF37] transition-all shadow-inner backdrop-blur-sm"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B4941F] text-[#0A192F] hover:from-[#E5C158] hover:to-[#D4AF37] font-bold py-4 rounded-xl shadow-[0_4px_14px_rgba(212,175,55,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(212,175,55,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8 group relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                            {loading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin relative z-10" />
                                    <span className="relative z-10">Authenticating...</span>
                                </>
                            ) : (
                                <>
                                    <span className="relative z-10">Sign In</span>
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-6 border-t border-white/5 text-center flex flex-col items-center justify-center gap-2">
                        <p className="text-xs text-slate-500">
                            Protected by <span className="text-[#D4AF37]/90 font-medium">Secure RBAC System</span>
                        </p>
                        <p className="text-slate-600 text-[11px]">
                            &copy; {new Date().getFullYear()} Al Aqsa Umrah Transport. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
