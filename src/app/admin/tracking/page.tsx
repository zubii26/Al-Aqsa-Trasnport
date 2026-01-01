'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

// Dynamically import map with no SSR
const AdminMap = dynamic(() => import('@/components/admin/AdminMap'), {
    ssr: false,
    loading: () => (
        <div className="h-[600px] w-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col items-center gap-3 text-slate-500">
                <Loader2 size={32} className="animate-spin text-amber-500" />
                <p>Loading Map...</p>
            </div>
        </div>
    )
});

export default function TrackingPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Live Driver Tracking</h1>
                    <p className="text-slate-500 dark:text-slate-400">
                        Real-time view of all online drivers and their last known locations.
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-800">
                <AdminMap />
            </div>
        </div>
    );
}
