'use client';

import { useState, useEffect } from 'react';
import adminStyles from '../admin.module.css';
import { Shield, Clock, RefreshCw, Search, Filter, Download } from 'lucide-react';
import { LogEntry } from '@/lib/logger';
import { motion } from 'framer-motion';

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters
    const [actionFilter, setActionFilter] = useState('ALL');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/logs');
            if (res.ok) {
                const data = await res.json();
                // Sort by newset first by default if not already
                data.sort((a: LogEntry, b: LogEntry) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ['Action', 'Details', 'User', 'IP', 'Timestamp'];
        const csvContent = [
            headers.join(','),
            ...filteredLogs.map(log => [
                log.action,
                `"${log.details.replace(/"/g, '""')}"`,
                log.user || 'System',
                log.ip || '',
                new Date(log.timestamp).toISOString()
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `audit_logs_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const uniqueActions = Array.from(new Set(logs.map(l => l.action).filter(Boolean))).sort();

    const filteredLogs = logs.filter(log => {
        const matchesSearch =
            log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.user || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchesAction = actionFilter === 'ALL' || log.action === actionFilter;

        let matchesDate = true;
        const logDate = new Date(log.timestamp);
        if (startDate) {
            matchesDate = matchesDate && logDate >= new Date(startDate);
        }
        if (endDate) {
            // Add 1 day to end date to include the full day
            const end = new Date(endDate);
            end.setDate(end.getDate() + 1);
            matchesDate = matchesDate && logDate < end;
        }

        return matchesSearch && matchesAction && matchesDate;
    });

    // Pagination Logic
    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className={adminStyles.container}>
            <div className={adminStyles.main}>
                <div className={adminStyles.header}>
                    <div>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={adminStyles.title}
                        >
                            Audit Logs
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-muted-foreground"
                        >
                            Track system activity and security events
                        </motion.p>
                    </div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex gap-3"
                    >
                        <button
                            onClick={fetchLogs}
                            className="flex items-center gap-2 px-4 py-2 bg-background border border-input rounded-lg hover:bg-muted transition-all font-medium shadow-sm hover:shadow-md"
                        >
                            <RefreshCw size={18} className={isLoading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className={adminStyles.glassCard}
                >
                    {/* Toolbar */}
                    <div className="flex flex-col xl:flex-row gap-4 mb-6 p-4 bg-muted/20 rounded-xl border border-border/50">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                            {/* Action Filter */}
                            <select
                                value={actionFilter}
                                onChange={(e) => { setActionFilter(e.target.value); setCurrentPage(1); }}
                                className="px-3 py-2 bg-background border border-input rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                            >
                                <option value="ALL">All Actions</option>
                                {uniqueActions.map(action => (
                                    <option key={action} value={action}>{action}</option>
                                ))}
                            </select>

                            {/* Date Filter */}
                            <div className="flex items-center gap-2 bg-background border border-input rounded-lg px-2">
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent text-sm py-2 outline-none w-32"
                                    title="Start Date"
                                />
                                <span className="text-muted-foreground">-</span>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
                                    className="bg-transparent text-sm py-2 outline-none w-32"
                                    title="End Date"
                                />
                            </div>

                            <button
                                onClick={handleExportCSV}
                                className="px-4 py-2 bg-background border border-input rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium whitespace-nowrap"
                            >
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto min-h-[400px]">
                        <table className={adminStyles.table}>
                            <thead>
                                <tr>
                                    <th className="pl-6">Action</th>
                                    <th>Details</th>
                                    <th>User</th>
                                    <th className="pr-6 text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {paginatedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-12 text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="p-4 bg-muted rounded-full">
                                                    <Shield size={24} className="text-muted-foreground" />
                                                </div>
                                                <p>No logs found matching your criteria</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLogs.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-muted/30 transition-colors group"
                                        >
                                            <td className="pl-6 py-4 font-medium">
                                                <span className={`px-2 py-1 rounded text-xs border ${log.action.includes('DELETE') ? 'bg-red-500/10 text-red-500 border-red-500/20' :
                                                        log.action.includes('UPDATE') ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                                                            log.action.includes('CREATE') ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                                                'bg-slate-500/10 text-slate-500 border-slate-500/20'
                                                    }`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="py-4">
                                                <div className="text-sm text-foreground/80">{log.details}</div>
                                                {log.ip && (
                                                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Shield size={10} /> IP: {log.ip}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2 text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                                                        {(log.user || 'System').charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-muted-foreground">{log.user || 'System'}</span>
                                                </div>
                                            </td>
                                            <td className="pr-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2 text-sm text-muted-foreground font-mono">
                                                    <Clock size={14} className="opacity-50" />
                                                    {new Date(log.timestamp).toLocaleString()}
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-2 p-4 border-t border-border mt-4">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-sm bg-muted rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-sm text-muted-foreground">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 text-sm bg-muted rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
