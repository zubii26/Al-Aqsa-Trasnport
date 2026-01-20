import React from 'react';

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12">
            <div className="container mx-auto px-4">
                {/* Hero Skeleton */}
                <div className="w-full h-[300px] md:h-[400px] bg-slate-200 dark:bg-slate-900 rounded-3xl animate-pulse mb-12 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-100%] animate-shimmer" />
                </div>

                {/* Content Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                    </div>
                    <div className="space-y-4">
                        <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-full bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                        <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-900 rounded animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
}
