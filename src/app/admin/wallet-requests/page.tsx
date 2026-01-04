'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

interface WalletRequest {
    _id: string;
    amount: number;
    agencyName: string;
    referenceId: string;
    description: string;
    createdAt: string;
    status: string;
}

export default function AdminWalletRequestsPage() {
    const [requests, setRequests] = useState<WalletRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/wallet/requests');
            if (res.ok) {
                const data = await res.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Failed to load requests', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        if (!confirm(`Are you sure you want to ${action} this request?`)) return;

        setActionLoading(id);
        try {
            const res = await fetch(`/api/admin/wallet/requests/${id}/${action}`, {
                method: 'POST'
            });

            if (res.ok) {
                // Remove from list or refresh
                setRequests(prev => prev.filter(r => r._id !== id));
                alert(`Request ${action}ed successfully`);
            } else {
                const err = await res.json();
                alert(err.error || 'Action failed');
            }
        } catch (error) {
            console.error('Action error', error);
            alert('An error occurred');
        } finally {
            setActionLoading(null);
        }
    };

    return (
        <div className="p-8 pb-24 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Wallet Top-up Requests</h1>
                    <p className="text-slate-500">Approve or reject agency balance top-ups</p>
                </div>
                <button
                    onClick={fetchRequests}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors"
                >
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="animate-spin text-blue-600" size={32} />
                </div>
            ) : requests.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                    <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">All Caught Up!</h3>
                    <p className="text-slate-500">No pending wallet requests found.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b border-slate-200">
                                <tr>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Agency</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reference / Date</th>
                                    <th className="text-right py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {requests.map(req => (
                                    <tr key={req._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <p className="font-semibold text-slate-900">{req.agencyName}</p>
                                            <p className="text-xs text-slate-500">{req.description}</p>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-lg font-bold text-emerald-600">
                                                +{new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(req.amount)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-xs font-mono bg-slate-100 px-2 py-1 rounded w-fit">{req.referenceId}</span>
                                                <span className="text-sm text-slate-500 flex items-center gap-1">
                                                    <Clock size={14} />
                                                    {new Date(req.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(req._id, 'approve')}
                                                    disabled={actionLoading === req._id}
                                                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {actionLoading === req._id ? <Loader2 className="animate-spin" size={16} /> : <CheckCircle size={16} />}
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleAction(req._id, 'reject')}
                                                    disabled={actionLoading === req._id}
                                                    className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    <XCircle size={16} />
                                                    Reject
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
