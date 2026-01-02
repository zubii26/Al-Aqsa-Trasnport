'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Building2, Download, Plus, FileText, Calendar, CreditCard, Wallet, X, CheckCircle } from 'lucide-react';
import { Toast } from '@/components/ui/Toast';

export default function AgencyLedgerPage() {
    const params = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

    // Payment Form
    const [paymentForm, setPaymentForm] = useState({
        amount: '',
        method: 'bank_transfer',
        reference: '',
        notes: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/admin/agencies/${params.id}`);
            if (res.ok) {
                setData(await res.json());
            }
        } catch (error) {
            console.error('Failed to load ledger', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [params.id]);

    const handlePaymentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await fetch(`/api/admin/agencies/${params.id}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(paymentForm)
            });

            if (res.ok) {
                setToast({ message: 'Payment recorded successfully', type: 'success' });
                setIsPaymentModalOpen(false);
                setPaymentForm({ amount: '', method: 'bank_transfer', reference: '', notes: '' });
                fetchData(); // Refresh ledger
            } else {
                throw new Error('Failed to record');
            }
        } catch (error) {
            setToast({ message: 'Failed to record payment', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
    }

    if (!data) return <div className="min-h-screen flex items-center justify-center">Agency not found</div>;

    const { agency, ledger, summary } = data;
    const usagePercent = summary.creditLimit > 0 ? (summary.outstanding / summary.creditLimit) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {toast && <Toast message={toast.message} type={toast.type} isVisible={true} onClose={() => setToast(null)} />}

            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin/agencies" className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                            <ArrowLeft size={20} />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Building2 className="text-blue-600" />
                                {agency.name}
                            </h1>
                            <p className="text-slate-500 text-sm mt-1">{agency.email} • {agency.phone || 'No Phone'}</p>
                        </div>
                        <div className="ml-auto flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm transition-colors">
                                <Download size={16} /> Statement PDF
                            </button>
                            <button
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium text-sm transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Record Payment
                            </button>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Outstanding Balance</p>
                            <p className="text-2xl font-bold text-slate-900">SAR {summary.outstanding.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Credit Limit</p>
                            <p className="text-2xl font-bold text-slate-900">SAR {summary.creditLimit.toLocaleString()}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-1">Available Credit</p>
                            <p className={`text-2xl font-bold ${summary.creditLimit - summary.outstanding < 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                                SAR {(summary.creditLimit - summary.outstanding).toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider mb-2">Credit Utilization</p>
                            <div className="flex items-end gap-2 mb-1">
                                <span className="text-2xl font-bold text-slate-900">{Math.round(usagePercent)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${usagePercent > 90 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${Math.min(100, usagePercent)}%` }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ledger Table */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                            <FileText size={18} className="text-slate-400" />
                            Account Statement
                        </h2>
                        <span className="text-xs text-slate-500">Showing all transactions</span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 text-slate-500 font-medium">
                                <tr>
                                    <th className="px-6 py-3 border-b border-slate-200">Date</th>
                                    <th className="px-6 py-3 border-b border-slate-200">Description</th>
                                    <th className="px-6 py-3 border-b border-slate-200">Ref #</th>
                                    <th className="px-6 py-3 border-b border-slate-200 text-right">Debit (SAR)</th>
                                    <th className="px-6 py-3 border-b border-slate-200 text-right">Credit (SAR)</th>
                                    <th className="px-6 py-3 border-b border-slate-200 text-right">Balance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {ledger.map((item: any) => (
                                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-3 text-slate-600 whitespace-nowrap">
                                            {new Date(item.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 text-slate-900 max-w-xs truncate" title={item.description}>
                                            <div className="flex items-center gap-2">
                                                {item.type === 'PAYMENT' ? (
                                                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                                                ) : (
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0"></div>
                                                )}
                                                {item.description}
                                            </div>
                                        </td>
                                        <td className="px-6 py-3 text-slate-400 font-mono text-xs">
                                            {item.reference ? item.reference.slice(-8).toUpperCase() : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-medium text-slate-600">
                                            {item.debit > 0 ? item.debit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-medium text-emerald-600">
                                            {item.credit > 0 ? item.credit.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                                        </td>
                                        <td className="px-6 py-3 text-right font-bold text-slate-900 bg-slate-50/30">
                                            {item.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                                {ledger.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No transactions found for this agency.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Payment Modal */}
            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                <Wallet className="text-emerald-600" size={20} />
                                Record Payment
                            </h3>
                            <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handlePaymentSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Amount (SAR)</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">SAR</span>
                                    <input
                                        type="number"
                                        required
                                        min="1"
                                        className="w-full pl-12 pr-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-bold text-slate-900"
                                        placeholder="0.00"
                                        value={paymentForm.amount}
                                        onChange={e => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['bank_transfer', 'cash', 'credit_card', 'other'].map(method => (
                                        <button
                                            type="button"
                                            key={method}
                                            onClick={() => setPaymentForm({ ...paymentForm, method })}
                                            className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all ${paymentForm.method === method
                                                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 ring-1 ring-emerald-500'
                                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                                }`}
                                        >
                                            {method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Reference / Transaction ID</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="e.g. TRX-12345678"
                                    value={paymentForm.reference}
                                    onChange={e => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none h-20"
                                    placeholder="Any additional details..."
                                    value={paymentForm.notes}
                                    onChange={e => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                                >
                                    {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle size={20} />}
                                    Confirm Payment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
