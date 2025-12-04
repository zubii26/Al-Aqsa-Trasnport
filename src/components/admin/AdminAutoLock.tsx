'use client';

import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

export default function AdminAutoLock() {
    const [isLocked, setIsLocked] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setIsLocked(true);
            }
        };

        const handleBlur = () => {
            setIsLocked(true);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('blur', handleBlur);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('blur', handleBlur);
        };
    }, []);

    const handleUnlock = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                setIsLocked(false);
                setPassword('');
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    if (!isLocked) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-background/95 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl p-8 max-w-md w-full text-center space-y-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Lock className="w-8 h-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Admin Panel Locked</h2>
                    <p className="text-muted-foreground">Please enter your password to unlock</p>
                </div>

                <form onSubmit={handleUnlock} className="space-y-4">
                    <div className="space-y-2">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                            autoFocus
                        />
                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Unlocking...' : 'Unlock'}
                    </button>
                </form>
            </div>
        </div>
    );
}
