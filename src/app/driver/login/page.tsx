'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, CarFront, Phone, Lock, ChevronRight } from 'lucide-react';

export default function DriverLoginPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Login failed');
            }

            if (data.user.role === 'driver') {
                router.push('/driver/dashboard');
            } else {
                setError('Access Denied: Driver account required.');
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-center px-6">
            <div className="w-full max-w-sm mx-auto space-y-8">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-amber-500/10 text-amber-500 mb-4 ring-1 ring-amber-500/30">
                        <CarFront size={40} />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Driver Login</h1>
                    <p className="text-slate-400">Welcome to Al Aqsa Transport</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Phone size={20} />
                            </div>
                            <input
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-11 rounded-xl bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500 py-4 text-lg"
                                placeholder="Phone or Email"
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500">
                                <Lock size={20} />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 rounded-xl bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-amber-500 focus:ring-amber-500 py-4 text-lg"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-4 rounded-xl text-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                Start Driving <ChevronRight size={20} />
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <p className="text-sm text-slate-500">
                        Need help? Contact <span className="text-amber-500">Operations</span>
                    </p>
                </div>
            </div>
        </div>
    );
}
