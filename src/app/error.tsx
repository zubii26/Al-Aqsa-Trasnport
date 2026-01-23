'use client';

import { useEffect } from 'react';
import GlassButton from '@/components/ui/GlassButton';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Global Error Boundary Caught:', error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-center">
            <div className="bg-card border border-destructive/20 p-8 rounded-2xl shadow-2xl max-w-lg w-full">
                <h2 className="text-2xl font-bold text-destructive mb-4">Something went wrong!</h2>
                <p className="text-muted-foreground mb-6">
                    We apologize for the inconvenience. An unexpected error occurred.
                </p>

                {/* Development Helper: Show full error details */}
                <div className="bg-black/5 dark:bg-black/30 p-4 rounded-lg text-left text-xs font-mono mb-6 overflow-auto max-h-48 border border-border">
                    <p className="font-bold text-destructive">{error.name}: {error.message}</p>
                    {error.digest && <p className="text-muted-foreground mt-1">Digest: {error.digest}</p>}
                    <pre className="mt-2 opacity-70 whitespace-pre-wrap">{error.stack}</pre>
                </div>

                <div className="flex gap-4 justify-center">
                    <GlassButton onClick={() => reset()} variant="secondary">
                        Try again
                    </GlassButton>
                    <GlassButton href="/" variant="outline">
                        Go Home
                    </GlassButton>
                </div>
            </div>
        </div>
    );
}
