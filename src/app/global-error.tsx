'use client';

import { useEffect } from 'react';
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
    useEffect(() => {
        console.error('Global Error (Root Layout) Caught:', error);
    }, [error]);

    return (
        <html lang="en">
            <body className={inter.className}>
                <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-white text-black">
                    <div className="max-w-md w-full text-center space-y-4">
                        <h2 className="text-2xl font-bold text-red-600">Critical Application Error</h2>
                        <p className="text-gray-600">
                            A critical error occurred in the root layout. This is being reported.
                        </p>

                        <div className="bg-gray-100 p-4 rounded text-left text-xs font-mono overflow-auto max-h-48 border border-gray-300">
                            <p className="font-bold text-red-700">{error.name}: {error.message}</p>
                            {error.digest && <p className="text-gray-500 mt-1">Digest: {error.digest}</p>}
                            <pre className="mt-2 text-gray-700 whitespace-pre-wrap">{error.stack}</pre>
                        </div>

                        <button
                            onClick={() => reset()}
                            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </body>
        </html>
    );
}
