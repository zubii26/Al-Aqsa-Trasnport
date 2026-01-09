import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

interface RecentActivityFeedProps {
    logs: { id: string; action: string; details: string; timestamp: Date; user: string }[];
}

export default function RecentActivityFeed({ logs }: RecentActivityFeedProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-slate-900/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm shadow-slate-200/50 dark:shadow-xl"
        >
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                <Activity size={18} className="text-slate-400" />
                Live Activity
            </h3>
            <div className="space-y-6 relative before:absolute before:left-[19px] before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                {logs.map((log, index) => (
                    <div key={log.id || index} className="relative pl-10">
                        <div className={`
                            absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-slate-50 dark:border-slate-900 flex items-center justify-center z-10
                            ${log.action.includes('DELETE') ? 'bg-red-100 dark:bg-red-500/20 text-red-500' :
                                log.action.includes('UPDATE') ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-500' :
                                    'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-500'}
                        `}>
                            <Activity size={16} />
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors">
                            <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                                {log.action.replace(/_/g, ' ')}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                {log.details}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-mono uppercase tracking-wider">
                                <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                <span>•</span>
                                <span className="text-slate-500 dark:text-slate-400">{log.user}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="text-center py-8 text-slate-500 text-sm pl-10">
                        No recent activity
                    </div>
                )}
            </div>
        </motion.div>
    );
}
