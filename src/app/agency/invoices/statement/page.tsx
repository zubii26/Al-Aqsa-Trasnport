'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Printer, Building2 } from 'lucide-react';

export default function StatementPage() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [agencyInfo, setAgencyInfo] = useState<any>(null);
    const [stats, setStats] = useState({ totalDue: 0, totalPaid: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/bookings');
                if (res.ok) {
                    const data = await res.json();

                    // Sort by Date
                    const sorted = data.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                    setBookings(sorted);

                    // Calc Stats
                    const due = sorted.reduce((sum: number, b: any) => sum + (b.paymentStatus !== 'paid' && b.status !== 'cancelled' ? parseFloat(String(b.finalPrice || 0).replace(/[^0-9.]/g, '')) : 0), 0);
                    const paid = sorted.reduce((sum: number, b: any) => sum + (b.paymentStatus === 'paid' ? parseFloat(String(b.finalPrice || 0).replace(/[^0-9.]/g, '')) : 0), 0);
                    setStats({ totalDue: due, totalPaid: paid });
                }

                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const userData = await userRes.json();
                    setAgencyInfo(userData.user);
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, []);

    const currentDate = new Date().toLocaleDateString();

    return (
        <div className="min-h-screen bg-slate-50 print:bg-white font-sans p-4 lg:p-8">
            {/* Header / Nav - Hidden on print */}
            <div className="max-w-4xl mx-auto mb-8 flex justify-between items-center print:hidden">
                <Link href="/agency/invoices" className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold">
                    <ChevronLeft size={20} /> Back to Invoices
                </Link>
                <button
                    onClick={() => window.print()}
                    className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2"
                >
                    <Printer size={18} /> Print Statement
                </button>
            </div>

            {/* Statement Sheet */}
            <div className="max-w-4xl mx-auto bg-white p-8 md:p-12 shadow-xl rounded-2xl print:shadow-none print:p-0 print:rounded-none">

                {/* Header Section */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8">
                    <div>
                        <img src="/logo.png" alt="Al Aqsa Umrah" className="h-32 w-auto mb-6" />
                        <h3 className="font-bold text-lg text-slate-900">Al Aqsa Umrah Transport</h3>
                        <h3 className="font-bold text-lg text-slate-900 font-arabic">الأقصى لنقل المعتمرين</h3>
                        <p className="text-sm text-slate-500">Jeddah, Saudi Arabia</p>
                        <p className="text-sm text-slate-500 font-arabic">جدة، المملكة العربية السعودية</p>
                    </div>
                    <div className="text-right">
                        <h1 className="text-3xl font-extrabold text-slate-900 uppercase">Account Statement <span className="block text-xl font-arabic font-bold text-slate-400 mt-1">كشف حساب</span></h1>
                        <p className="text-slate-500 mt-2">Date: {currentDate}</p>
                    </div>
                </div>

                {/* Account Info */}
                <div className="flex justify-between mb-8 bg-slate-50 p-6 rounded-lg print:bg-transparent print:p-0">
                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Account Summary <span className="font-arabic inline-block ml-1">ملخص الحساب</span></h4>
                        <h3 className="text-xl font-bold text-slate-900">{agencyInfo?.name || 'Agency Partner'}</h3>
                        <p className="text-sm text-slate-500">{agencyInfo?.email}</p>
                    </div>
                    <div className="text-right">
                        <div className="mb-2">
                            <span className="text-sm text-slate-500 block">Total Due <span className="font-arabic">المبلغ المستحق</span></span>
                            <span className="text-2xl font-bold text-red-600">SAR {stats.totalDue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Transactions Table */}
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-200">
                            <th className="py-3 font-bold text-slate-600">Date / <span className="font-arabic font-normal">التاريخ</span></th>
                            <th className="py-3 font-bold text-slate-600">Ref / <span className="font-arabic font-normal">المرجع</span></th>
                            <th className="py-3 font-bold text-slate-600">Description / <span className="font-arabic font-normal">الوصف</span></th>
                            <th className="py-3 font-bold text-slate-600 text-right">Amount / <span className="font-arabic font-normal">المبلغ</span></th>
                            <th className="py-3 font-bold text-slate-600 text-right">Status / <span className="font-arabic font-normal">الحالة</span></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                            <tr key={b._id || b.id}>
                                <td className="py-3 text-slate-500">{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td className="py-3 font-mono text-xs font-medium text-slate-400">#{b._id ? b._id.slice(-6).toUpperCase() : b.id.slice(0, 8)}</td>
                                <td className="py-3 text-slate-900">{b.vehicle} - {b.pickup}</td>
                                <td className="py-3 text-right font-bold text-slate-900">SAR {parseFloat(b.finalPrice || 0).toLocaleString()}</td>
                                <td className="py-3 text-right">
                                    <span className={`text-xs font-bold uppercase ${b.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                        {b.paymentStatus || 'Unpaid'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="mt-12 text-center text-xs text-slate-400">
                    <p>End of Statement • Generated on {new Date().toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
