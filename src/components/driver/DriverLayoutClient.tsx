'use client';

import React from 'react';
import PWAInit from '@/components/driver/PWAInit';

export default function DriverLayoutClient({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Service Worker removed to simplify installability (uses main app SW if present) */}
            {/* <PWAInit serviceWorkerUrl="/driver-sw.js" scope="/driver/" /> */}

            <main className="max-w-md mx-auto min-h-screen bg-white shadow-lg overflow-hidden relative">
                {children}
            </main>
        </div>
    );
}
