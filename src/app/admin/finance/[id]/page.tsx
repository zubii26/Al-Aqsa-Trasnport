'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Wallet, AlertTriangle, FileText, Download, Plus, Smartphone, Mail, MapPin } from 'lucide-react';
import RecordPaymentModal from '@/components/admin/finance/RecordPaymentModal';

export default function AgencyFinanceDetail({ params }: { params: Promise<{ id: string }> }) {
    // Unwrapping params for Next.js 15+
    const [unwrappedParams, setUnwrappedParams] = useState<{ id: string } | null>(null);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'transactions' | 'invoices'>('transactions');
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    useEffect(() => {
        params.then(setUnwrappedParams);
    }, [params]);

    const fetchData = async () => {
        if (!unwrappedParams?.id) return;
        try {
            console.log('Fetching URL:', `/api/admin/finance/agencies/${unwrappedParams.id}`);
            const res = await fetch(`/api/admin/finance/agencies/${unwrappedParams.id}`);
            if (res.ok) {
                setData(await res.json());
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [unwrappedParams]);

    if (!unwrappedParams || loading) return <div className="p-8 text-center text-muted-foreground">Loading details...</div>;
    if (!data) return <div className="p-8 text-center text-red-500">Failed to load agency data.</div>;

    const { agency, wallet, status, transactions, invoices } = data;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-SA', { style: 'currency', currency: wallet.currency || 'SAR' }).format(amount);
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <RecordPaymentModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                onSuccess={() => {
                    fetchData(); // Refresh data
                }}
                agencyId={agency._id}
                agencyName={agency.name}
            />

            {/* Header */}
            <div className="mb-6">
                <a href="/admin/finance" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 text-sm transition-colors">
                    <ArrowLeft size={16} /> Back to Dashboard
                </a>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                            {agency.name.charAt(0)}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{agency.name}</h1>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                                {agency.email && <div className="flex items-center gap-1"><Mail size={14} /> {agency.email}</div>}
                                {agency.phone && <div className="flex items-center gap-1"><Smartphone size={14} /> {agency.phone}</div>}
                                {agency.location?.address && <div className="flex items-center gap-1"><MapPin size={14} /> {agency.location.address}</div>}
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsPaymentModalOpen(true)}
                        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus size={18} /> Record Payment
                    </button>
                </div>
            </div>

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Balance Card */}
                <div className={`p-6 rounded-xl border shadow-sm ${status === 'overdue' ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' :
                    status === 'warning' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800' :
                        'bg-card border-border'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Current Balance</div>
                            <div className={`text-3xl font-bold mt-1 ${wallet.balance < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {formatCurrency(wallet.balance)}
                            </div>
                        </div>
                        <div className={`p-3 rounded-full ${status === 'overdue' || status === 'warning' ? 'bg-white/50 text-red-600' : 'bg-primary/10 text-primary'
                            }`}>
                            <Wallet size={24} />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {status === 'overdue' && <span className="flex items-center gap-1 text-red-600 font-bold"><AlertTriangle size={14} /> Account Overdue</span>}
                        {status === 'warning' && <span className="flex items-center gap-1 text-amber-600 font-bold"><AlertTriangle size={14} /> Low Credit</span>}
                        {status === 'good' && <span className="text-green-600 font-medium">Account in Good Standing</span>}
                    </div>
                </div>

                {/* Credit Limit Card */}
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Credit Limit</div>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(wallet.creditLimit)}</div>
                    <div className="mt-4 pt-4 border-t border-border flex justify-between text-sm">
                        <span className="text-muted-foreground">Limit Usage</span>
                        <span className="font-mono font-medium">{Math.abs((wallet.balance / wallet.creditLimit) * 100).toFixed(0)}%</span>
                    </div>
                </div>

                {/* Available Credit Card */}
                <div className="p-6 rounded-xl bg-card border border-border shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Available to Spend</div>
                    <div className="text-3xl font-bold text-foreground">{formatCurrency(wallet.availableCredit)}</div>
                    <div className="mt-4 text-xs text-muted-foreground">
                        Includes prepaid balance + unused credit limit.
                    </div>
                </div>
            </div>

            {/* Tabs & Content */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[500px]">
                <div className="flex border-b border-border">
                    <button
                        onClick={() => setActiveTab('transactions')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'transactions'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Transaction History
                    </button>
                    <button
                        onClick={() => setActiveTab('invoices')}
                        className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'invoices'
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Invoices
                    </button>
                </div>

                <div className="p-0">
                    {activeTab === 'transactions' && (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-muted/30 border-b border-border">
                                    <tr>
                                        <th className="p-4 font-medium text-muted-foreground">Date</th>
                                        <th className="p-4 font-medium text-muted-foreground">Description</th>
                                        <th className="p-4 font-medium text-muted-foreground">Reference</th>
                                        <th className="p-4 font-medium text-muted-foreground text-center">Type</th>
                                        <th className="p-4 font-medium text-muted-foreground text-right">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {transactions.map((tx: any) => (
                                        <tr key={tx._id} className="hover:bg-muted/20">
                                            <td className="p-4 text-muted-foreground">
                                                {new Date(tx.createdAt).toLocaleDateString()} <br />
                                                <span className="text-xs">{new Date(tx.createdAt).toLocaleTimeString()}</span>
                                            </td>
                                            <td className="p-4 font-medium">{tx.description}</td>
                                            <td className="p-4 font-mono text-xs text-muted-foreground">{tx.referenceId}</td>
                                            <td className="p-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${tx.type === 'CREDIT' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    {tx.type}
                                                </span>
                                            </td>
                                            <td className={`p-4 text-right font-mono font-bold ${tx.type === 'CREDIT' ? 'text-green-600' : 'text-foreground'
                                                }`}>
                                                {tx.type === 'CREDIT' ? '+' : '-'}{formatCurrency(tx.amount)}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No transactions found.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {activeTab === 'invoices' && (
                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {invoices.map((inv: any) => (
                                <div key={inv._id} className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors bg-card">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <FileText size={18} className="text-primary" />
                                            <span className="font-bold">{inv.invoiceNumber}</span>
                                        </div>
                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${inv.status === 'PAID' ? 'bg-green-100 text-green-700' :
                                            inv.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                                                'bg-slate-100 text-slate-700'
                                            }`}>
                                            {inv.status}
                                        </span>
                                    </div>
                                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                        <div className="flex justify-between">
                                            <span>Period:</span>
                                            <span>{new Date(inv.periodStart).toLocaleDateString()} - {new Date(inv.periodEnd).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Due Date:</span>
                                            <span className="text-foreground">{new Date(inv.dueDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-border mt-2">
                                            <span className="font-medium text-foreground">Total:</span>
                                            <span className="font-bold text-foreground">{formatCurrency(inv.totalAmount)}</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 flex items-center justify-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 rounded-lg text-sm font-medium transition-colors">
                                        <Download size={16} /> Download PDF
                                    </button>
                                </div>
                            ))}
                            {invoices.length === 0 && (
                                <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
                                    <FileText size={48} className="mx-auto mb-4 opacity-20" />
                                    <p>No invoices generated yet.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
