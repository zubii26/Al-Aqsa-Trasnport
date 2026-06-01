'use client';

import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const [isReloading, setIsReloading] = useState(false);

    useEffect(() => {
        console.error('Global Error (Root Layout) Caught:', error);
        
        // Auto-reload on chunk load errors (common after new deployments or in dev mode)
        const isChunkError = error.message && (
            error.message.includes('Failed to load chunk') || 
            error.message.includes('Loading chunk') || 
            error.name === 'ChunkLoadError'
        );
        
        if (isChunkError && !sessionStorage.getItem('chunk_reloaded')) {
            setIsReloading(true);
            sessionStorage.setItem('chunk_reloaded', 'true');
            // Force reload from server to get new HTML with new chunk IDs
            window.location.href = window.location.href.split('#')[0];
        } else {
            // Clear the flag if it's a different error
            sessionStorage.removeItem('chunk_reloaded');
        }
    }, [error]);

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#020617] text-white">
                    <div className="max-w-lg w-full text-center space-y-6 glass-card p-8 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden">
                        
                        {/* Decorative Top Line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent opacity-50"></div>

                        {isReloading ? (
                            <div className="space-y-4">
                                <div className="w-12 h-12 border-4 border-[#fbbf24] border-t-transparent rounded-full animate-spin mx-auto"></div>
                                <h2 className="text-xl font-bold text-white tracking-wide">Updating Application...</h2>
                                <p className="text-gray-400 text-sm">Please wait while we load the latest version.</p>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-red-500 tracking-tight">System Error</h2>
                                <p className="text-gray-300 text-sm leading-relaxed">
                                    We apologize, but a critical error has occurred. This is usually due to a recent update or a temporary network issue.
                                </p>

                                {/* Developer Error Details (Hidden in standard production, but useful for debugging) */}
                                <div className="bg-black/50 p-4 rounded-xl text-left text-xs font-mono overflow-auto max-h-48 border border-red-500/20 text-red-300 backdrop-blur-md mt-4">
                                    <p className="font-bold">{error.name}: {error.message}</p>
                                    {error.digest && <p className="text-gray-500 mt-1">Digest: {error.digest}</p>}
                                </div>

                                <button
                                    onClick={() => {
                                        sessionStorage.removeItem('chunk_reloaded');
                                        window.location.href = window.location.pathname;
                                    }}
                                    className="mt-6 px-8 py-3 bg-gradient-to-r from-[#fbbf24] to-[#d97706] text-[#0f172a] font-bold rounded-lg hover:shadow-[0_0_20px_rgba(251,191,36,0.3)] transition-all transform hover:-translate-y-1"
                                >
                                    Refresh Page
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </body>
        </html>
    );
}
