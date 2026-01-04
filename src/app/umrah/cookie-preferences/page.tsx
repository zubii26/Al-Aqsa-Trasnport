'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Check, Save, ArrowLeft, Lock, BarChart3, Layout, Megaphone } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface CookieSettings {
    necessary: boolean;
    analytics: boolean;
    marketing: boolean;
    functional: boolean;
}

export default function CookiePreferences() {
    const router = useRouter();
    const [settings, setSettings] = useState<CookieSettings>({
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        const savedConsent = localStorage.getItem('cookie_preferences');
        if (savedConsent) {
            try {
                setSettings(JSON.parse(savedConsent));
            } catch (e) {
                console.error('Failed to parse cookie preferences', e);
            }
        }
    }, []);

    const handleSave = () => {
        localStorage.setItem('cookie_preferences', JSON.stringify(settings));
        localStorage.setItem('cookie_consent', 'custom');
        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            router.back();
        }, 1500);
    };

    const toggleSetting = (key: keyof CookieSettings) => {
        if (key === 'necessary') return;
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const sections = [
        {
            id: 'necessary',
            title: 'Strictly Necessary',
            description: 'Essential for the website to function properly. These cannot be disabled.',
            icon: Lock,
            required: true
        },
        {
            id: 'analytics',
            title: 'Analytics & Performance',
            description: 'Help us understand how visitors interact with the website anonymously.',
            icon: BarChart3,
            required: false
        },
        {
            id: 'functional',
            title: 'Functional',
            description: 'Enable enhanced functionality and personalization, like language preferences.',
            icon: Layout,
            required: false
        },
        {
            id: 'marketing',
            title: 'Marketing & Targeting',
            description: 'Used to deliver relevant ads and track effectiveness of campaigns.',
            icon: Megaphone,
            required: false
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-gray-900 to-transparent opacity-10 pointer-events-none" />
            <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-10"
                >
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-500 hover:text-gold-600 transition-colors mb-6 group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-gold-100 dark:bg-gold-900/20 rounded-2xl">
                            <Shield className="w-8 h-8 text-gold-600 dark:text-gold-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">
                            Cookie Preferences
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
                        We value your privacy. Customize your cookie settings below to control how we collect and use your data.
                    </p>
                </motion.div>

                <div className="grid gap-6">
                    {sections.map((section, index) => {
                        const Icon = section.icon;
                        const isEnabled = settings[section.id as keyof CookieSettings];

                        return (
                            <motion.div
                                key={section.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`
                                    group relative overflow-hidden rounded-2xl border transition-all duration-300
                                    ${isEnabled
                                        ? 'bg-white dark:bg-gray-900 border-gold-500/30 shadow-lg shadow-gold-500/5'
                                        : 'bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800'}
                                `}
                            >
                                <div className="p-6 sm:p-8 flex items-start gap-6">
                                    <div className={`
                                        p-3 rounded-xl shrink-0 transition-colors duration-300
                                        ${isEnabled ? 'bg-gold-100 dark:bg-gold-900/20 text-gold-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}
                                    `}>
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-4 mb-2">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                {section.title}
                                            </h3>
                                            {section.required ? (
                                                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full uppercase tracking-wider">
                                                    Required
                                                </span>
                                            ) : (
                                                <button
                                                    onClick={() => toggleSetting(section.id as keyof CookieSettings)}
                                                    className={`
                                                        relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2
                                                        ${isEnabled ? 'bg-gold-600' : 'bg-gray-200 dark:bg-gray-700'}
                                                    `}
                                                >
                                                    <span className="sr-only">Use setting</span>
                                                    <span
                                                        aria-hidden="true"
                                                        className={`
                                                            pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                                                            ${isEnabled ? 'translate-x-5' : 'translate-x-0'}
                                                        `}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-10 flex items-center justify-end gap-4 sticky bottom-6 z-20"
                >
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-3">
                        <Link
                            href="/"
                            className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-medium transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            Cancel
                        </Link>
                        <button
                            onClick={handleSave}
                            disabled={saved}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white rounded-xl font-semibold transition-all shadow-lg shadow-gold-500/25 hover:shadow-gold-500/40 disabled:opacity-75 disabled:cursor-not-allowed transform active:scale-95"
                        >
                            {saved ? (
                                <>
                                    <Check className="w-5 h-5" />
                                    Preferences Saved
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
