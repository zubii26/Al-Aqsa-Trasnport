'use client';

import React from 'react';

interface VehicleCategoryFilterProps {
    categories: string[];
    selectedCategory: string;
    onSelect: (category: string) => void;
}

export default function VehicleCategoryFilter({ categories, selectedCategory, onSelect }: VehicleCategoryFilterProps) {
    return (
        <div className="flex overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2 mb-6">
            <button
                onClick={() => onSelect('All')}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                    selectedCategory === 'All'
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                }`}
            >
                All
            </button>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-bold transition-all ${
                        selectedCategory === category
                            ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md'
                            : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-slate-400'
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
