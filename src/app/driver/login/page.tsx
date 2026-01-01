'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Car, Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

export default function DriverLogin() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: formData.email, password: formData.password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Verify role
            if (data.user?.role !== 'driver' && data.user?.role !== 'admin') {
                throw new Error('Access denied. Driver account required.');
            }

            router.push('/driver/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-64 h-64 bg-amber-500 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
            </div>

            <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="flex flex-col items-center mb-8">
                    <div className="bg-amber-500/20 p-4 rounded-full mb-4 ring-1 ring-amber-500/50">
                        <Car className="text-amber-500 w-10 h-10" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Driver Portal</h1>
                    <p className="text-slate-400 text-sm">Al Aqsa Transport</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email or Phone</label>
                        <input
                            type="email"
                            required
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                            placeholder="driver@alaqsa.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full bg-slate-950/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : 'Log In'}
                    </button>
                </form>

                <div className="mt-8 text-center space-y-4">
                    <p className="text-slate-500 text-xs">
                        Need help? Contact Dispatch
                    </p>

                    <div className="pt-4 border-t border-white/10">
                        <p className="text-slate-400 text-sm mb-3">Get easier access:</p>
                        <div className="flex gap-2 justify-center">
                            <button
                                onClick={() => alert("On iPhone/Safari: Tap the Share button (box with arrow) → Scroll down → Tap 'Add to Home Screen'")}
                                className="px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
                            >
                                📱 Install on iPhone
                            </button>
                            <button
                                onClick={() => alert("On Android/Chrome: Tap the Menu icon (⋮) → Tap 'Install App' or 'Add to Home Screen'")}
                                className="px-3 py-2 bg-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all"
                            >
                                🤖 Install on Android
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
