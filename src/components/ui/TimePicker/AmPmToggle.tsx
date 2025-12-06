'use client';

import React from 'react';

interface AmPmToggleProps {
    value: 'AM' | 'PM';
    onChange: (value: 'AM' | 'PM') => void;
}

export default function AmPmToggle({ value, onChange }: AmPmToggleProps) {
    return (
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700 w-fit mx-auto mt-1">
            <button
                type="button"
                onClick={() => onChange('AM')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
                    ${value === 'AM'
                        ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
            >
                AM
            </button>
            <button
                type="button"
                onClick={() => onChange('PM')}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition-all duration-200
                    ${value === 'PM'
                        ? 'bg-white dark:bg-slate-700 text-amber-500 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
            >
                PM
            </button>
        </div>
    );
}
