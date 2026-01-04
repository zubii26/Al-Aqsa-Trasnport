'use client';

import BulkBookingWizard from '@/components/agency/bulk-booking/BulkBookingWizard';

export default function BulkBookingPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-6 px-8 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Bulk Booking</h1>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Enterprise Transport Manager</p>
                </div>
                <div className="hidden md:flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs font-bold text-slate-400 uppercase">System Status</p>
                        <p className="text-sm font-black text-emerald-500 flex items-center gap-1 justify-end">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Live
                        </p>
                    </div>
                </div>
            </div>

            <BulkBookingWizard />
        </div>
    );
}
