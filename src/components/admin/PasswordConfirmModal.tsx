'use client';

import React, { useState } from 'react';
import { Lock, Loader2, X, AlertCircle } from 'lucide-react';

interface PasswordConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void; // Called when password is valid
    title?: string;
    description?: string;
    actionLabel?: string;
}

export default function PasswordConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title = 'Security Verification',
    description = 'Please enter your password to confirm this action.',
    actionLabel = 'Confirm & Save'
}: PasswordConfirmModalProps) {
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/verify-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });

            const data = await res.json();

            if (data.success) {
                onConfirm(); // Success!
                setPassword(''); // Clear for next time
            } else {
                setError(data.error || 'Invalid password');
            }
        } catch (err) {
            console.error('Verification error:', err);
            setError('Verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-slate-800 dark:text-white font-semibold">
                        <Lock className="w-5 h-5 text-amber-500" />
                        {title}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                        {description}
                    </p>

                    <div className="space-y-2">
                        <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:text-white"
                            placeholder="Enter your admin password"
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !password}
                            className="flex-1 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : null}
                            {actionLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
