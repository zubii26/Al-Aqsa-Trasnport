'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2, CreditCard, Users, ArrowUpRight, Search, FileText, Download, Wallet } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function AdminAgenciesPage() {
    const [agencies, setAgencies] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchAgencies = async () => {
            try {
                const res = await fetch('/api/admin/agencies');
                if (res.ok) {
                    setAgencies(await res.json());
                }
            } catch (error) {
                console.error('Failed to load agencies', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAgencies();
    }, []);

    const filteredAgencies = agencies.filter(a =>
        a.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalOutstanding = agencies.reduce((sum, a) => sum + (a.outstanding || 0), 0);
    const totalCreditLimit = agencies.reduce((sum, a) => sum + (a.creditLimit || 0), 0);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header Stats */}
            <div className="bg-white border-b border-slate-200 pt-8 pb-12 px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Agency Management</h1>
                            <p className="text-slate-500 mt-2">Monitor credit limits, outstanding balances, and contracts.</p>
                        </div>
                        <Link
                            href="/admin/users?role=agency"
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Building2 size={18} /> Add / Manage Agencies
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg shadow-blue-200">
                            <p className="text-blue-100 text-sm font-medium mb-1">Total Outstanding</p>
                            <h3 className="text-3xl font-bold">SAR {totalOutstanding.toLocaleString()}</h3>
                            <div className="mt-4 flex items-center gap-2 text-xs text-blue-100 bg-white/10 px-2 py-1 rounded w-fit">
                                <ArrowUpRight size={14} /> Receivables
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Active Agencies</p>
                                    <h3 className="text-3xl font-bold text-slate-900">{agencies.length}</h3>
                                </div>
                                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                                    <Users size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Total Credit Limit</p>
                                    <h3 className="text-3xl font-bold text-slate-900">SAR {totalCreditLimit.toLocaleString()}</h3>
                                </div>
                                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                                    <CreditCard size={20} />
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex items-center justify-between">
                            <div>
                                <p className="text-slate-500 text-sm font-medium mb-1">Risk Exposure</p>
                                <h3 className="text-3xl font-bold text-slate-900">
                                    {totalCreditLimit > 0 ? Math.round((totalOutstanding / totalCreditLimit) * 100) : 0}%
                                </h3>
                            </div>
                            <div className="h-16 w-16">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[{ value: totalOutstanding }, { value: totalCreditLimit - totalOutstanding }]}
                                            innerRadius={20}
                                            outerRadius={30}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            <Cell fill="#2563eb" />
                                            <Cell fill="#e2e8f0" />
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-8 -mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-6 border-b border-slate-100 flex justify-between gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search agencies..."
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:border-blue-500 outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium text-sm">
                            <Download size={16} /> Export Report
                        </button>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Agency Name</th>
                                    <th className="px-6 py-4">Credit Usage</th>
                                    <th className="px-6 py-4 text-right">Outstanding</th>
                                    <th className="px-6 py-4 text-center">Bookings</th>
                                    <th className="px-6 py-4 text-right">Credit Limit</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {isLoading ? (
                                    [1, 2, 3].map(i => (
                                        <tr key={i} className="animate-pulse">
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-48"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-32"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-12 mx-auto"></div></td>
                                            <td className="px-6 py-4"><div className="h-4 bg-slate-100 rounded w-24 ml-auto"></div></td>
                                            <td className="px-6 py-4"></td>
                                        </tr>
                                    ))
                                ) : filteredAgencies.length > 0 ? (
                                    filteredAgencies.map((agency) => {
                                        const usagePercent = agency.creditLimit > 0 ? (agency.outstanding / agency.creditLimit) * 100 : 0;
                                        const isHighRisk = usagePercent > 90;

                                        return (
                                            <tr key={agency.id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{agency.name}</p>
                                                        <p className="text-xs text-slate-500">{agency.email}</p>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 w-64">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className={isHighRisk ? 'text-red-600 font-bold' : 'text-slate-600'}>
                                                            {Math.round(usagePercent)}%
                                                        </span>
                                                        <span className="text-slate-400">of {agency.creditLimit.toLocaleString()}</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${isHighRisk ? 'bg-red-500' : 'bg-blue-500'}`}
                                                            style={{ width: `${Math.min(100, usagePercent)}%` }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className={`px-6 py-4 text-right font-mono font-medium ${agency.outstanding > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {agency.outstanding.toLocaleString()} SAR
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                                                        {agency.totalBookings}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-slate-500">
                                                    {agency.creditLimit.toLocaleString()} SAR
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {/* Placeholder actions - future: View Invoices, Record Payment */}
                                                        <Link href={`/admin/agencies/${agency.id}`} title="View Ledger" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                                                            <FileText size={18} />
                                                        </Link>
                                                        <button title="Record Payment" className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                            <Wallet size={18} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No agencies found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
