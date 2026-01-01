'use client';

import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const AnalyticsCharts = dynamic(() => import('@/components/admin/analytics/AnalyticsCharts'), {
    ssr: false,
    loading: () => <div>Loading Charts...</div>
});

export default function AnalyticsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">Business Analytics</h1>
                <p className="text-slate-500 dark:text-slate-400">
                    Track your business performance, revenue, and driver statistics.
                </p>
            </div>
            <AnalyticsCharts />
        </div>
    );
}
