'use client';

import { useState, useEffect } from 'react';
import {
    Wallet, TrendingUp, TrendingDown, Clock,
    ArrowUpRight, ArrowDownLeft, AlertCircle, Loader2
} from 'lucide-react';

interface Transaction {
    _id: string;
    amount: number;
    type: 'DEBIT' | 'CREDIT';
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    description: string;
    referenceId: string;
    createdAt: string;
}

interface WalletData {
    balance: number;
    creditLimit: number;
    availableCredit: number;
    currency: string;
}

export default function AgencyWalletPage() {
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTopUpLoading, setIsTopUpLoading] = useState(false);
    const [topUpAmount, setTopUpAmount] = useState('');
    const [showTopUp, setShowTopUp] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTopUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsTopUpLoading(true);
        try {
            const res = await fetch('/api/agency/wallet/topup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount: Number(topUpAmount) })
            });

            if (res.ok) {
                setTopUpAmount('');
                setShowTopUp(false);
                fetchWallet(); // Refresh to show pending transaction
                // Could show success toast
            }
        } catch (error) {
            console.error('Top-up failed', error);
        } finally {
            setIsTopUpLoading(false);
        }
    };

    const fetchWallet = async () => {
        try {
            const res = await fetch('/api/agency/wallet');
            if (res.ok) {
                const data = await res.json();
                setWallet(data.wallet); // Check if data.wallet exists? The API returns object spread, not { wallet: ... }. API returns { balance, ... } directly??
                // Wait! In route.ts: return NextResponse.json({ balance: ..., transactions });
                // But in page.tsx: setWallet(data.wallet);
                // THIS IS THE BUG!
                // The API returns the wallet fields directly in the root of the JSON response (plus transactions).
                // It does NOT wrap them in a "wallet" property.
                setWallet({
                    balance: data.balance,
                    creditLimit: data.creditLimit,
                    availableCredit: data.availableCredit,
                    currency: data.currency
                });
                setTransactions(data.transactions || []);
            } else {
                setError(`Failed to load: ${res.statusText}`);
            }
        } catch (error: any) {
            console.error('Failed to load wallet', error);
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    // ... (rest of code)

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>;
    }

    if (error) return <div className="p-8 text-red-500">Error: {error}</div>;
    if (!wallet) return <div>No wallet data found.</div>;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-SA', { style: 'currency', currency: wallet.currency }).format(amount);
    };

    return (
        <div className="p-4 lg:p-8 space-y-8 pb-24">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">My Wallet</h1>
                    <p className="text-slate-500">Manage your credit and payments</p>
                </div>
                <button
                    onClick={() => setShowTopUp(!showTopUp)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <ArrowUpRight size={18} />
                    Request Top-up
                </button>
            </div>

            {/* Top-up Form Panel */}
            {showTopUp && (
                <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm animate-in slide-in-from-top-2">
                    <h3 className="font-semibold text-slate-900 mb-4">Request Balance Top-up</h3>
                    <form onSubmit={handleTopUp} className="flex flex-col sm:flex-row gap-4 sm:items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-slate-600 mb-1">Amount ({wallet.currency})</label>
                            <input
                                type="number"
                                className="w-full border p-2 rounded-lg"
                                placeholder="5000"
                                value={topUpAmount}
                                onChange={e => setTopUpAmount(e.target.value)}
                                min="100"
                                required
                            />
                        </div>
                        <button
                            disabled={isTopUpLoading}
                            className="w-full sm:w-auto bg-slate-900 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                            {isTopUpLoading ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </form>
                    <p className="text-xs text-slate-500 mt-2">
                        * Requesting a top-up will create a pending transaction. Use this to notify admin of a bank transfer or request credit extension.
                    </p>
                </div>
            )}

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                            <Wallet size={24} />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Balance</span>
                    </div>
                    {/* Balance: Positive is Debt usually, but let's display nicely */}
                    {/* If we strictly follow: Balance -100 (Debt 100). Show "Outstanding: 100" */}
                    <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(Math.abs(wallet.balance))}</h3>
                    <p className={`text-sm mt-1 font-medium ${wallet.balance < 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {wallet.balance < 0 ? 'Outstanding Usage' : 'Prepaid Credit'}
                    </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                            <TrendingUp size={24} />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Available Credit</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(wallet.availableCredit)}</h3>
                    <p className="text-sm text-slate-500 mt-1">Ready to use</p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-500 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                            <AlertCircle size={24} />
                        </div>
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Credit Limit</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">{formatCurrency(wallet.creditLimit)}</h3>
                    <p className="text-sm text-slate-500 mt-1">Total approved limit</p>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent Transactions</h3>
                    <button className="text-blue-600 text-sm font-medium hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Type</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Description</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Date</th>
                                <th className="text-left py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="text-right py-3 px-6 text-xs font-semibold text-slate-500 uppercase">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-slate-500">No transactions found</td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${tx.type === 'DEBIT' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                                                    }`}>
                                                    {tx.type === 'DEBIT' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                                                </div>
                                                <span className={`text-sm font-medium ${tx.type === 'DEBIT' ? 'text-red-900' : 'text-emerald-900'
                                                    }`}>
                                                    {tx.type === 'DEBIT' ? 'Booking' : 'Payment'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <p className="text-sm text-slate-900 font-medium truncate max-w-[200px]">{tx.description}</p>
                                            <p className="text-xs text-slate-500 font-mono">{tx.referenceId}</p>
                                        </td>
                                        <td className="py-4 px-6 text-sm text-slate-500">
                                            {new Date(tx.createdAt).toLocaleDateString()}
                                            <span className="block text-xs opacity-75">{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tx.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800' :
                                                tx.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                {tx.status}
                                            </span>
                                        </td>
                                        <td className={`py-4 px-6 text-right font-bold text-sm ${tx.type === 'DEBIT' ? 'text-slate-900' : 'text-emerald-600'
                                            }`}>
                                            {tx.type === 'DEBIT' ? '-' : '+'}{formatCurrency(tx.amount)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
