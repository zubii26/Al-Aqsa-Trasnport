
'use client';

import { useState } from 'react';
import { Mail, RefreshCw, AlertCircle, CheckCircle, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function MarketingPage() {
    const [stats, setStats] = useState<{ processed: number; succeeded: number; failed: number } | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const runBatchProcessing = async () => {
        setLoading(true);
        setError('');
        setStats(null);

        try {
            const res = await fetch('/api/marketing/reviews/send-batch', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || 'Failed to run batch');

            setStats(data.stats);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 font-sans">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Marketing Automation</h1>
            <p className="text-slate-500 mb-8">Manage automated email campaigns and reputation.</p>

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
                            <RefreshCw size={16} />
                            <span>Status: <strong>Active (Manual Trigger)</strong></span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            onClick={runBatchProcessing}
                            disabled={loading}
                            className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:scale-[0.98] text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <RefreshCw className="animate-spin" /> Processing...
                                </>
                            ) : (
                                <>
                                    <Send size={18} /> Run Batch Now
                                </>
                            )}
                        </button>
                    </div>

                    {/* Stats Display */}
                    {stats && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-6 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl"
                        >
                            <h3 className="text-emerald-700 dark:text-emerald-400 font-bold mb-2 flex items-center gap-2">
                                <CheckCircle size={16} /> Batch Completed
                            </h3>
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                                    <div className="text-xs text-slate-500">Processed</div>
                                    <div className="font-bold text-slate-900 dark:text-white">{stats.processed}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                                    <div className="text-xs text-slate-500">Sent</div>
                                    <div className="font-bold text-emerald-600">{stats.succeeded}</div>
                                </div>
                                <div className="bg-white dark:bg-slate-800 p-2 rounded-lg">
                                    <div className="text-xs text-slate-500">Failed</div>
                                    <div className="font-bold text-red-500">{stats.failed}</div>
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

                {/* Placeholder: Abandoned Cart */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm opacity-60 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-500">
                        Coming Soon
                    </div>
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                <span className="bg-slate-200 dark:bg-slate-800 p-1.5 rounded-lg"><Mail className="w-5 h-5 text-slate-500" /></span>
                                Abandoned Cart Recovery
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                Recover lost bookings by emailing users who dropped off.
                            </p>
                        </div>
                    </div>
                    <div className="h-32 bg-slate-50 dark:bg-slate-800/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-slate-400 text-sm">
                        Configuration Locked
                    </div>
                </div>
            </div>
        </div>
    );
}
