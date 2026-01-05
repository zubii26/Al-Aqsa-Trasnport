'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import styles from '@/app/admin/admin.module.css';

// Dynamically import the map to avoid SSR issues
const FleetMap = dynamic(() => import('./FleetMap'), {
    ssr: false,
    loading: () => (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-2xl">
            <Loader2 className="animate-spin text-muted-foreground" />
        </div>
    ),
});

export default function LiveFleetMap({ onDriversLoaded }: { onDriversLoaded?: (count: number) => void }) {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/admin/drivers/live');
            if (res.ok) {
                const data = await res.json();
                setDrivers(data);
                if (onDriversLoaded) {
                    onDriversLoaded(data.filter((d: any) => d.isOnline).length);
                }
            }
        } catch (error) {
            console.error('Failed to fetch live drivers', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
        // Poll every 30 seconds
        const interval = setInterval(fetchLocations, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className={`${styles.glassCard} h-[400px] md:h-[500px] mb-8 relative p-0 overflow-hidden`}>
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1 rounded-lg shadow-sm">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Live Fleet View
                </span>
            </div>

            <FleetMap drivers={drivers} />
        </div>
    );
}
