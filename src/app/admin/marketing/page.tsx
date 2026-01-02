
'use client';

import { useState } from 'react';
import { Mail, RefreshCw, AlertCircle, CheckCircle, Send, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketingPage() {
    const [stats, setStats] = useState<{ processed: number; succeeded: number; failed: number, skipped?: number } | null>(null);
    const [loadingType, setLoadingType] = useState<string | null>(null);
    const [error, setError] = useState('');

    const runBatchProcessing = async (type: 'reviews' | 'abandoned-recovery') => {
        setLoadingType(type);
        setError('');
        setStats(null);

        const endpoint = type === 'reviews'
            ? '/api/marketing/reviews/send-batch'
            : '/api/marketing/abandoned-recovery/send-batch';

        try {
            const res = await fetch(endpoint, { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to run batch');

            // Different response structures for different endpoints, normalize if needed
            // Review Batch returns { stats: ... }
            // Recovery Batch returns { results: ... }
            setStats(type === 'reviews' ? data.stats : data.results);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingType(null);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-sans">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Marketing Automation</h1>
            <p className="text-slate-500 mb-8">Manage automated email campaigns and measure effectiveness.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Review Collection Card */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <Mail className="text-amber-500" />
                                Post-Trip Reviews
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Automatically ask customers for feedback 2 hours after their trip is completed.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span>Status: <strong>Active (Manual Trigger)</strong></span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => runBatchProcessing('reviews')}
                            disabled={!!loadingType}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingType === 'reviews' ? (
                                <>
                                    <RefreshCw className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Run Review Batch
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Abandoned Cart Recovery */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <div className="bg-rose-100 dark:bg-rose-900/30 p-1.5 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-rose-500" />
                                </div>
                                Abandoned Cart Recovery
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Recover lost bookings by emailing users who dropped off ({'>'} 15 mins inactive).
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 mb-6 border border-slate-100 dark:border-slate-700">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">Recovery Window</span>
                            <span className="font-bold text-slate-900 dark:text-white">15m - 24h</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={() => runBatchProcessing('abandoned-recovery')}
                            disabled={!!loadingType}
                            className="w-full py-3 bg-rose-500 hover:bg-rose-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingType === 'abandoned-recovery' ? (
                                <>
                                    <RefreshCw className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Run Recovery Batch
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Results Display */}
            {stats && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-lg"
                >
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <CheckCircle className="text-emerald-500" /> Batch Results
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                            <div className="text-xs text-slate-500 uppercase font-bold mb-1">Processed</div>
                            <div className="text-2xl font-black text-slate-900 dark:text-white">{stats.processed}</div>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-xl">
                            <div className="text-xs text-emerald-600 uppercase font-bold mb-1">Sent Successfully</div>
                            <div className="text-2xl font-black text-emerald-600">{stats.succeeded}</div>
                        </div>
                        <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl">
                            <div className="text-xs text-red-600 uppercase font-bold mb-1">Failed</div>
                            <div className="text-2xl font-black text-red-600">{stats.failed}</div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl">
                            <div className="text-xs text-blue-600 uppercase font-bold mb-1">Skipped (Converted)</div>
                            <div className="text-2xl font-black text-blue-600">{stats.skipped || 0}</div>
                        </div>
                    </div>
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2"
                >
                    <AlertCircle size={18} /> {error}
                </motion.div>
            )}
        </div>
    );
}
