'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DollarSign, AlertTriangle, TrendingUp, Users, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import FinanceFilters from '@/components/admin/finance/FinanceFilters';

interface AgencyFinance {
    id: string;
    name: string;
    email: string;
    phone: string;
    balance: number;
    creditLimit: number;
    availableCredit: number;
    status: 'good' | 'warning' | 'overdue';
    lastPaymentDate: string;
}

interface SummaryMetrics {
    totalOutstanding: number;
    totalCreditLimit: number;
    totalAvailable: number;
    overdueCount: number;
    warningCount: number;
    totalAgencies: number;
}

export default function PaymentsDashboard() {
    const [agencies, setAgencies] = useState<AgencyFinance[]>([]);
    const [metrics, setMetrics] = useState<SummaryMetrics | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [metricsRes, agenciesRes] = await Promise.all([
                fetch('/api/admin/finance/summary'),
                fetch(`/api/admin/finance/agencies?filter=${statusFilter}`)
            ]);

            const metricsData = await metricsRes.json();
            const agenciesData = await agenciesRes.json();

            setMetrics(metricsData.metrics || null);
            setAgencies(agenciesData.agencies || []);
        } catch (error) {
            console.error('Failed to load finance data:', error);
            setAgencies([]); // Fallback to empty to prevent filter crash
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [statusFilter]);

    const filteredAgencies = (agencies || []).filter(a =>
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.email.toLowerCase().includes(search.toLowerCase())
    );

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-SA', { style: 'currency', currency: 'SAR' }).format(amount);
    };

    if (loading && !metrics) {
        return <div className="p-8 text-center">Loading Data...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Payments & Dues</h1>
                    <p className="text-muted-foreground">Monitor agency balances and outstanding payments.</p>
                </div>
                <button
                    onClick={fetchData}
                    className="p-2 hover:bg-secondary/10 rounded-full transition-colors"
                    title="Refresh Data"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                            <Users size={20} />
                        </div>
                        <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded">Total</span>
                    </div>
                    <div className="text-2xl font-bold">{metrics?.totalAgencies}</div>
                    <div className="text-blue-100 text-sm">Active Agencies</div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-lg">
                            <AlertTriangle size={20} />
                        </div>
                        <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded">Due</span>
                    </div>
                    <div className="text-2xl font-bold text-red-600">{formatCurrency(metrics?.totalOutstanding || 0)}</div>
                    <div className="text-muted-foreground text-sm">Outstanding Balance</div>
                    {metrics?.overdueCount ? (
                        <div className="mt-2 text-xs text-red-500 font-medium">
                            {metrics.overdueCount} Critical Accts
                        </div>
                    ) : null}
                </div>

                <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-lg">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded">Available</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{formatCurrency(metrics?.totalAvailable || 0)}</div>
                    <div className="text-muted-foreground text-sm">Prepaid Credit</div>
                </div>

                <div className="p-4 rounded-xl bg-card border border-border shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-lg">
                            <TrendingUp size={20} />
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-foreground">{formatCurrency(metrics?.totalCreditLimit || 0)}</div>
                    <div className="text-muted-foreground text-sm">Total Credit Limit</div>
                </div>
            </div>

            <FinanceFilters
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onFilterChange={setStatusFilter}
            />

            {/* Data Table */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 border-b border-border">
                        <tr>
                            <th className="p-4 font-medium text-muted-foreground">Agency</th>
                            <th className="p-4 font-medium text-muted-foreground">Contact</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Credit Limit</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Balance</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Available</th>
                            <th className="p-4 font-medium text-muted-foreground text-center">Status</th>
                            <th className="p-4 font-medium text-muted-foreground text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {filteredAgencies.map((agency) => (
                            <tr key={agency.id} className="hover:bg-muted/30 transition-colors">
                                <td className="p-4 font-medium">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                            {agency.name.charAt(0)}
                                        </div>
                                        {agency.name}
                                    </div>
                                </td>
                                <td className="p-4 text-muted-foreground">
                                    <div>{agency.email}</div>
                                    <div className="text-xs">{agency.phone}</div>
                                </td>
                                <td className="p-4 text-right font-mono">
                                    {formatCurrency(agency.creditLimit)}
                                </td>
                                <td className={`p-4 text-right font-mono font-bold ${agency.balance < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                    {formatCurrency(agency.balance)}
                                </td>
                                <td className="p-4 text-right font-mono text-muted-foreground">
                                    {formatCurrency(agency.availableCredit)}
                                </td>
                                <td className="p-4 text-center">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${agency.status === 'overdue' ? 'bg-red-100 text-red-700' :
                                        agency.status === 'warning' ? 'bg-amber-100 text-amber-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {agency.status.toUpperCase()}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <Link
                                        href={`/admin/finance/${agency.id}`}
                                        className="inline-flex items-center gap-1 text-primary hover:underline text-xs font-medium"
                                    >
                                        View Details <ArrowRight size={14} />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {filteredAgencies.length === 0 && (
                            <tr>
                                <td colSpan={7} className="p-8 text-center text-muted-foreground">
                                    No agencies found matching your criteria.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
