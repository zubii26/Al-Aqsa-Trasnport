"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '@/locales/en.json';
import ar from '@/locales/ar.json';
import ur from '@/locales/ur.json';

type Language = 'en' | 'ar' | 'ur';
type Direction = 'ltr' | 'rtl';
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    direction: Direction;
    setLanguage: (lang: Language) => void;
    t: (key: string, defaultValue?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
    en,
    ar,
    ur,
};

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<Language>('en');
    const [direction, setDirection] = useState<Direction>('ltr');

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        const dir = lang === 'en' ? 'ltr' : 'rtl';
        setDirection(dir);
        localStorage.setItem('language', lang);
        document.documentElement.dir = dir;
        document.documentElement.lang = lang;
    };

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && ['en', 'ar', 'ur'].includes(savedLang)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLanguage(savedLang);
        }
    }, []);

    const t = (path: string, defaultValue?: string) => {
        const keys = path.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let current: Record<string, any> = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return defaultValue || path;
            }
            current = current[key];
        }

        return current as unknown as string;
    };

    return (
        <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
