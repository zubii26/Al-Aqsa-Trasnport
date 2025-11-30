'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
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
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    console.log('Rendering LoginPage');

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Back to Home Button */}
            <Link
                href="/"
                className="absolute top-6 left-6 z-50 flex items-center gap-2 text-slate-400 hover:text-amber-500 transition-colors group"
            >
                <div className="p-2 rounded-full bg-slate-900/50 border border-slate-800 group-hover:border-amber-500/50 transition-colors">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                </div>
                <span className="font-medium text-sm">Back to Home</span>
            </Link>
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/images/contact-hero.jpg"
                    alt="Background"
                    fill
                    className="object-cover opacity-40"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950/90 backdrop-blur-[2px]"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] animate-pulse-slow"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>

            <div className="w-full max-w-md relative z-10 p-6">
                <div className="bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 overflow-hidden ring-1 ring-white/5 transition-all duration-500 hover:shadow-amber-500/10 hover:border-white/20">
                    {/* Top Accent Line */}
                    <div className="h-1 w-full bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>

                    <div className="p-8">
                        <div className="text-center mb-10">
                            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-black/50 border border-white/5 group">
                                <Lock className="text-amber-500 group-hover:scale-110 transition-transform duration-300" size={32} />
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight font-playfair">Welcome Back</h1>
                            <p className="text-slate-400 text-sm">Sign in to manage Al Aqsa Transport</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                                <AlertCircle size={18} className="shrink-0" />
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner"
                                        placeholder="admin@alaqsa.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-slate-400 ml-1 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-amber-500 transition-colors" size={20} />
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-xl border border-slate-800 bg-slate-950/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all shadow-inner"
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-4 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:-translate-y-0.5 hover:shadow-amber-500/30 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-6 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin relative z-10" />
                                        <span className="relative z-10">Signing in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="relative z-10">Sign In to Dashboard</span>
                                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform relative z-10" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                    <div className="bg-slate-950/30 p-4 text-center text-xs text-slate-500 border-t border-white/5 backdrop-blur-sm">
                        <p>Protected by <span className="text-amber-500/80">Secure RBAC System</span></p>
                    </div>
                </div>

                <div className="text-center mt-8 text-slate-500 text-xs">
                    &copy; {new Date().getFullYear()} Al Aqsa Umrah Transport. All rights reserved.
                </div>
            </div>
        </div>
    );
}
