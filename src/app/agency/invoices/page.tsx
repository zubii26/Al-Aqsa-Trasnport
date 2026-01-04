'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, FileText, Download, Filter, Search, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Link from 'next/link';

export default function InvoicesPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({ totalSpend: 0, outstanding: 0, lastPayment: 0 });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await fetch('/api/bookings');
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data);


                    // Calculation Logic
                    const total = data.reduce((sum: number, b: any) => {
                        const price = b.finalPrice ? parseFloat(String(b.finalPrice).replace(/[^0-9.]/g, '')) : 0;
                        return sum + (b.paymentStatus === 'paid' ? (isNaN(price) ? 0 : price) : 0);
                    }, 0);

                    const outstanding = data.reduce((sum: number, b: any) => {
                        const price = b.finalPrice ? parseFloat(String(b.finalPrice).replace(/[^0-9.]/g, '')) : 0;
                        return sum + (b.paymentStatus !== 'paid' && b.status !== 'cancelled' ? (isNaN(price) ? 0 : price) : 0);
                    }, 0);

                    // Find most recent payment (confirmed)
                    const lastPaid = data.find((b: any) => ['confirmed', 'completed'].includes(b.status));
                    const lastPaymentAmount = lastPaid && lastPaid.finalPrice
                        ? parseFloat(String(lastPaid.finalPrice).replace(/[^0-9.]/g, ''))
                        : 0;

                    setStats({
                        totalSpend: total,
                        outstanding: outstanding,
                        lastPayment: isNaN(lastPaymentAmount) ? 0 : lastPaymentAmount
                    });
                }
            } catch (error) {
                console.error('Failed to fetch invoices', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/agency/dashboard" className="p-2 hover:bg-slate-100 rounded-lg text-slate-600">
                            <ChevronLeft size={20} />
                        </Link>
                        <h1 className="font-bold text-slate-900">Financial Reports</h1>
                    </div>
                    <Link href="/agency/invoices/statement" className="text-sm font-bold text-blue-600 flex items-center gap-2 hover:bg-blue-50 px-3 py-2 rounded-lg transition-colors">
                        <Download size={16} />
                        <span className="hidden sm:inline">Export Statement</span>
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">

                {/* 1. Financial Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1: Total Spend */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-slate-500">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <ArrowUpRight size={18} />
                                </div>
                                <span className="text-sm font-bold">Total Spend (All Time)</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">SAR {stats.totalSpend.toLocaleString()}</h3>
                            <p className="text-xs text-emerald-600 font-bold mt-2 flex items-center gap-1">
                                <span className="bg-emerald-100 px-1.5 py-0.5 rounded text-[10px]">+12%</span>
                                vs last month
                            </p>
                        </div>
                        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                            <FileText size={100} />
                        </div>
                    </div>

                    {/* Card 2: Outstanding Balance */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-slate-500">
                                <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                                    <FileText size={18} />
                                </div>
                                <span className="text-sm font-bold">Outstanding</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">SAR {stats.outstanding.toLocaleString()}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-2">Due in 5 days</p>
                        </div>
                    </div>

                    {/* Card 3: Last Payment */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-colors">
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-2 text-slate-500">
                                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                    <ArrowDownLeft size={18} />
                                </div>
                                <span className="text-sm font-bold">Last Payment</span>
                            </div>
                            <h3 className="text-3xl font-bold text-slate-900">SAR {stats.lastPayment.toLocaleString()}</h3>
                            <p className="text-xs text-slate-400 font-medium mt-2">Received Jan 01, 2026</p>
                        </div>
                    </div>
                </div>

                {/* 2. Invoices List */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    {/* Table Toolbar */}
                    <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h2 className="font-bold text-slate-900">Transaction History</h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search Ref..."
                                    className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-blue-500 w-full sm:w-64"
                                />
                            </div>
                            <button className="p-2 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Table Header */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-xs uppercase font-bold text-slate-500">
                                <tr>
                                    <th className="px-6 py-4">Invoice ID</th>
                                    <th className="px-6 py-4">Reference / Group</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                                            No invoices or bookings found.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((booking) => (
                                        <tr key={booking._id || booking.id} className="hover:bg-slate-50/80 transition-colors group">
                                            <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-500">
                                                #{booking._id?.slice(-6).toUpperCase() || '---'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900">{booking.vehicle || 'Transport Service'}</p>
                                                <p className="text-xs text-slate-500">
                                                    {booking.pickup} <span className="text-slate-300">→</span> {booking.dropoff}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(booking.date || booking.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-900">
                                                {booking.finalPrice ? `SAR ${booking.finalPrice}` : 'Quote'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${['confirmed', 'completed'].includes(booking.status)
                                                    ? 'bg-emerald-50 text-emerald-600'
                                                    : booking.status === 'cancelled'
                                                        ? 'bg-red-50 text-red-600'
                                                        : 'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {booking.status || 'PENDING'}
                                                </span>
                                                <span className={`block mt-1 text-[10px] font-bold uppercase ${booking.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-slate-400'
                                                    }`}>
                                                    {booking.paymentStatus === 'paid' ? 'PAID' : 'UNPAID'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    href={`/agency/invoices/${booking._id || booking.id}`}
                                                    className="text-blue-600 hover:text-blue-700 font-bold text-xs"
                                                >
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="p-4 border-t border-slate-100 flex items-center justify-center gap-2">
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600">Prev</button>
                        <span className="px-3 py-1 text-xs font-bold bg-slate-900 text-white rounded-lg">1</span>
                        <button className="px-3 py-1 text-xs font-bold text-slate-400 hover:text-slate-600">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
