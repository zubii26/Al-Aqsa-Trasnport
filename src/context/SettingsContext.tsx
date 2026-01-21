'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Settings } from '@/lib/validations';

interface SettingsContextType {
    settings: Settings | null;
    isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children, initialSettings = null }: { children: React.ReactNode; initialSettings?: Settings | null }) {
    const [settings, setSettings] = useState<Settings | null>(initialSettings);
    const [isLoading, setIsLoading] = useState(!initialSettings);

    useEffect(() => {
        if (initialSettings) return; // Skip fetch if we have initial settings

        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                const data = await res.json();
                setSettings(data);
            } catch (error) {
                console.error('Failed to fetch settings:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSettings();
    }, [initialSettings]);

    return (
        <SettingsContext.Provider value={{ settings, isLoading }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
}
