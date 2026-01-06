'use client';

import { Search, Filter, Ban, CheckCircle, AlertTriangle } from 'lucide-react';

interface FinanceFiltersProps {
    search: string;
    onSearchChange: (val: string) => void;
    statusFilter: string;
    onFilterChange: (val: string) => void;
}

export default function FinanceFilters({ search, onSearchChange, statusFilter, onFilterChange }: FinanceFiltersProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search agencies..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-background focus:ring-2 focus:ring-primary/20 outline-none"
                />
            </div>

            <div className="flex gap-2">
                <button
                    onClick={() => onFilterChange('all')}
                    className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${statusFilter === 'all'
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background border-border hover:bg-muted'
                        }`}
                >
                    <Filter size={16} />
                    All
                </button>
                <button
                    onClick={() => onFilterChange('warning')}
                    className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${statusFilter === 'warning'
                            ? 'bg-amber-500 text-white border-amber-500'
                            : 'bg-background border-border hover:bg-amber-50 dark:hover:bg-amber-900/10'
                        }`}
                >
                    <AlertTriangle size={16} />
                    Warning
                </button>
                <button
                    onClick={() => onFilterChange('overdue')}
                    className={`px-4 py-2 rounded-lg border font-medium flex items-center gap-2 transition-colors ${statusFilter === 'overdue'
                            ? 'bg-red-500 text-white border-red-500'
                            : 'bg-background border-border hover:bg-red-50 dark:hover:bg-red-900/10'
                        }`}
                >
                    <Ban size={16} />
                    Overdue
                </button>
            </div>
        </div>
    );
}
