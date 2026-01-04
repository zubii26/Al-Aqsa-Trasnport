'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Wallet, ChevronLeft, ArrowRight, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConfirmStepProps {
    data: any;
    onBack: () => void;
}

export default function ConfirmStep({ data, onBack }: ConfirmStepProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSummary = async () => {
            setIsLoading(true);
            try {
                // 1. Fetch Wallet
                const walletRes = await fetch('/api/agency/wallet');
                if (walletRes.ok) {
                    const walletData = await walletRes.json();
                    setWallet(walletData);
                }

                // 2. Fetch Quote
                const quoteRes = await fetch('/api/agency/bookings/quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        routeId: data.routeId,
                        vehicles: data.vehicles
                    })
                });

                if (quoteRes.ok) {
                    const quoteData = await quoteRes.json();
                    setSummary(quoteData);
                } else {
                    const errData = await quoteRes.json();
                    setError(errData.error || 'Failed to calculate quote');
                }
            } catch (err) {
                console.error(err);
                setError('Failed to load booking summary');
            } finally {
                setIsLoading(false);
            }
        };
        fetchSummary();
    }, [data.routeId, data.vehicles]);

    const handleSubmit = async () => {
        if (!summary) return;

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/agency/bookings/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await res.json();

            if (res.ok) {
                router.push(`/agency/bookings?groupId=${result.groupId}&success=true`);
            } else {
                setError(result.error || 'Failed to process bulk booking');
            }
        } catch (err) {
            setError('A network error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const totalVehicles = data.vehicles.reduce((acc: number, v: any) => acc + (v.count || 0), 0);
    // Logic: Cost must be <= Available (Limit + Balance)
    const insufficientCredit = wallet && summary && (summary.totalCost > (wallet.creditLimit + wallet.balance));

    return (
        <div className="space-y-8 text-center md:text-left">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Review & Confirm</h2>
                    <p className="text-slate-500 mt-1">Verify details before deducting from credit limit.</p>
                </div>
                <button type="button" onClick={onBack} className="text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1 font-bold text-sm">
                    <ChevronLeft size={18} /> Back
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Summary Card */}
                <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                    <div className="flex justify-between items-center text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-200 dark:border-slate-700 pb-3">
                        <span>Booking Summary</span>
                        <span>{totalVehicles} Vehicles</span>
                    </div>

                    <div className="space-y-4">
                        {summary?.details.map((v: any, i: number) => (
                            <div key={i} className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-900 dark:text-white font-bold">{v.type}</p>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">SAR {v.unitPrice.toLocaleString()} per unit</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-900 dark:text-white font-black">SAR {v.total.toLocaleString()}</p>
                                    <p className="text-[10px] text-slate-400 font-bold">Qty: {v.count}</p>
                                </div>
                            </div>
                        ))}

                        {!summary && !error && (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl" />
                                <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded-xl w-3/4" />
                            </div>
                        )}
                    </div>

                    {summary && (
                        <div className="pt-4 border-t-2 border-dashed border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-black text-slate-500 uppercase tracking-wider">Total Est. Cost</span>
                                <span className="text-2xl font-black text-blue-600">SAR {summary.totalCost.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-500">Scheduled for</span>
                            <span className="text-sm font-black text-slate-900 dark:text-white">{data.date} @ {data.time}</span>
                        </div>
                    </div>
                </div>

                {/* Wallet / Credit Card */}
                <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-100 dark:border-blue-800 space-y-4 relative overflow-hidden">
                    <Wallet className="absolute -right-4 -bottom-4 text-blue-500/10 w-32 h-32 rotate-12" />

                    <div className="flex justify-between items-center text-xs font-black text-blue-400 uppercase tracking-[0.2em] border-b border-blue-100 dark:border-blue-800/50 pb-3">
                        <span>Agency Wallet</span>
                        <ShieldCheck size={16} />
                    </div>

                    {wallet ? (
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs font-bold text-blue-600/70 uppercase">Available Credit</p>
                                <p className={`text-3xl font-black ${insufficientCredit ? 'text-red-500' : 'text-slate-900 dark:text-white'}`}>
                                    SAR {(wallet.creditLimit + wallet.balance).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-900/50 p-3 rounded-xl flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                                <span>{wallet.balance >= 0 ? 'Your Funds' : 'Used'}: SAR {Math.abs(wallet.balance).toLocaleString()}</span>
                                <span>Limit: SAR {wallet.creditLimit.toLocaleString()}</span>
                            </div>

                            {insufficientCredit && (
                                <div className="p-3 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 rounded-xl text-[10px] font-bold flex items-center gap-2">
                                    <AlertTriangle size={14} />
                                    Booking exceeds your available funds.
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-24 animate-pulse bg-blue-100/50 dark:bg-blue-900/20 rounded-xl" />
                    )}
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800 rounded-2xl flex items-center gap-3 text-red-600 text-sm font-bold animate-shake">
                    <AlertTriangle size={20} />
                    {error}
                </div>
            )}

            <div className="pt-6">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading || !!error || insufficientCredit || !summary}
                    className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xl rounded-2xl shadow-xl shadow-blue-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                    {isLoading ? (
                        <Loader2 className="animate-spin" size={24} />
                    ) : (
                        <>
                            Confirm & Place Booking
                            <ArrowRight size={24} />
                        </>
                    )}
                </button>
                <p className="text-center text-xs text-slate-400 mt-4 font-bold uppercase tracking-widest">
                    Funds will be reserved from your credit limit immediately
                </p>
            </div>
        </div>
    );
}
