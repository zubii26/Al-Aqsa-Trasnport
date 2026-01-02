'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, Building2, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AgencyLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: email, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Redirect to agency dashboard
            if (data.user.role === 'agency') {
                router.push('/agency/dashboard');
            } else {
                // Prevent regular users from logging in via Agency portal (optional, but good for UX)
                setError('Unauthorized: This portal is for Agencies only.');
                // Optionally force logout if strictly checking
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[30%] -right-[10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[100px]"></div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white mb-4 shadow-lg shadow-blue-500/20">
                        <Building2 size={32} />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">
                        Agency Partner Portal
                    </h2>
                    <p className="mt-2 text-sm text-slate-400">
                        Sign in to manage your B2B bookings
                    </p>
                </div>

                <div className="bg-slate-800/50 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-2xl sm:px-10 border border-slate-700/50">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 pl-1">Business Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full pl-10 appearance-none rounded-xl bg-slate-950/50 border border-slate-700 px-3 py-3.5 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="agent@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 pl-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full pl-10 appearance-none rounded-xl bg-slate-950/50 border border-slate-700 px-3 py-3.5 text-white placeholder-slate-500 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01]"
                            >
                                {isLoading ? (
                                    <Loader2 className="animate-spin h-5 w-5" />
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Sign In
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-500">
                            Don't have an agency account?{' '}
                            <Link href="/agency/register" className="font-medium text-blue-400 hover:text-blue-300">
                                Apply now
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
