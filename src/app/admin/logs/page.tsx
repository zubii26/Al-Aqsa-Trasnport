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

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/logs');
            if (res.ok) {
                const data = await res.json();
                setLogs(data);
            }
        } catch (error) {
            console.error('Failed to fetch logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (log.user || '').toLowerCase().includes(searchTerm.toLowerCase())
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
                    <div className="flex flex-col md:flex-row gap-4 mb-6 p-4 bg-muted/20 rounded-xl border border-border/50">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 bg-background border border-input rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium">
                                <Filter size={16} /> Filter
                            </button>
                            <button className="px-4 py-2 bg-background border border-input rounded-lg hover:bg-muted transition-colors flex items-center gap-2 text-sm font-medium">
                                <Download size={16} /> Export
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
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
                                {filteredLogs.length === 0 ? (
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
                                    filteredLogs.map((log, index) => (
                                        <motion.tr
                                            key={log.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="hover:bg-muted/30 transition-colors group"
                                        >
                                            <td className="pl-6 py-4 font-medium">
                                                {log.action}
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
                </motion.div>
            </div>
        </div>
    );
}
